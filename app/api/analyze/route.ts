import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeResume, InvalidAnalysisError } from '@/lib/gemini';
import pdf from 'pdf-parse';

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_JD_LENGTH = 8000;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Check auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('resume') as File | null;
    // Cap the JD server-side; the textarea's maxLength is only a client hint.
    const jdText = ((formData.get('jd') as string) || '').slice(0, MAX_JD_LENGTH);

    if (!file) {
      return NextResponse.json({ error: 'No resume file provided' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are supported.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: 'This file is larger than 10 MB. Please upload a smaller PDF.' },
        { status: 400 }
      );
    }

    // Guard rail 1: per-user hourly rate limit (max 5 per hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count: hourlyCount } = await supabase
      .from('analyses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', oneHourAgo);

    if ((hourlyCount ?? 0) >= 5) {
      return NextResponse.json(
        { error: 'Rate limit: max 5 analyses per hour. Please try again later.' },
        { status: 429 }
      );
    }

    // Guard rail 4: per-user daily limit (max 10 per rolling 24 hours).
    // A rolling window avoids depending on the server's timezone, which is UTC
    // on Vercel and would reset at a time that makes no sense to the user.
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: dailyCount } = await supabase
      .from('analyses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', oneDayAgo);

    if ((dailyCount ?? 0) >= 10) {
      return NextResponse.json(
        { error: 'Daily limit reached. Max 10 analyses per 24 hours.' },
        { status: 429 }
      );
    }

    // Convert File to Buffer for pdf-parse
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from PDF
    let resumeText: string;
    try {
      const pdfData = await pdf(buffer);
      resumeText = pdfData.text;
    } catch (err) {
      console.error('PDF parse error:', err);
      return NextResponse.json(
        { error: "Couldn't read this PDF (it may be corrupt or password-protected)." },
        { status: 400 }
      );
    }

    if (!resumeText.trim()) {
      return NextResponse.json(
        { error: 'Could not extract text from PDF. Make sure it is not a scanned image.' },
        { status: 400 }
      );
    }

    // Guard rail 3: cap text length before sending to Groq (~10-12 pages max)
    const trimmedResumeText = resumeText.slice(0, 15000);

    // Analyze with Gemini (retry up to 3 times for transient errors)
    let analysisResult!: Awaited<ReturnType<typeof analyzeResume>>;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        analysisResult = await analyzeResume(trimmedResumeText, jdText || undefined);
        break;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        // A malformed model response is worth another attempt, same as a transient 5xx.
        const isRetryable =
          err instanceof InvalidAnalysisError ||
          message.includes('503') ||
          message.includes('UNAVAILABLE') ||
          message.includes('429');
        if (!isRetryable || attempt === 3) throw err;
        console.log(`Gemini attempt ${attempt} failed, retrying in ${attempt * 2}s...`);
        await new Promise((r) => setTimeout(r, attempt * 2000));
      }
    }

    // Upload the PDF only once the analysis succeeded, so a failed Groq call
    // does not leave an orphaned file in storage with no row pointing at it.
    const filename = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filename, buffer, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload resume' }, { status: 500 });
    }

    // Get the public URL (or signed URL for private bucket)
    const { data: urlData } = supabase.storage
      .from('resumes')
      .getPublicUrl(filename);

    const resumeUrl = urlData.publicUrl;

    // Save to database
    const { data: analysis, error: dbError } = await supabase
      .from('analyses')
      .insert({
        user_id: user.id,
        resume_url: resumeUrl,
        resume_filename: file.name,
        jd_text: jdText || null,
        score: analysisResult.score,
        analysis_result: analysisResult,
      })
      .select('id')
      .single();

    if (dbError) {
      console.error('DB error:', dbError);
      // Roll the upload back so the file does not outlive the failed insert.
      const { error: cleanupError } = await supabase.storage
        .from('resumes')
        .remove([filename]);
      if (cleanupError) {
        console.error('Failed to clean up orphaned upload:', filename, cleanupError);
      }
      return NextResponse.json({ error: 'Failed to save analysis' }, { status: 500 });
    }

    return NextResponse.json({ id: analysis.id });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status: 500 }
    );
  }
}

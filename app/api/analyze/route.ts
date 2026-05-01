import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeResume } from '@/lib/gemini';
import pdf from 'pdf-parse';

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
    const jdText = (formData.get('jd') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No resume file provided' }, { status: 400 });
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

    // Guard rail 4: per-user daily limit (max 10 per day)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const { count: dailyCount } = await supabase
      .from('analyses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', todayStart.toISOString());

    if ((dailyCount ?? 0) >= 10) {
      return NextResponse.json(
        { error: 'Daily limit reached. Max 10 analyses per day.' },
        { status: 429 }
      );
    }

    // Convert File to Buffer for pdf-parse
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from PDF
    const pdfData = await pdf(buffer);
    const resumeText = pdfData.text;

    if (!resumeText.trim()) {
      return NextResponse.json(
        { error: 'Could not extract text from PDF. Make sure it is not a scanned image.' },
        { status: 400 }
      );
    }

    // Guard rail 3: cap text length before sending to Groq (~10-12 pages max)
    const trimmedResumeText = resumeText.slice(0, 15000);

    // Upload PDF to Supabase Storage
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

    // Analyze with Gemini (retry up to 3 times for transient errors)
    let analysisResult!: Awaited<ReturnType<typeof analyzeResume>>;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        analysisResult = await analyzeResume(trimmedResumeText, jdText || undefined);
        break;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        const isRetryable = message.includes('503') || message.includes('UNAVAILABLE') || message.includes('429');
        if (!isRetryable || attempt === 3) throw err;
        console.log(`Gemini attempt ${attempt} failed, retrying in ${attempt * 2}s...`);
        await new Promise((r) => setTimeout(r, attempt * 2000));
      }
    }

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

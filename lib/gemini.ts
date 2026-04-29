import Groq from 'groq-sdk';
import type { AnalysisResult } from '@/types';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

const SYSTEM_PROMPT = `You are an expert resume reviewer and career advisor. Analyze the given resume text and provide detailed, actionable feedback.

Return your analysis as JSON with this exact structure:
{
  "score": <number 0-100>,
  "strengths": [<string>, ...],
  "improvements": [<string>, ...],
  "suggestions": [<string>, ...],
  "jd_match": <number 0-100 or null if no JD provided>,
  "overall_feedback": "<string>"
}

Guidelines:
- score: Overall resume quality from 0-100
- strengths: 3-5 specific things the resume does well
- improvements: 3-5 specific areas that need work
- suggestions: 3-5 concrete, actionable steps to improve
- jd_match: If a job description is provided, score how well the resume matches (0-100). null if no JD.
- overall_feedback: 2-3 sentence summary of the resume's effectiveness

IMPORTANT: Return ONLY valid JSON, no markdown, no code fences.`;

export async function analyzeResume(
  resumeText: string,
  jdText?: string
): Promise<AnalysisResult> {
  let userPrompt = `Here is the resume text:\n\n${resumeText}`;

  if (jdText?.trim()) {
    userPrompt += `\n\nHere is the job description to match against:\n\n${jdText}`;
  }

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  });

  const text = response.choices[0]?.message?.content ?? '';
  const result: AnalysisResult = JSON.parse(text);
  return result;
}

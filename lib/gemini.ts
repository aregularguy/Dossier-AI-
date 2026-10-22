import Groq from 'groq-sdk';
import { z } from 'zod';
import type { AnalysisResult } from '@/types';

// Groq retires model IDs without notice, so allow an override without a redeploy.
const MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';

let groq: Groq;
function getGroqClient() {
  if (!groq) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });
  }
  return groq;
}

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

/** Thrown when the model returns JSON that does not match the expected shape. */
export class InvalidAnalysisError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidAnalysisError';
  }
}

// The model is told to return this shape, but it is not guaranteed to.
// Parsing here means a bad response is thrown and retried by the caller
// instead of reaching the results page and crashing on `.map`.
const AnalysisResultSchema = z.object({
  score: z.number().min(0).max(100),
  strengths: z.array(z.string()).default([]),
  improvements: z.array(z.string()).default([]),
  suggestions: z.array(z.string()).default([]),
  jd_match: z.number().min(0).max(100).nullable().default(null),
  overall_feedback: z.string().default(''),
});

export async function analyzeResume(
  resumeText: string,
  jdText?: string
): Promise<AnalysisResult> {
  let userPrompt = `Here is the resume text:\n\n${resumeText}`;

  if (jdText?.trim()) {
    userPrompt += `\n\nHere is the job description to match against:\n\n${jdText}`;
  }

  const response = await getGroqClient().chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  });

  const text = response.choices[0]?.message?.content ?? '';

  try {
    return AnalysisResultSchema.parse(JSON.parse(text)) as AnalysisResult;
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new InvalidAnalysisError(`Model returned an unusable analysis: ${detail}`);
  }
}

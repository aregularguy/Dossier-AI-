// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  created_at: string;
}

// Analysis types
export interface Analysis {
  id: string;
  user_id: string;
  resume_url: string;
  resume_filename: string;
  jd_text?: string;
  score: number;
  analysis_result: AnalysisResult;
  created_at: string;
}

export interface AnalysisResult {
  score: number;
  strengths: string[];
  improvements: string[];
  jd_match?: number | null;
  suggestions: string[];
  overall_feedback: string;
}

// Form types
export interface AnalyzeFormData {
  resume_file: File;
  jd_text?: string;
}

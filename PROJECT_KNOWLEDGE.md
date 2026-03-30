# Resume Reviewer App - Project Knowledge

## Project Overview

An AI-powered resume review application that helps users analyze their resumes, get improvement suggestions, and match them against job descriptions using Google Gemini AI.

---

## Tech Stack

### Frontend & Backend
- **Next.js 16** (App Router) - Full-stack React framework
- **TypeScript** - Type safety
- **Mantine UI** - Component library (replacing Tailwind CSS)
- **React PDF** - PDF viewing and text extraction

### Backend Services
- **Supabase** - Backend-as-a-Service
  - Authentication (Google SSO)
  - PostgreSQL Database
  - File Storage (resume PDFs)
  - Auto-generated APIs

- **Google Gemini AI** - LLM for resume analysis
  - Using free tier API
  - Model: Gemini 1.5 Flash/Pro

### Architecture Pattern
- **Monorepo** - Single repository for entire app
- **Next.js API Routes** - Backend logic instead of separate FastAPI
- **Server-side rendering** - Next.js handles all backend operations

---

## Key Architecture Decisions

### 1. Why Next.js API Routes Instead of FastAPI?
- Simpler single-codebase deployment
- No CORS issues
- Sufficient for PDF text extraction and LLM calls
- Easier to maintain

### 2. Why Mantine UI Instead of Shadcn?
- Install once, all components available
- No CLI commands for each component
- Rich component library with hooks
- Better developer experience

### 3. Why Supabase?
- Built-in Google OAuth (no custom auth needed)
- PDF storage without building file system
- Database with auto-generated APIs
- Free tier suitable for MVP

### 4. Resume Editing Decision
**NOT IMPLEMENTED (for now):**
- Direct PDF editing with pinpoint accuracy
- Visual resume builder
- PDF annotation/overlay

**Reason:** PDF editing with layout preservation is extremely complex. Focusing on core analysis features first.

---

## Features (Simplified Scope)

### Core Features ✅
1. **Upload Resume PDF**
   - Drag & drop or file input
   - Store in Supabase Storage

2. **Optional Job Description Input**
   - Textarea for JD text
   - Skip for general review

3. **AI Analysis Report**
   - Overall score (0-100)
   - Strengths (bullet points)
   - Improvements needed
   - JD match percentage (if JD provided)
   - Text-based suggestions

4. **History**
   - View past analyses
   - Stored in Supabase database

5. **Google SSO Authentication**
   - Login with Google account
   - User identity management

### Out of Scope (Phase 1) ❌
- Resume preview/editing
- Resume builder
- PDF generation
- Direct text modifications

---

## Application Pages

### 1. Landing Page (`/`)
- Hero section with app description
- "Sign in with Google" CTA
- Feature highlights
- Redirect to dashboard if authenticated

### 2. Dashboard (`/dashboard`)
- Protected route (requires auth)
- Welcome message
- "Analyze New Resume" button
- Recent analyses list

### 3. Analyze Page (`/analyze`)
- Step 1: Upload resume PDF (drag & drop)
- Step 2: Add job description (optional textarea)
- Submit and loading state
- Redirect to results

### 4. Results Page (`/results/[id]`)
- Analysis display (text-based)
- Overall score with visual gauge
- Strengths section
- Improvements section
- JD match score (if applicable)
- Download/share options

### 5. History Page (`/history`)
- List of previous analyses
- Each card shows: filename, score, date
- Click to view full results

---

## Database Schema (Supabase)

### Tables

**users** (handled by Supabase Auth automatically)

**analyses**
```sql
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  resume_url TEXT NOT NULL,           -- Supabase storage URL
  resume_filename TEXT,
  jd_text TEXT,                       -- Optional job description
  score INTEGER,                      -- 0-100
  analysis_result JSONB NOT NULL,     -- Full AI response
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Storage Buckets

**resumes** bucket structure:
```
resumes/
├── user_123_uuid/
│   ├── resume_timestamp.pdf
│   └── resume_timestamp2.pdf
└── user_456_uuid/
    └── resume_timestamp.pdf
```

---

## API Routes (Next.js)

### `/api/analyze` (POST)
**Input:**
- `resumeUrl` - Supabase storage URL
- `jdText` - Optional job description string

**Process:**
1. Download PDF from Supabase
2. Extract text using pdf-parse
3. Build prompt for Gemini
4. Call Gemini API
5. Parse response
6. Save to database
7. Return analysis results

**Output:**
```json
{
  "id": "uuid",
  "score": 78,
  "strengths": ["...", "..."],
  "improvements": ["...", "..."],
  "jdMatch": 85,
  "suggestions": ["...", "..."]
}
```

### `/api/extract-text` (POST)
**Input:** PDF file or URL

**Output:** Extracted text content

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

---

## User Flow

1. User visits landing page → Clicks "Sign in with Google"
2. Google OAuth popup → User authenticates → Redirected to dashboard
3. Dashboard → Clicks "Analyze New Resume" → Upload page
4. Uploads PDF → (Optional) Adds JD → Clicks "Analyze"
5. Loading screen (AI analyzing) → Results page
6. Views detailed analysis with score and suggestions
7. Can navigate to history to see past analyses

---

## API Usage & Costs

### Gemini API (Free Tier)
- 15 requests/minute
- Sufficient for single-user MVP
- Can upgrade to paid tier later

### Supabase (Free Tier)
- 500MB database storage
- 1GB file storage
- 50MB max file upload size
- Suitable for development and testing

---

## Installation Commands

### Create Next.js Project (Already Done)
```bash
npx create-next-app@latest .
```

### Remove Tailwind CSS
```bash
npm uninstall tailwindcss @tailwindcss/postcss
```

### Install Mantine UI
```bash
npm install @mantine/core @mantine/hooks @mantine/form @mantine/dropzone @mantine/notifications
npm install @tabler/icons-react
```

### Install Dependencies
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install react-pdf pdf-parse
npm install @google/generative-ai
```

---

## Next Steps

1. ✅ Create Next.js project
2. ⏳ Remove Tailwind CSS
3. ⏳ Install Mantine UI and dependencies
4. ⏳ Setup Supabase project
5. ⏳ Configure Google OAuth
6. ⏳ Get Gemini API key
7. ⏳ Build UI components
8. ⏳ Implement API routes
9. ⏳ Connect frontend to backend
10. ⏳ Test and deploy

---

## Notes & Decisions

- **Google SSO uses YOUR Gemini API key**, not the user's personal quota
- Users authenticate to save their analysis history, not to use their own API
- Keeping solution simple - text analysis only, no visual editing
- Focus on delivering value through AI insights, not complex PDF manipulation
- Can add resume builder/editor in Phase 2 if needed

---

**Last Updated:** March 27, 2026
**Session:** Resume-Reviewer App

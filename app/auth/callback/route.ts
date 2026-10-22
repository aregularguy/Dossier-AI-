import { createClient } from '@/lib/supabase/server';
import { safeNextPath } from '@/lib/safe-next';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Send them back where they were headed, defaulting to the dashboard.
  const next = safeNextPath(requestUrl.searchParams.get('next'));
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}

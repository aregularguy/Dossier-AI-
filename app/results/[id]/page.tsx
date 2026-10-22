import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ResultsDisplay from '@/components/ResultsDisplay';
import type { Analysis } from '@/types';

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/signin');
  }

  const { data: analysis } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single<Analysis>();

  if (!analysis) {
    notFound();
  }

  const userName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0];

  return (
    <>
      <Navbar
        user={{
          name: userName,
          email: user.email,
          avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture,
        }}
      />
      <ResultsDisplay
        filename={analysis.resume_filename}
        result={analysis.analysis_result}
        jdText={analysis.jd_text}
        createdAt={analysis.created_at}
      />
    </>
  );
}

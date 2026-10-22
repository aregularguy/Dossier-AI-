import { Container, Stack, Text, Title } from '@mantine/core';
import { redirect } from 'next/navigation';
import AnalyzeForm from '@/components/AnalyzeForm';
import Navbar from '@/components/Navbar';
import { ink, textDimmed } from '@/lib/design';
import { createClient } from '@/lib/supabase/server';

export default async function AnalyzePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/signin');
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
      <Container size="sm" py={{ base: 32, md: 48 }} px="md">
        <Stack gap={28}>
          <Stack gap={6}>
            <Title order={1} fz={{ base: 26, sm: 32 }} fw={600} c={ink}>
              New analysis
            </Title>
            <Text fz={14} c={textDimmed} lh={1.6}>
              Two steps. The resume is required; the job description is what makes
              the report specific to the role.
            </Text>
          </Stack>
          <AnalyzeForm />
        </Stack>
      </Container>
    </>
  );
}

import { Container, Stack, Text, Title, Group } from '@mantine/core';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import HistoryList from '@/components/HistoryList';
import type { Analysis } from '@/types';

export default async function HistoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/signin');
  }

  const { data: analyses } = await supabase
    .from('analyses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .returns<Analysis[]>();

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
      <Container size="sm" py={56} px="md">
        <Stack gap="xl">
          <Group justify="space-between" align="baseline">
            <div>
              <Title order={3} fw={600} c="dark.8">
                History
              </Title>
              <Text size="sm" c="dimmed" mt={4}>
                Your past resume analyses
              </Text>
            </div>
            <Text size="sm" c="dimmed">
              {analyses?.length ?? 0} {analyses?.length === 1 ? 'analysis' : 'analyses'}
            </Text>
          </Group>

          <HistoryList analyses={analyses ?? []} />
        </Stack>
      </Container>
    </>
  );
}

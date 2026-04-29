import { Container, Stack, Text, Title, Group } from '@mantine/core';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import HistoryList from '@/components/HistoryList';
import DocumentHistory from '@/components/DocumentHistory';
import type { Analysis } from '@/types';

interface Document {
  id: string;
  filename: string;
  page_count: number | null;
  chunk_count: number;
  status: string;
  created_at: string;
}

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

  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .returns<Document[]>();

  const userName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0];

  const totalItems = (analyses?.length ?? 0) + (documents?.length ?? 0);

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
                Your past activity
              </Text>
            </div>
            <Text size="sm" c="dimmed">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </Text>
          </Group>

          {/* Resume Analyses */}
          <Stack gap="sm">
            <Text size="xs" fw={600} c="dark.4" tt="uppercase" style={{ letterSpacing: '0.05em' }}>
              Resume analyses
            </Text>
            <HistoryList analyses={analyses ?? []} />
          </Stack>

          {/* RAG Documents */}
          <Stack gap="sm">
            <Text size="xs" fw={600} c="dark.4" tt="uppercase" style={{ letterSpacing: '0.05em' }}>
              Indexed documents
            </Text>
            <DocumentHistory documents={documents ?? []} />
          </Stack>
        </Stack>
      </Container>
    </>
  );
}

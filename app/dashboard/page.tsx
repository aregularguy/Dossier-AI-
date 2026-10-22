import { Box, Container, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import DashboardCards from '@/components/DashboardCards';
import HistoryList from '@/components/HistoryList';
import { cardLine, display, ink, textDimmed } from '@/lib/design';
import { createClient } from '@/lib/supabase/server';
import type { Analysis } from '@/types';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Box
      p="lg"
      style={{
        background: '#fff',
        border: `1px solid ${cardLine}`,
        borderRadius: 20,
      }}
    >
      <Stack gap={4}>
        <Text fz={28} fw={600} c={ink} ff={display} lh={1.1}>
          {value}
        </Text>
        <Text fz={12} c={textDimmed}>
          {label}
        </Text>
      </Stack>
    </Box>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/signin');
  }

  const { data: allAnalyses } = await supabase
    .from('analyses')
    .select('id, score, created_at, jd_text')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .returns<Pick<Analysis, 'id' | 'score' | 'created_at' | 'jd_text'>[]>();

  const { data: recentAnalyses } = await supabase
    .from('analyses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)
    .returns<Analysis[]>();

  const rows = allAnalyses ?? [];
  const total = rows.length;
  const latest = rows[0];
  const average =
    total > 0 ? Math.round(rows.reduce((sum, r) => sum + r.score, 0) / total) : 0;
  const best = total > 0 ? Math.max(...rows.map((r) => r.score)) : 0;

  const userName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0];
  const firstName = userName?.split(' ')[0] || 'there';

  return (
    <>
      <Navbar
        user={{
          name: userName,
          email: user.email,
          avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture,
        }}
      />
      <Container size="lg" py={{ base: 32, md: 48 }} px="md">
        <Stack gap={36}>
          <Stack gap={6}>
            <Title order={1} fz={{ base: 26, sm: 32 }} fw={600} c={ink}>
              {getGreeting()}, {firstName}
            </Title>
            <Text fz={14} c={textDimmed}>
              {total === 0
                ? 'Nothing analysed yet. Upload a resume and we will tell you what to fix.'
                : `${total} ${total === 1 ? 'analysis' : 'analyses'} so far. Your last one scored ${latest?.score ?? 0}.`}
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 2, sm: 4 }} spacing={{ base: 'sm', md: 'md' }}>
            <Stat label="Analyses run" value={String(total)} />
            <Stat label="Average score" value={total > 0 ? String(average) : '—'} />
            <Stat label="Best score" value={total > 0 ? String(best) : '—'} />
            <Stat
              label="With a job description"
              value={
                total > 0
                  ? String(rows.filter((r) => Boolean(r.jd_text)).length)
                  : '—'
              }
            />
          </SimpleGrid>

          <DashboardCards />

          <Stack gap="sm">
            <Group justify="space-between" align="baseline">
              <Text
                fz={11}
                fw={600}
                c={textDimmed}
                tt="uppercase"
                style={{ letterSpacing: '0.08em' }}
              >
                Recent analyses
              </Text>
            </Group>
            <HistoryList analyses={recentAnalyses ?? []} />
          </Stack>
        </Stack>
      </Container>
    </>
  );
}

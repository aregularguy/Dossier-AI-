import { Container, Text, Stack, Group } from '@mantine/core';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import DashboardCards from '@/components/DashboardCards';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/signin');
  }

  const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0];
  const userEmail = user.email;
  const userAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const firstName = userName?.split(' ')[0] || 'there';

  return (
    <>
      <Navbar
        user={{
          name: userName,
          email: userEmail,
          avatar: userAvatar,
        }}
      />
      <Container size="sm" py={56} px="md">
        <Stack gap={40}>
          <Group justify="space-between" align="baseline">
            <Text size="md" c="dark.6" fw={500}>
              {getGreeting()}, {firstName}
            </Text>
          </Group>

          <DashboardCards />

          <Stack gap="xs">
            <Text size="xs" fw={600} c="dark.4" tt="uppercase" style={{ letterSpacing: '0.05em' }}>
              Recent
            </Text>
            <Text size="sm" c="dimmed">
              No analyses yet. Start by reviewing a resume or uploading a document.
            </Text>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}

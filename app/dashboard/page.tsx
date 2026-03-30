import { Container, Title, Text, Card, Stack, Group, Badge } from '@mantine/core';
import { IconSparkles } from '@tabler/icons-react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import DashboardCards from '@/components/DashboardCards';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/signin');
  }

  // Get user metadata
  const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0];
  const userEmail = user.email;
  const userAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture;

  return (
    <>
      <Navbar
        user={{
          name: userName,
          email: userEmail,
          avatar: userAvatar,
        }}
      />
      <Container size="lg" py={60}>
        <Stack gap="xl">
          {/* Welcome Section */}
          <div>
            <Group gap="xs" mb="sm">
              <Title order={1} fw={800}>
                Welcome back, {userName}!
              </Title>
              <Badge
                size="lg"
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                leftSection={<IconSparkles size={14} />}
              >
                AI-Powered
              </Badge>
            </Group>
            <Text size="lg" c="dimmed">
              Ready to improve your resume? Upload a new one or view your analysis history.
            </Text>
          </div>

          {/* Action Cards */}
          <DashboardCards />

          {/* Info Section */}
          <Card shadow="sm" padding="lg" radius="md" style={{ background: '#f8f9fa' }}>
            <Stack gap="sm">
              <Title order={4} fw={700}>
                How It Works
              </Title>
              <Text size="sm" c="dimmed">
                1. Upload your resume PDF
                <br />
                2. Optionally add a job description for targeted analysis
                <br />
                3. Get instant AI feedback with actionable suggestions
                <br />
                4. Review your analysis history anytime
              </Text>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </>
  );
}

import { Container, Title, Text, Stack } from '@mantine/core';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import AskChat from '@/components/AskChat';

export default async function AskPage() {
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
  const userEmail = user.email;
  const userAvatar =
    user.user_metadata?.avatar_url || user.user_metadata?.picture;

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
        <Stack gap="xl">
          <div>
            <Title order={3} fw={600} c="dark.8">
              Ask my documents
            </Title>
            <Text size="sm" c="dimmed" mt={4}>
              Upload a PDF and ask questions about its content.
            </Text>
          </div>
          <AskChat />
        </Stack>
      </Container>
    </>
  );
}

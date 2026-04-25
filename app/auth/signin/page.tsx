'use client';

import { Container, Paper, Title, Text, Button, Stack, Center } from '@mantine/core';
import { IconBrandGoogle } from '@tabler/icons-react';
import { createClient } from '@/lib/supabase/client';
import { notifications } from '@mantine/notifications';

export default function SignInPage() {
  const supabase = createClient();

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        notifications.show({
          title: 'Error',
          message: error.message,
          color: 'red',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to sign in with Google',
        color: 'red',
      });
    }
  };

  return (
    <Container size="xs" py={80}>
      <Center style={{ minHeight: '60vh' }}>
        <Paper shadow="lg" p="xl" radius="md" style={{ width: '100%', maxWidth: 400 }}>
          <Stack gap="lg">
            <Stack gap="xs">
              <Title order={2} ta="center" fw={700}>
                Welcome Back
              </Title>
              <Text size="sm" c="dimmed" ta="center">
                Sign in to continue to Resume Reviewer AI
              </Text>
            </Stack>

            <Button
              size="lg"
              variant="filled"
              color="brand"
              leftSection={<IconBrandGoogle size={20} />}
              onClick={handleGoogleSignIn}
              fullWidth
            >
              Sign in with Google
            </Button>

            <Text size="xs" c="dimmed" ta="center">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </Text>
          </Stack>
        </Paper>
      </Center>
    </Container>
  );
}

'use client';

import {
  Anchor,
  Box,
  Button,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconBrandGoogle,
  IconCheck,
  IconFileText,
  IconQuote,
} from '@tabler/icons-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { notifications } from '@mantine/notifications';
import { signInHighlights } from '@/lib/pricing';
import { safeNextPath } from '@/lib/safe-next';

export default function SignInPage() {
  const supabase = createClient();

  const handleGoogleSignIn = async () => {
    try {
      // Read `next` at click time rather than with useSearchParams, which
      // would force this page behind a Suspense boundary.
      const next = safeNextPath(
        new URLSearchParams(window.location.search).get('next')
      );
      const callback = new URL('/auth/callback', window.location.origin);
      callback.searchParams.set('next', next);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: callback.toString() },
      });
      if (error) {
        notifications.show({ title: 'Error', message: error.message, color: 'red' });
      }
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Failed to sign in with Google',
        color: 'red',
      });
    }
  };

  return (
    <SimpleGrid
      cols={{ base: 1, lg: 2 }}
      spacing={0}
      style={{ minHeight: '100dvh', alignItems: 'stretch' }}
    >
      {/* ---------- Left: form ---------- */}
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 'clamp(1.5rem, 5vw, 3.5rem)',
          background: '#fff',
        }}
      >
        <Anchor component={Link} href="/" underline="never" c="dark.6">
          <Group gap={6}>
            <IconArrowLeft size={16} />
            <Text size="sm">Back to home</Text>
          </Group>
        </Anchor>

        <Box style={{ width: '100%', maxWidth: 380, margin: '0 auto' }}>
          <Stack gap="xl">
            <Group gap="xs">
              <Box
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  display: 'grid',
                  placeItems: 'center',
                  background:
                    '#101217',
                }}
              >
                <IconFileText size={22} color="#4FD1E8" />
              </Box>
              <Text fw={700} fz="lg" c="dark.8" style={{ letterSpacing: '-0.02em' }}>
                Dossier AI
              </Text>
            </Group>

            <Stack gap={6}>
              <Title order={1} fz={30} fw={700} c="dark.8" style={{ letterSpacing: '-0.02em' }}>
                Welcome back
              </Title>
              <Text size="sm" c="dimmed" lh={1.6}>
                Sign in to analyze resumes and ask questions about your documents.
              </Text>
            </Stack>

            <Button
              size="lg"
              radius="md"
              variant="default"
              leftSection={<IconBrandGoogle size={18} />}
              onClick={handleGoogleSignIn}
              fullWidth
              styles={{ root: { fontWeight: 600 } }}
            >
              Continue with Google
            </Button>

            <Divider label="Secure sign-in via Google OAuth" labelPosition="center" />

            <Text size="xs" c="dimmed" ta="center" lh={1.6}>
              By continuing, you agree to our{' '}
              <Anchor component={Link} href="/terms" size="xs">
                Terms
              </Anchor>{' '}
              and{' '}
              <Anchor component={Link} href="/privacy" size="xs">
                Privacy Policy
              </Anchor>
              .
            </Text>
          </Stack>
        </Box>

        <Text size="xs" c="dimmed" ta="center">
          New to Dossier AI? Signing in creates your free account automatically.
        </Text>
      </Box>

      {/* ---------- Right: value panel ---------- */}
      <Box
        visibleFrom="lg"
        style={{
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          padding: 'clamp(2rem, 5vw, 4.5rem)',
          background:
            '#101217',
        }}
      >
        {/* decorative glows */}
        <Box
          style={{
            position: 'absolute',
            width: 420,
            height: 420,
            borderRadius: '50%',
            top: -120,
            right: -100,
            background: 'rgba(255,255,255,0.12)',
            filter: 'blur(8px)',
          }}
        />
        <Box
          style={{
            position: 'absolute',
            width: 320,
            height: 320,
            borderRadius: '50%',
            bottom: -120,
            left: -80,
            background: 'rgba(79,209,232,0.14)',
            filter: 'blur(8px)',
          }}
        />

        <Stack gap={40} style={{ position: 'relative', maxWidth: 460 }}>
          <Title order={2} fz={38} fw={800} c="#fff" lh={1.15} style={{ letterSpacing: '-0.02em' }}>
            Know exactly what to fix before you apply
          </Title>

          <Stack gap="md">
            {signInHighlights.map((item) => (
              <Group key={item} gap="sm" align="flex-start" wrap="nowrap">
                <Box
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 7,
                    flexShrink: 0,
                    display: 'grid',
                    placeItems: 'center',
                    background: 'rgba(255,255,255,0.18)',
                  }}
                >
                  <IconCheck size={14} color="#fff" />
                </Box>
                <Text size="sm" c="rgba(255,255,255,0.92)" lh={1.55}>
                  {item}
                </Text>
              </Group>
            ))}
          </Stack>

          <Paper radius="lg" p="lg" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)' }}>
            <Group gap="sm" align="flex-start" wrap="nowrap">
              <IconQuote size={22} color="rgba(255,255,255,0.6)" style={{ flexShrink: 0 }} />
              <Stack gap={4}>
                <Text size="sm" c="#fff" lh={1.6} fs="italic">
                  &ldquo;Rewrote three bullet points it flagged and started getting callbacks
                  the same week.&rdquo;
                </Text>
                <Text size="xs" c="rgba(255,255,255,0.7)">
                  — Priya, product designer
                </Text>
              </Stack>
            </Group>
          </Paper>

          <Group justify="space-between" align="center">
            <Text size="sm" c="rgba(255,255,255,0.8)">
              Free to start · Pro from <b style={{ color: '#fff' }}>$10/mo</b>
            </Text>
            <Anchor component={Link} href="/pricing" size="sm" c="#fff" fw={600}>
              See plans →
            </Anchor>
          </Group>
        </Stack>
      </Box>
    </SimpleGrid>
  );
}

'use client';

import { Box, Button, Container, Group, Paper, Stack, Text, Title } from '@mantine/core';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

const steps = [
  {
    n: '1',
    title: 'Upload your resume',
    description: 'PDF drag & drop',
  },
  {
    n: '2',
    title: 'Add a job description',
    description: 'Optional — paste JD text',
  },
  {
    n: '3',
    title: 'Get your analysis',
    description: 'Score, suggestions, match %',
  },
] as const;

export default function Home() {
  return (
    <>
      <Navbar user={null} />

      <Box component="main">
        <Container size="lg" py={{ base: 100, md: 120 }} px="md">
          <Stack gap={100} align="stretch">
            <Stack gap="xl" align="flex-start" maw={640}>
              <Title
                order={1}
                fz={{ base: 36, sm: 44, md: 52 }}
                fw={700}
                lh={1.15}
                c="dark.8"
                style={{ letterSpacing: '-0.03em' }}
              >
                Know exactly what to fix on your resume
              </Title>
              <Text size="lg" c="dimmed" lh={1.65} maw={560}>
                In about 30 seconds you get a clear score, line-by-line suggestions, and—if you paste a
                job description—a match readout so you see what&apos;s missing before you hit apply.
              </Text>
              <Stack gap="sm" mt="md">
                <Button
                  component={Link}
                  href="/auth/signin"
                  size="lg"
                  radius="md"
                  color="brand"
                  variant="filled"
                >
                  Analyze My Resume
                </Button>
                <Text size="sm" c="dimmed">
                  Free to use · No credit card · Powered by Gemini
                </Text>
              </Stack>
            </Stack>

            <Stack gap="xl">
              <Title order={2} fz={{ base: 22, sm: 26 }} fw={600} c="dark.7">
                How it works
              </Title>
              <Group grow align="flex-start" gap="xl" wrap="wrap">
                {steps.map((step) => (
                  <Stack key={step.n} gap="xs" maw={{ base: '100%', sm: 360 }} style={{ flex: '1 1 12.5rem' }}>
                    <Text fz={48} fw={800} lh={1} c="brand.6" style={{ letterSpacing: '-0.04em' }}>
                      {step.n}
                    </Text>
                    <Text fw={600} size="md" c="dark.8">
                      {step.title}
                    </Text>
                    <Text size="sm" c="dimmed" lh={1.55}>
                      {step.description}
                    </Text>
                  </Stack>
                ))}
              </Group>
            </Stack>
          </Stack>
        </Container>

        <Paper radius={0} bg="brand.0" py={{ base: 64, md: 80 }} mt={{ base: 40, md: 60 }}>
          <Container size="sm" px="md">
            <Stack gap="lg" align="center" ta="center">
              <Text size="lg" fw={500} c="dark.7">
                Ready to improve your resume?
              </Text>
              <Button component={Link} href="/auth/signin" size="md" color="brand" variant="filled">
                Get Started
              </Button>
            </Stack>
          </Container>
        </Paper>
      </Box>
    </>
  );
}

'use client';

import { Container, Title, Text, Button, Stack, Card, Group, Badge, Box } from '@mantine/core';
import { IconFileText, IconChartBar, IconTarget, IconSparkles } from '@tabler/icons-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar user={null} />
      <Container size="lg" py={80}>
        <Stack align="center" gap={60}>
          {/* Hero Section */}
          <Stack align="center" gap="xl" style={{ textAlign: 'center' }}>
            <Badge
              size="lg"
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
              leftSection={<IconSparkles size={16} />}
            >
              AI-Powered Resume Analysis
            </Badge>

            <Title
              order={1}
              size={56}
              fw={800}
              style={{
                background: 'linear-gradient(135deg, #228be6 0%, #15aabf 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
              }}
            >
              Resume Reviewer AI
            </Title>

            <Text size="xl" c="dimmed" maw={650} style={{ lineHeight: 1.6 }}>
              Get instant AI-powered feedback on your resume. Improve your chances with personalized suggestions and job description matching powered by Google Gemini.
            </Text>

            <Button
              component={Link}
              href="/auth/signin"
              size="xl"
              mt="md"
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
              style={{ fontSize: '1.1rem', padding: '12px 48px' }}
            >
              Get Started - Sign in with Google
            </Button>
          </Stack>

          {/* Features Section */}
          <Box w="100%" maw={900}>
            <Title order={2} ta="center" mb={40} fw={700} size={36}>
              Why Choose Resume Reviewer?
            </Title>

            <Group grow align="stretch" gap="lg">
              <Card shadow="md" padding="xl" radius="md" style={{ border: '1px solid #e9ecef' }}>
                <Stack align="center" gap="md" style={{ textAlign: 'center' }}>
                  <Box
                    style={{
                      background: 'linear-gradient(135deg, #228be6 0%, #15aabf 100%)',
                      borderRadius: '50%',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconFileText size={32} color="white" />
                  </Box>
                  <Text fw={700} size="lg">AI Resume Analysis</Text>
                  <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                    Upload your resume and get instant AI feedback on formatting, content structure, and overall impact
                  </Text>
                </Stack>
              </Card>

              <Card shadow="md" padding="xl" radius="md" style={{ border: '1px solid #e9ecef' }}>
                <Stack align="center" gap="md" style={{ textAlign: 'center' }}>
                  <Box
                    style={{
                      background: 'linear-gradient(135deg, #15aabf 0%, #0ca678 100%)',
                      borderRadius: '50%',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconTarget size={32} color="white" />
                  </Box>
                  <Text fw={700} size="lg">JD Matching</Text>
                  <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                    Compare your resume against job descriptions to see compatibility and missing keywords
                  </Text>
                </Stack>
              </Card>

              <Card shadow="md" padding="xl" radius="md" style={{ border: '1px solid #e9ecef' }}>
                <Stack align="center" gap="md" style={{ textAlign: 'center' }}>
                  <Box
                    style={{
                      background: 'linear-gradient(135deg, #0ca678 0%, #fab005 100%)',
                      borderRadius: '50%',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconChartBar size={32} color="white" />
                  </Box>
                  <Text fw={700} size="lg">Smart Suggestions</Text>
                  <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                    Get actionable, personalized recommendations to enhance your resume and stand out
                  </Text>
                </Stack>
              </Card>
            </Group>
          </Box>
        </Stack>
      </Container>
    </>
  );
}

'use client';

import { Card, Stack, Group, Title, Text, Button } from '@mantine/core';
import { IconFileUpload, IconHistory } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';

export default function DashboardCards() {
  const [analyzeHover, setAnalyzeHover] = useState(false);
  const [historyHover, setHistoryHover] = useState(false);

  return (
    <Group grow align="stretch" gap="lg">
      <Card
        shadow="md"
        padding="xl"
        radius="md"
        style={{
          border: '2px solid #228be6',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          transform: analyzeHover ? 'translateY(-4px)' : 'translateY(0)',
        }}
        component={Link}
        href="/analyze"
        onMouseEnter={() => setAnalyzeHover(true)}
        onMouseLeave={() => setAnalyzeHover(false)}
      >
        <Stack align="center" gap="md" style={{ textAlign: 'center' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #228be6 0%, #15aabf 100%)',
              borderRadius: '50%',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconFileUpload size={40} color="white" />
          </div>
          <div>
            <Title order={3} mb="xs" fw={700}>
              Analyze New Resume
            </Title>
            <Text size="sm" c="dimmed">
              Upload your resume and get instant AI-powered feedback
            </Text>
          </div>
          <Button
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
            size="md"
            fullWidth
          >
            Get Started
          </Button>
        </Stack>
      </Card>

      <Card
        shadow="md"
        padding="xl"
        radius="md"
        style={{
          border: '1px solid #e9ecef',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          transform: historyHover ? 'translateY(-4px)' : 'translateY(0)',
        }}
        component={Link}
        href="/history"
        onMouseEnter={() => setHistoryHover(true)}
        onMouseLeave={() => setHistoryHover(false)}
      >
        <Stack align="center" gap="md" style={{ textAlign: 'center' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #15aabf 0%, #0ca678 100%)',
              borderRadius: '50%',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconHistory size={40} color="white" />
          </div>
          <div>
            <Title order={3} mb="xs" fw={700}>
              View History
            </Title>
            <Text size="sm" c="dimmed">
              Access your past resume analyses and track improvements
            </Text>
          </div>
          <Button variant="outline" size="md" fullWidth>
            View History
          </Button>
        </Stack>
      </Card>
    </Group>
  );
}

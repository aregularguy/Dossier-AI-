'use client';

import { Stack, Paper, Group, Text, Badge, UnstyledButton, ThemeIcon } from '@mantine/core';
import { IconFileText, IconArrowUpRight, IconInbox } from '@tabler/icons-react';
import Link from 'next/link';
import type { Analysis } from '@/types';

function getScoreColor(score: number) {
  if (score >= 80) return 'green';
  if (score >= 60) return 'yellow';
  return 'red';
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

interface Props {
  analyses: Analysis[];
}

export default function HistoryList({ analyses }: Props) {
  if (analyses.length === 0) {
    return (
      <Paper withBorder p="xl" radius="md">
        <Stack align="center" gap="sm" py="xl">
          <ThemeIcon size={48} radius="xl" variant="light" color="gray">
            <IconInbox size={24} />
          </ThemeIcon>
          <Text fw={500} c="dark.7">No analyses yet</Text>
          <Text size="sm" c="dimmed" ta="center">
            Upload a resume to get started. Your results will appear here.
          </Text>
        </Stack>
      </Paper>
    );
  }

  return (
    <Stack gap={0} style={{ borderRadius: 12, border: '1px solid #e9ecef', overflow: 'hidden' }}>
      {analyses.map((analysis, i) => (
        <UnstyledButton
          key={analysis.id}
          component={Link}
          href={`/results/${analysis.id}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            backgroundColor: '#fff',
            borderBottom: i < analyses.length - 1 ? '1px solid #f1f3f5' : 'none',
            transition: 'background-color 0.12s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8f9fa'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; }}
        >
          <Group gap={14} wrap="nowrap">
            <ThemeIcon size={36} radius={9} variant="light" color="brand" style={{ flexShrink: 0 }}>
              <IconFileText size={18} />
            </ThemeIcon>
            <div>
              <Text size="sm" fw={600} c="dark.8" truncate maw={260}>
                {analysis.resume_filename}
              </Text>
              <Text size="xs" c="dimmed" mt={2}>
                {formatDate(analysis.created_at)}
                {analysis.jd_text ? ' · With JD' : ''}
              </Text>
            </div>
          </Group>

          <Group gap="sm" wrap="nowrap">
            <Badge
              color={getScoreColor(analysis.score)}
              variant="light"
              size="sm"
            >
              {analysis.score}/100
            </Badge>
            <IconArrowUpRight size={16} color="#adb5bd" style={{ flexShrink: 0 }} />
          </Group>
        </UnstyledButton>
      ))}
    </Stack>
  );
}

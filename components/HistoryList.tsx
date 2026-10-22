'use client';

import { Box, Group, Stack, Text, UnstyledButton } from '@mantine/core';
import { IconArrowUpRight, IconFileText } from '@tabler/icons-react';
import Link from 'next/link';
import {
  cardLine,
  display,
  ink,
  innerFill,
  rowLine,
  scoreColor,
  textDimmed,
} from '@/lib/design';
import type { Analysis } from '@/types';

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
      <Box
        p="xl"
        style={{
          background: '#fff',
          border: `1px solid ${cardLine}`,
          borderRadius: 20,
        }}
      >
        <Stack align="center" gap={8} py={32}>
          <IconFileText size={28} color={textDimmed} stroke={1.5} />
          <Text fz={15} fw={600} c={ink} ff={display}>
            No analyses yet
          </Text>
          <Text fz={13} c={textDimmed} ta="center" maw={320}>
            Upload a resume to get started. Every report you run shows up here.
          </Text>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      style={{
        background: '#fff',
        border: `1px solid ${cardLine}`,
        borderRadius: 20,
        overflow: 'hidden',
      }}
    >
      {/* Table header — hidden on phones, where each row stacks instead. */}
      <Group
        justify="space-between"
        px="lg"
        py={10}
        visibleFrom="sm"
        style={{ background: innerFill, borderBottom: `1px solid ${rowLine}` }}
      >
        <Text fz={11} fw={600} c={textDimmed} tt="uppercase" style={{ letterSpacing: '0.08em' }}>
          Document
        </Text>
        <Text fz={11} fw={600} c={textDimmed} tt="uppercase" style={{ letterSpacing: '0.08em' }}>
          Score
        </Text>
      </Group>

      {analyses.map((analysis, i) => (
        <UnstyledButton
          key={analysis.id}
          component={Link}
          href={`/results/${analysis.id}`}
          px="lg"
          py="md"
          style={{
            display: 'block',
            borderBottom:
              i < analyses.length - 1 ? `1px solid ${rowLine}` : 'none',
          }}
        >
          <Group justify="space-between" wrap="nowrap" gap="md">
            <Group gap={12} wrap="nowrap" style={{ minWidth: 0 }}>
              <IconFileText size={18} color={textDimmed} stroke={1.6} style={{ flexShrink: 0 }} />
              <Box style={{ minWidth: 0 }}>
                <Text fz={14} fw={600} c={ink} truncate>
                  {analysis.resume_filename}
                </Text>
                <Text fz={12} c={textDimmed}>
                  {formatDate(analysis.created_at)}
                  {analysis.jd_text ? ' · with job description' : ''}
                </Text>
              </Box>
            </Group>

            <Group gap={12} wrap="nowrap">
              <Text
                fz={20}
                fw={600}
                ff={display}
                c={scoreColor(analysis.score)}
                lh={1}
              >
                {analysis.score}
              </Text>
              <IconArrowUpRight size={16} color={textDimmed} style={{ flexShrink: 0 }} />
            </Group>
          </Group>
        </UnstyledButton>
      ))}
    </Box>
  );
}

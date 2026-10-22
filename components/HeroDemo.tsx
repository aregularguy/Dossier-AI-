'use client';

import { Badge, Box, Group, Loader, Progress, Stack, Text } from '@mantine/core';
import { useReducedMotion } from '@mantine/hooks';
import {
  IconCheck,
  IconFileText,
  IconQuote,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import {
  cardLine,
  cyan,
  display,
  ink,
  inkDimmed,
  inkLine,
  innerFill,
  rowLine,
  scoreFair,
  textDimmed,
} from '@/lib/design';

const AUTO_ADVANCE_MS = 4500;

const tabs = [
  { id: 'upload', label: 'Upload', url: 'dossier.ai/analyse' },
  { id: 'scoring', label: 'Scoring', url: 'dossier.ai/analyse/running' },
  { id: 'report', label: 'Report', url: 'dossier.ai/results/8f21' },
  { id: 'ask', label: 'Ask', url: 'dossier.ai/ask' },
] as const;

/* ---------- small shared pieces ---------- */

function Chip({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode;
  tone?: 'neutral' | 'missing';
}) {
  const missing = tone === 'missing';
  return (
    <Box
      px={10}
      py={4}
      style={{
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        background: missing ? '#FFF4E0' : innerFill,
        color: missing ? scoreFair : textDimmed,
        border: `1px solid ${missing ? '#E8D4AC' : cardLine}`,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </Box>
  );
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text
      fz={11}
      fw={600}
      c={textDimmed}
      tt="uppercase"
      style={{ letterSpacing: '0.07em' }}
    >
      {children}
    </Text>
  );
}

/* ---------- the four panels ---------- */

function UploadPanel() {
  return (
    <Stack gap="md">
      <Box
        p="sm"
        style={{
          background: innerFill,
          border: `1px solid ${cardLine}`,
          borderRadius: 14,
        }}
      >
        <Group gap={10} wrap="nowrap">
          <IconFileText size={18} color={ink} stroke={1.6} />
          <Box style={{ minWidth: 0 }}>
            <Text fz={13} fw={600} c={ink} truncate>
              priya-sharma-resume.pdf
            </Text>
            <Text fz={11} c={textDimmed}>
              248 KB · 2 pages · attached
            </Text>
          </Box>
        </Group>
      </Box>

      <Stack gap={6}>
        <PanelLabel>Job description</PanelLabel>
        <Box
          p="sm"
          style={{
            border: `1px solid ${cardLine}`,
            borderRadius: 14,
            background: '#fff',
          }}
        >
          <Text fz={12} c={textDimmed} lh={1.6}>
            Senior Backend Engineer — build and own Python services on AWS.
            You will lead migrations to Kubernetes, own SLOs, and mentor…
          </Text>
        </Box>
      </Stack>

      <Stack gap={6}>
        <PanelLabel>Detected requirements</PanelLabel>
        <Group gap={6}>
          <Chip>Python</Chip>
          <Chip>AWS</Chip>
          <Chip>Kubernetes</Chip>
          <Chip>SLOs</Chip>
          <Chip>Mentoring</Chip>
        </Group>
      </Stack>
    </Stack>
  );
}

const scoringSteps = [
  { label: 'Extracted 2 pages of text', state: 'done' },
  { label: 'Matched 5 job requirements', state: 'done' },
  { label: 'Scoring bullets and impact', state: 'running' },
] as const;

function ScoringPanel() {
  return (
    <Stack gap="md">
      <PanelLabel>Analysing</PanelLabel>
      <Stack gap={0}>
        {scoringSteps.map((step, i) => (
          <Group
            key={step.label}
            gap={10}
            wrap="nowrap"
            py={12}
            style={{
              borderBottom:
                i < scoringSteps.length - 1 ? `1px solid ${rowLine}` : 'none',
            }}
          >
            {step.state === 'done' ? (
              <Box
                w={20}
                h={20}
                style={{
                  borderRadius: 999,
                  background: ink,
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                <IconCheck size={12} color="#fff" stroke={2.4} />
              </Box>
            ) : (
              <Loader size={18} color={ink} style={{ flexShrink: 0 }} />
            )}
            <Text
              fz={13}
              fw={step.state === 'running' ? 600 : 400}
              c={step.state === 'running' ? ink : textDimmed}
            >
              {step.label}
            </Text>
          </Group>
        ))}
      </Stack>
      <Text fz={12} c={textDimmed}>
        Usually finishes in under 30 seconds.
      </Text>
    </Stack>
  );
}

function ReportPanel() {
  return (
    <Stack gap="md">
      <Group align="flex-end" gap={14} wrap="nowrap">
        <Text fz={56} fw={600} lh={1} c={ink} ff={display}>
          78
        </Text>
        <Stack gap={2} pb={6}>
          <Text fz={12} fw={600} c={ink}>
            Strong, with gaps
          </Text>
          <Text fz={11} c={textDimmed}>
            out of 100
          </Text>
        </Stack>
      </Group>

      <Progress value={78} size={6} radius={999} color="ink.9" />

      <Text fz={12} c={textDimmed} lh={1.6}>
        Clear impact on three of six bullets. The job asks for Kubernetes and
        SLO ownership that your resume never names.
      </Text>

      <Stack gap={6}>
        <PanelLabel>Missing from your resume</PanelLabel>
        <Group gap={6}>
          <Chip tone="missing">Kubernetes</Chip>
          <Chip tone="missing">SLOs</Chip>
          <Chip tone="missing">Mentoring</Chip>
        </Group>
      </Stack>

      <Box
        p="sm"
        style={{
          background: innerFill,
          border: `1px solid ${cardLine}`,
          borderRadius: 14,
        }}
      >
        <Stack gap={8}>
          <PanelLabel>Rewrite</PanelLabel>
          <Text fz={12} c={textDimmed} style={{ textDecoration: 'line-through' }}>
            Responsible for backend APIs.
          </Text>
          <Text fz={12} fw={500} c={ink} lh={1.5}>
            Owned 14 Python services on AWS, cutting p95 latency 38% and
            holding a 99.95% SLO.
          </Text>
        </Stack>
      </Box>
    </Stack>
  );
}

function AskPanel() {
  return (
    <Stack gap="md">
      <Group justify="flex-end">
        <Box
          px={14}
          py={10}
          maw="80%"
          style={{ background: ink, borderRadius: 16, borderBottomRightRadius: 4 }}
        >
          <Text fz={12} c="#fff" lh={1.5}>
            Which projects show Kubernetes experience?
          </Text>
        </Box>
      </Group>

      <Box
        px={14}
        py={12}
        maw="92%"
        style={{
          background: '#fff',
          border: `1px solid ${cardLine}`,
          borderRadius: 16,
          borderBottomLeftRadius: 4,
        }}
      >
        <Stack gap={10}>
          <Text fz={12} c={ink} lh={1.6}>
            Only one. The payments migration mentions &ldquo;container
            orchestration&rdquo; without naming Kubernetes — worth saying
            plainly, since the job screens for it.
          </Text>
          <Group gap={6}>
            <Badge
              variant="default"
              radius="xl"
              size="sm"
              leftSection={<IconQuote size={10} />}
              styles={{ root: { borderColor: cardLine, color: textDimmed } }}
            >
              resume.pdf · p.1
            </Badge>
            <Badge
              variant="default"
              radius="xl"
              size="sm"
              leftSection={<IconQuote size={10} />}
              styles={{ root: { borderColor: cardLine, color: textDimmed } }}
            >
              project-brief.pdf · p.4
            </Badge>
          </Group>
        </Stack>
      </Box>
    </Stack>
  );
}

const panels = [UploadPanel, ScoringPanel, ReportPanel, AskPanel] as const;

/* ---------- the frame ---------- */

export default function HeroDemo() {
  const [active, setActive] = useState(0);
  // A visitor taking control ends the loop for good — it never resumes.
  const [stopped, setStopped] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (stopped || reduceMotion) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % tabs.length),
      AUTO_ADVANCE_MS
    );
    return () => window.clearInterval(id);
  }, [stopped, reduceMotion]);

  const Panel = panels[active];

  return (
    <Stack gap="md" align="center" w="100%">
      {/* Tab pills sit on the ink hero, so the active one is cyan on ink. */}
      <Group
        gap={4}
        p={4}
        wrap="nowrap"
        style={{
          background: inkLine,
          borderRadius: 999,
          maxWidth: '100%',
          overflowX: 'auto',
        }}
        role="group"
        aria-label="Product walkthrough"
      >
        {tabs.map((tab, i) => {
          const isActive = i === active;
          return (
            <Box
              key={tab.id}
              component="button"
              type="button"
              aria-pressed={isActive}
              onClick={() => {
                setActive(i);
                setStopped(true);
              }}
              px={16}
              py={8}
              style={{
                borderRadius: 999,
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                background: isActive ? cyan : 'transparent',
                color: isActive ? ink : inkDimmed,
              }}
            >
              {tab.label}
            </Box>
          );
        })}
      </Group>

      <Box
        w="100%"
        maw={720}
        style={{
          background: ink,
          border: `1px solid ${inkLine}`,
          borderRadius: 24,
          padding: 10,
        }}
      >
        {/* Browser chrome */}
        <Group gap={10} px={6} py={8} wrap="nowrap">
          <Group gap={6} wrap="nowrap">
            {['#FF5F57', '#FEBC2E', '#28C840'].map((dot) => (
              <Box
                key={dot}
                w={10}
                h={10}
                style={{ borderRadius: 999, background: dot, opacity: 0.85 }}
              />
            ))}
          </Group>
          <Box
            px={12}
            py={4}
            style={{
              flex: 1,
              minWidth: 0,
              background: inkLine,
              borderRadius: 999,
            }}
          >
            <Group gap={8} wrap="nowrap">
              <Box
                w={6}
                h={6}
                style={{ borderRadius: 999, background: cyan, flexShrink: 0 }}
              />
              <Text fz={11} c={inkDimmed} truncate>
                {tabs[active].url}
              </Text>
            </Group>
          </Box>
        </Group>

        {/* Fixed-height page body so swapping panels never jumps the layout */}
        <Box
          h={{ base: 400, sm: 372 }}
          p={{ base: 'md', sm: 'lg' }}
          style={{
            background: '#fff',
            borderRadius: 16,
            overflow: 'hidden',
          }}
        >
          <Panel />
        </Box>
      </Box>
    </Stack>
  );
}

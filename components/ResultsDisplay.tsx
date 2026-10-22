'use client';

import {
  Box,
  Container,
  Group,
  Paper,
  Progress,
  SimpleGrid,
  Spoiler,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { ResultsActions, ResultsBackButton } from '@/components/ResultsActions';
import {
  cardLine,
  cyan,
  display,
  ink,
  inkDimmed,
  inkLine,
  innerFill,
  rowLine,
  scoreColor,
  scoreLabel,
  textDimmed,
} from '@/lib/design';
import type { AnalysisResult } from '@/types';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text
      fz={11}
      fw={600}
      c={textDimmed}
      tt="uppercase"
      style={{ letterSpacing: '0.08em' }}
    >
      {children}
    </Text>
  );
}

interface Props {
  filename: string;
  result: AnalysisResult;
  jdText?: string | null;
  createdAt?: string;
}

export default function ResultsDisplay({
  filename,
  result,
  jdText,
  createdAt,
}: Props) {
  const hasJd = Boolean(jdText?.trim());

  return (
    <Container size="md" py={{ base: 32, md: 48 }} px="md">
      <Stack gap={24}>
        <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
          <Stack gap={4}>
            <Title order={1} fz={{ base: 22, sm: 26 }} fw={600} c={ink}>
              Analysis results
            </Title>
            <Text fz={13} c={textDimmed}>
              {filename}
              {createdAt ? ` · ${formatDate(createdAt)}` : ''}
            </Text>
          </Stack>
          <ResultsBackButton />
        </Group>

        {/* ---------- Ink score band ---------- */}
        <Box
          className="dossier-on-ink"
          p={{ base: 'lg', md: 32 }}
          style={{ background: ink, borderRadius: 24 }}
        >
          <Stack gap="lg">
            <Group justify="space-between" align="flex-end" wrap="wrap" gap="md">
              <Group align="flex-end" gap={16} wrap="nowrap">
                <Text
                  fz={{ base: 64, sm: 84 }}
                  fw={600}
                  lh={1}
                  c="#fff"
                  ff={display}
                  style={{ letterSpacing: '-0.04em' }}
                >
                  {result.score}
                </Text>
                <Stack gap={2} pb={{ base: 6, sm: 10 }}>
                  <Text fz={14} fw={600} c={cyan}>
                    {scoreLabel(result.score)}
                  </Text>
                  <Text fz={12} c={inkDimmed}>
                    out of 100
                  </Text>
                </Stack>
              </Group>

              {result.jd_match != null && (
                <Stack gap={2} align="flex-end">
                  <Text fz={28} fw={600} c="#fff" ff={display}>
                    {result.jd_match}%
                  </Text>
                  <Text fz={12} c={inkDimmed}>
                    job description match
                  </Text>
                </Stack>
              )}
            </Group>

            <Progress
              value={result.score}
              size={8}
              radius={999}
              aria-label={`Resume score ${result.score} out of 100`}
              styles={{
                root: { backgroundColor: inkLine },
                section: { backgroundColor: cyan },
              }}
            />

            {result.overall_feedback && (
              <Text fz={{ base: 14, sm: 15 }} c={inkDimmed} lh={1.7} maw={680}>
                {result.overall_feedback}
              </Text>
            )}
          </Stack>
        </Box>

        {/* ---------- Job description match ---------- */}
        {(result.jd_match != null || hasJd) && (
          <Paper p={{ base: 'lg', md: 'xl' }} withBorder style={{ borderColor: cardLine }}>
            <Stack gap="md">
              <Group justify="space-between" align="center" wrap="wrap" gap="xs">
                <SectionLabel>Job description match</SectionLabel>
                {result.jd_match != null && (
                  <Text fz={13} fw={600} c={scoreColor(result.jd_match)}>
                    {result.jd_match}% aligned
                  </Text>
                )}
              </Group>

              {result.jd_match != null && (
                <Progress
                  value={result.jd_match}
                  size={6}
                  radius={999}
                  aria-label={`Job description match ${result.jd_match} percent`}
                  styles={{
                    root: { backgroundColor: innerFill },
                    section: { backgroundColor: scoreColor(result.jd_match) },
                  }}
                />
              )}

              {hasJd && (
                <Box
                  p="md"
                  style={{
                    background: innerFill,
                    border: `1px solid ${cardLine}`,
                    borderRadius: 14,
                  }}
                >
                  <Spoiler
                    maxHeight={96}
                    showLabel="Show full description"
                    hideLabel="Hide"
                    styles={{ control: { color: ink, fontSize: 13, fontWeight: 600 } }}
                  >
                    <Text
                      fz={13}
                      c={textDimmed}
                      lh={1.7}
                      style={{ whiteSpace: 'pre-wrap' }}
                    >
                      {jdText}
                    </Text>
                  </Spoiler>
                </Box>
              )}
            </Stack>
          </Paper>
        )}

        {/* ---------- Working well / holding you back ---------- */}
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={{ base: 'md', md: 'lg' }}>
          <Paper p={{ base: 'lg', md: 'xl' }} withBorder style={{ borderColor: cardLine }}>
            <Stack gap="md">
              <SectionLabel>What is working</SectionLabel>
              <Stack gap={0}>
                {result.strengths.map((item, i) => (
                  <Group
                    key={i}
                    gap={10}
                    wrap="nowrap"
                    align="flex-start"
                    py={12}
                    style={{
                      borderBottom:
                        i < result.strengths.length - 1
                          ? `1px solid ${rowLine}`
                          : 'none',
                    }}
                  >
                    <IconCheck
                      size={15}
                      color="#14694F"
                      stroke={2.4}
                      style={{ marginTop: 3, flexShrink: 0 }}
                    />
                    <Text fz={14} c={ink} lh={1.6}>
                      {item}
                    </Text>
                  </Group>
                ))}
              </Stack>
            </Stack>
          </Paper>

          <Paper p={{ base: 'lg', md: 'xl' }} withBorder style={{ borderColor: cardLine }}>
            <Stack gap="md">
              <SectionLabel>What is holding you back</SectionLabel>
              <Stack gap={0}>
                {result.improvements.map((item, i) => (
                  <Group
                    key={i}
                    gap={10}
                    wrap="nowrap"
                    align="flex-start"
                    py={12}
                    style={{
                      borderBottom:
                        i < result.improvements.length - 1
                          ? `1px solid ${rowLine}`
                          : 'none',
                    }}
                  >
                    <IconAlertTriangle
                      size={15}
                      color="#8A5A00"
                      stroke={2.2}
                      style={{ marginTop: 3, flexShrink: 0 }}
                    />
                    <Text fz={14} c={ink} lh={1.6}>
                      {item}
                    </Text>
                  </Group>
                ))}
              </Stack>
            </Stack>
          </Paper>
        </SimpleGrid>

        {/* ---------- Numbered rewrites ---------- */}
        {result.suggestions.length > 0 && (
          <Stack gap="md">
            <SectionLabel>Rewrites to make, in order</SectionLabel>
            <Stack gap="sm">
              {result.suggestions.map((suggestion, i) => (
                <Paper
                  key={i}
                  p={{ base: 'md', md: 'lg' }}
                  withBorder
                  style={{ borderColor: cardLine }}
                >
                  <Group gap="md" wrap="nowrap" align="flex-start">
                    <Box
                      w={32}
                      h={32}
                      style={{
                        borderRadius: 999,
                        background: ink,
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Text fz={13} fw={600} c="#fff" ff={display}>
                        {i + 1}
                      </Text>
                    </Box>
                    <Text fz={{ base: 14, sm: 15 }} c={ink} lh={1.7}>
                      {suggestion}
                    </Text>
                  </Group>
                </Paper>
              ))}
            </Stack>
          </Stack>
        )}

        <ResultsActions />
      </Stack>
    </Container>
  );
}

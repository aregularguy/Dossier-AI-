'use client';

import {
  Container,
  Title,
  Text,
  Stack,
  Group,
  Paper,
  RingProgress,
  List,
  ThemeIcon,
  Badge,
} from '@mantine/core';
import {
  IconCheck,
  IconAlertTriangle,
  IconBulb,
  IconTargetArrow,
} from '@tabler/icons-react';
import { ResultsBackButton, ResultsActions } from '@/components/ResultsActions';
import type { AnalysisResult } from '@/types';

function getScoreColor(score: number) {
  if (score >= 80) return 'green';
  if (score >= 60) return 'yellow';
  return 'red';
}

interface Props {
  filename: string;
  result: AnalysisResult;
}

export default function ResultsDisplay({ filename, result }: Props) {
  const scoreColor = getScoreColor(result.score);

  return (
    <Container size="sm" py={56} px="md">
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <div>
            <Title order={3} fw={600} c="dark.8">
              Analysis results
            </Title>
            <Text size="sm" c="dimmed" mt={4}>
              {filename}
            </Text>
          </div>
          <ResultsBackButton />
        </Group>

        {/* Score */}
        <Paper withBorder p="lg" radius="md">
          <Group gap="lg" wrap="nowrap">
            <RingProgress
              size={100}
              thickness={10}
              roundCaps
              sections={[{ value: result.score, color: scoreColor }]}
              label={
                <Text ta="center" fw={700} size="lg">
                  {result.score}
                </Text>
              }
            />
            <div>
              <Text fw={600} size="md" c="dark.8">
                Overall Score
              </Text>
              <Text size="sm" c="dimmed" mt={4}>
                {result.overall_feedback}
              </Text>
            </div>
          </Group>
        </Paper>

        {/* JD Match */}
        {result.jd_match != null && (
          <Paper withBorder p="lg" radius="md">
            <Group gap="lg" wrap="nowrap">
              <RingProgress
                size={80}
                thickness={8}
                roundCaps
                sections={[
                  { value: result.jd_match, color: getScoreColor(result.jd_match) },
                ]}
                label={
                  <Text ta="center" fw={700} size="sm">
                    {result.jd_match}%
                  </Text>
                }
              />
              <div>
                <Group gap="xs">
                  <IconTargetArrow size={18} color="#4338ca" />
                  <Text fw={600} size="md" c="dark.8">
                    Job Description Match
                  </Text>
                </Group>
                <Text size="sm" c="dimmed" mt={4}>
                  How well your resume aligns with the provided job description.
                </Text>
              </div>
            </Group>
          </Paper>
        )}

        {/* Strengths */}
        <Paper withBorder p="lg" radius="md">
          <Group gap="xs" mb="md">
            <Badge color="green" variant="light" size="sm">
              Strengths
            </Badge>
          </Group>
          <List
            spacing="sm"
            icon={
              <ThemeIcon color="green" size={22} radius="xl" variant="light">
                <IconCheck size={14} />
              </ThemeIcon>
            }
          >
            {result.strengths.map((s, i) => (
              <List.Item key={i}>
                <Text size="sm">{s}</Text>
              </List.Item>
            ))}
          </List>
        </Paper>

        {/* Improvements */}
        <Paper withBorder p="lg" radius="md">
          <Group gap="xs" mb="md">
            <Badge color="orange" variant="light" size="sm">
              Needs improvement
            </Badge>
          </Group>
          <List
            spacing="sm"
            icon={
              <ThemeIcon color="orange" size={22} radius="xl" variant="light">
                <IconAlertTriangle size={14} />
              </ThemeIcon>
            }
          >
            {result.improvements.map((item, i) => (
              <List.Item key={i}>
                <Text size="sm">{item}</Text>
              </List.Item>
            ))}
          </List>
        </Paper>

        {/* Suggestions */}
        <Paper withBorder p="lg" radius="md">
          <Group gap="xs" mb="md">
            <Badge color="brand" variant="light" size="sm">
              Suggestions
            </Badge>
          </Group>
          <List
            spacing="sm"
            icon={
              <ThemeIcon color="brand" size={22} radius="xl" variant="light">
                <IconBulb size={14} />
              </ThemeIcon>
            }
          >
            {result.suggestions.map((s, i) => (
              <List.Item key={i}>
                <Text size="sm">{s}</Text>
              </List.Item>
            ))}
          </List>
        </Paper>

        <ResultsActions />
      </Stack>
    </Container>
  );
}

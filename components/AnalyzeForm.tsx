'use client';

import {
  ActionIcon,
  Box,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  Textarea,
} from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import {
  IconFile,
  IconFileX,
  IconUpload,
  IconX,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  cardLine,
  display,
  ink,
  innerFill,
  textDimmed,
} from '@/lib/design';

const JD_MAX_LENGTH = 8000;

function StepHeader({
  n,
  title,
  hint,
  done,
}: {
  n: number;
  title: string;
  hint: string;
  done?: boolean;
}) {
  return (
    <Group gap={12} wrap="nowrap" align="flex-start">
      <Box
        w={28}
        h={28}
        style={{
          borderRadius: 999,
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          background: done ? ink : innerFill,
          border: `1px solid ${done ? ink : cardLine}`,
        }}
      >
        <Text fz={12} fw={600} c={done ? '#fff' : textDimmed} ff={display}>
          {n}
        </Text>
      </Box>
      <Stack gap={2}>
        <Text fz={15} fw={600} c={ink} ff={display}>
          {title}
        </Text>
        <Text fz={13} c={textDimmed}>
          {hint}
        </Text>
      </Stack>
    </Group>
  );
}

export default function AnalyzeForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jd', jdText);

      const res = await fetch('/api/analyze', { method: 'POST', body: formData });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({}));
        throw new Error(error || 'Analysis failed');
      }

      const { id } = await res.json();
      router.push(`/results/${id}`);
    } catch (err) {
      notifications.show({
        color: 'red',
        title: 'Something went wrong',
        message:
          err instanceof Error && err.message
            ? err.message
            : 'Could not analyze the resume. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack gap="md">
      {/* ---------- Step 1: the resume ---------- */}
      <Paper p={{ base: 'lg', md: 'xl' }} withBorder style={{ borderColor: cardLine }}>
        <Stack gap="lg">
          <StepHeader
            n={1}
            title="Add your resume"
            hint="PDF, up to 10MB. We read both pages."
            done={Boolean(file)}
          />

          {file ? (
            <Box
              p="md"
              style={{
                background: innerFill,
                border: `1px solid ${cardLine}`,
                borderRadius: 14,
              }}
            >
              <Group justify="space-between" wrap="nowrap">
                <Group gap={12} wrap="nowrap" style={{ minWidth: 0 }}>
                  <IconFile size={20} color={ink} stroke={1.6} />
                  <Box style={{ minWidth: 0 }}>
                    <Text fz={14} fw={600} c={ink} truncate>
                      {file.name}
                    </Text>
                    <Text fz={12} c={textDimmed}>
                      {(file.size / 1024).toFixed(0)} KB · attached
                    </Text>
                  </Box>
                </Group>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  aria-label="Remove file"
                  onClick={() => setFile(null)}
                >
                  <IconX size={16} />
                </ActionIcon>
              </Group>
            </Box>
          ) : (
            <Dropzone
              onDrop={(files) => setFile(files[0])}
              onReject={() =>
                notifications.show({
                  color: 'red',
                  title: 'Invalid file',
                  message: 'Only PDF files under 10MB are accepted.',
                })
              }
              maxSize={10 * 1024 ** 2}
              accept={['application/pdf']}
              radius={16}
              styles={{ root: { background: innerFill, borderColor: cardLine } }}
            >
              <Stack align="center" gap={8} py={32} style={{ pointerEvents: 'none' }}>
                <Dropzone.Accept>
                  <IconUpload size={30} color={ink} stroke={1.5} />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconFileX size={30} color="#A72B1E" stroke={1.5} />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconUpload size={30} color={textDimmed} stroke={1.5} />
                </Dropzone.Idle>
                <Text fz={14} fw={600} c={ink}>
                  Drop your resume here, or click to browse
                </Text>
                <Text fz={12} c={textDimmed}>
                  PDF only · Max 10MB
                </Text>
              </Stack>
            </Dropzone>
          )}
        </Stack>
      </Paper>

      {/* ---------- Step 2: the job description ---------- */}
      <Paper p={{ base: 'lg', md: 'xl' }} withBorder style={{ borderColor: cardLine }}>
        <Stack gap="lg">
          <StepHeader
            n={2}
            title="Paste the job description"
            hint="Optional — but it is what turns generic advice into the gaps for this role."
            done={jdText.trim().length > 0}
          />

          <Stack gap={6}>
            <Textarea
              aria-label="Job description"
              placeholder="Paste the job description here…"
              minRows={5}
              autosize
              maxLength={JD_MAX_LENGTH}
              value={jdText}
              onChange={(e) => setJdText(e.currentTarget.value)}
              radius={14}
              styles={{ input: { borderColor: cardLine, background: innerFill } }}
            />
            <Text fz={11} c={textDimmed} ta="right">
              {jdText.length.toLocaleString()} / {JD_MAX_LENGTH.toLocaleString()}
            </Text>
          </Stack>
        </Stack>
      </Paper>

      <Stack gap={8}>
        <Button
          onClick={handleSubmit}
          disabled={!file || loading}
          loading={loading}
          size="md"
          fullWidth
        >
          {loading ? 'Analysing' : 'Analyse my resume'}
        </Button>
        <Text fz={12} c={textDimmed} ta="center">
          {loading
            ? 'Reading the PDF and scoring the bullets — about 10–20 seconds.'
            : 'Takes about 30 seconds. Your file is never used for training.'}
        </Text>
      </Stack>
    </Stack>
  );
}

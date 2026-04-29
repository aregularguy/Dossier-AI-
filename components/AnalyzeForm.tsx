'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Stack, Textarea, Button, Text, Group, ActionIcon, Paper
} from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import { IconUpload, IconX, IconFile, IconFileX } from '@tabler/icons-react';

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
      if (!res.ok) throw new Error('Analysis failed');

      const { id } = await res.json();
      router.push(`/results/${id}`);
    } catch {
      notifications.show({
        color: 'red',
        title: 'Something went wrong',
        message: 'Could not analyze the resume. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack gap="lg">
      {file ? (
        <Paper withBorder p="md" radius="md">
          <Group justify="space-between" wrap="nowrap">
            <Group gap="sm" wrap="nowrap">
              <IconFile size={20} color="#4338ca" />
              <div>
                <Text size="sm" fw={500} truncate maw={300}>{file.name}</Text>
                <Text size="xs" c="dimmed">{(file.size / 1024).toFixed(0)} KB</Text>
              </div>
            </Group>
            <ActionIcon variant="subtle" color="red" onClick={() => setFile(null)}>
              <IconX size={16} />
            </ActionIcon>
          </Group>
        </Paper>
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
        >
          <Stack align="center" gap="xs" py="xl" style={{ pointerEvents: 'none' }}>
            <Dropzone.Accept><IconUpload size={36} color="#4338ca" /></Dropzone.Accept>
            <Dropzone.Reject><IconFileX size={36} color="#e03131" /></Dropzone.Reject>
            <Dropzone.Idle><IconUpload size={36} color="#868e96" /></Dropzone.Idle>
            <Text size="sm" fw={500}>Drop your resume here or click to browse</Text>
            <Text size="xs" c="dimmed">PDF only · Max 10MB</Text>
          </Stack>
        </Dropzone>
      )}

      <Textarea
        label="Job description (optional)"
        placeholder="Paste the job description here..."
        minRows={4}
        autosize
        value={jdText}
        onChange={(e) => setJdText(e.currentTarget.value)}
      />

      <Button
        onClick={handleSubmit}
        disabled={!file || loading}
        loading={loading}
        color="brand"
        size="md"
        radius="md"
      >
        Analyze
      </Button>
    </Stack>
  );
}

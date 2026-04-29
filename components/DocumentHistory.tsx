'use client';

import { Stack, Paper, Group, Text, Badge, ThemeIcon } from '@mantine/core';
import { IconMessageChatbot, IconInbox } from '@tabler/icons-react';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

interface Document {
  id: string;
  filename: string;
  page_count: number | null;
  chunk_count: number;
  status: string;
  created_at: string;
}

interface Props {
  documents: Document[];
}

export default function DocumentHistory({ documents }: Props) {
  if (documents.length === 0) {
    return (
      <Paper withBorder p="xl" radius="md">
        <Stack align="center" gap="sm" py="xl">
          <ThemeIcon size={48} radius="xl" variant="light" color="gray">
            <IconInbox size={24} />
          </ThemeIcon>
          <Text fw={500} c="dark.7">No documents yet</Text>
          <Text size="sm" c="dimmed" ta="center">
            Upload a PDF on the Ask page. Your indexed documents will appear here.
          </Text>
        </Stack>
      </Paper>
    );
  }

  return (
    <Stack gap={0} style={{ borderRadius: 12, border: '1px solid #e9ecef', overflow: 'hidden' }}>
      {documents.map((doc, i) => (
        <div
          key={doc.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            backgroundColor: '#fff',
            borderBottom: i < documents.length - 1 ? '1px solid #f1f3f5' : 'none',
          }}
        >
          <Group gap={14} wrap="nowrap">
            <ThemeIcon
              size={36}
              radius={9}
              variant="light"
              color="teal"
              style={{ flexShrink: 0 }}
            >
              <IconMessageChatbot size={18} />
            </ThemeIcon>
            <div>
              <Text size="sm" fw={600} c="dark.8" truncate maw={260}>
                {doc.filename}
              </Text>
              <Text size="xs" c="dimmed" mt={2}>
                {formatDate(doc.created_at)} · {doc.chunk_count} chunks
                {doc.page_count ? ` · ${doc.page_count} pages` : ''}
              </Text>
            </div>
          </Group>

          <Badge
            color={doc.status === 'ready' ? 'green' : doc.status === 'error' ? 'red' : 'orange'}
            variant="light"
            size="sm"
          >
            {doc.status}
          </Badge>
        </div>
      ))}
    </Stack>
  );
}

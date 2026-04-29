'use client';

import { useEffect, useState } from 'react';
import {
  Stack,
  TextInput,
  Button,
  Text,
  Paper,
  Group,
  ActionIcon,
  Badge,
  Accordion,
  Loader,
} from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import {
  IconUpload,
  IconFileX,
  IconSend,
  IconFile,
  IconTrash,
  IconRobot,
  IconUser,
} from '@tabler/icons-react';
import {
  ingestDocument,
  askDocuments,
  listDocuments,
  deleteDocument,
} from '@/lib/rag-client';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{
    content_preview: string;
    similarity: number;
    metadata: Record<string, unknown>;
  }>;
}

interface Doc {
  id: string;
  filename: string;
  page_count: number | null;
  chunk_count: number;
  status: string;
  created_at: string;
}

export default function AskChat() {
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [ingesting, setIngesting] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      const docs = await listDocuments();
      setDocuments(docs);
    } catch {
      // Backend may not be running yet
    }
  }

  async function handleIngest(files: File[]) {
    const file = files[0];
    if (!file) return;
    setIngesting(true);
    try {
      const result = await ingestDocument(file);
      notifications.show({
        color: 'green',
        title: 'Document indexed',
        message: result.message,
      });
      await loadDocuments();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ingestion failed';
      notifications.show({
        color: 'red',
        title: 'Ingestion failed',
        message,
      });
    } finally {
      setIngesting(false);
    }
  }

  async function handleDelete(docId: string) {
    try {
      await deleteDocument(docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
      notifications.show({
        color: 'gray',
        title: 'Deleted',
        message: 'Document removed.',
      });
    } catch {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'Could not delete document.',
      });
    }
  }

  async function handleAsk() {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    setLoading(true);

    try {
      const result = await askDocuments(question);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: result.answer,
          sources: result.sources,
        },
      ]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Error: ${message}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack gap="lg">
      {/* Upload area */}
      <Dropzone
        onDrop={handleIngest}
        onReject={() =>
          notifications.show({
            color: 'red',
            title: 'Invalid file',
            message: 'Only PDF files under 10MB are accepted.',
          })
        }
        maxSize={10 * 1024 ** 2}
        accept={['application/pdf']}
        loading={ingesting}
      >
        <Stack align="center" gap="xs" py="md" style={{ pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconUpload size={28} color="#4338ca" />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconFileX size={28} color="#e03131" />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconUpload size={28} color="#868e96" />
          </Dropzone.Idle>
          <Text size="sm" fw={500}>
            Drop a PDF to index it for Q&A
          </Text>
          <Text size="xs" c="dimmed">
            PDF only · Max 10MB
          </Text>
        </Stack>
      </Dropzone>

      {/* Indexed documents */}
      {documents.length > 0 && (
        <Stack gap="xs">
          <Text size="xs" fw={600} c="dark.4" tt="uppercase" style={{ letterSpacing: '0.05em' }}>
            Indexed documents
          </Text>
          {documents.map((doc) => (
            <Paper key={doc.id} withBorder p="sm" radius="md">
              <Group justify="space-between" wrap="nowrap">
                <Group gap="sm" wrap="nowrap">
                  <IconFile size={18} color="#4338ca" />
                  <div>
                    <Text size="sm" fw={500} truncate maw={250}>
                      {doc.filename}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {doc.chunk_count} chunks · {doc.page_count ?? '?'} pages
                    </Text>
                  </div>
                </Group>
                <Group gap="xs" wrap="nowrap">
                  <Badge
                    size="xs"
                    color={doc.status === 'ready' ? 'green' : 'orange'}
                    variant="light"
                  >
                    {doc.status}
                  </Badge>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    size="sm"
                    onClick={() => handleDelete(doc.id)}
                  >
                    <IconTrash size={14} />
                  </ActionIcon>
                </Group>
              </Group>
            </Paper>
          ))}
        </Stack>
      )}

      {/* Chat messages */}
      {messages.length > 0 && (
        <Stack gap={0}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                padding: '20px 0',
                borderBottom:
                  i < messages.length - 1 ? '1px solid #f1f3f5' : 'none',
              }}
            >
              {msg.role === 'user' ? (
                <Group gap="sm" align="flex-start" wrap="nowrap">
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      backgroundColor: '#eef2ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <IconUser size={15} color="#4338ca" />
                  </div>
                  <Text size="sm" fw={500} c="dark.8" pt={3}>
                    {msg.content}
                  </Text>
                </Group>
              ) : (
                <Stack gap="sm">
                  <Group gap="sm" align="center" wrap="nowrap">
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        backgroundColor: '#ecfdf5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <IconRobot size={15} color="#0c7a60" />
                    </div>
                    <Text size="xs" fw={600} c="dark.4">
                      Dossier AI
                    </Text>
                  </Group>
                  <div style={{ paddingLeft: 40 }}>
                    <Text
                      size="sm"
                      c="dark.7"
                      lh={1.7}
                      style={{ whiteSpace: 'pre-wrap' }}
                    >
                      {msg.content}
                    </Text>
                    {msg.sources && msg.sources.length > 0 && (
                      <Accordion
                        variant="separated"
                        radius="md"
                        mt="sm"
                        styles={{
                          control: { padding: '8px 12px' },
                          panel: { padding: '0 12px 12px' },
                          item: {
                            border: '1px solid #e9ecef',
                            backgroundColor: '#fafafa',
                          },
                        }}
                      >
                        <Accordion.Item value="sources">
                          <Accordion.Control>
                            <Group gap={6}>
                              <Badge
                                size="xs"
                                variant="light"
                                color="brand"
                                radius="sm"
                              >
                                {msg.sources.length}
                              </Badge>
                              <Text size="xs" c="dimmed">
                                sources referenced
                              </Text>
                            </Group>
                          </Accordion.Control>
                          <Accordion.Panel>
                            <Stack gap={8}>
                              {msg.sources.map((s, j) => (
                                <Paper
                                  key={j}
                                  p="sm"
                                  radius="sm"
                                  style={{
                                    border: '1px solid #f1f3f5',
                                    backgroundColor: '#fff',
                                  }}
                                >
                                  <Group gap={6} mb={4}>
                                    <Badge
                                      size="xs"
                                      variant="outline"
                                      color="gray"
                                      radius="sm"
                                    >
                                      {(s.similarity * 100).toFixed(0)}% match
                                    </Badge>
                                  </Group>
                                  <Text size="xs" c="dark.5" lh={1.5}>
                                    {s.content_preview}...
                                  </Text>
                                </Paper>
                              ))}
                            </Stack>
                          </Accordion.Panel>
                        </Accordion.Item>
                      </Accordion>
                    )}
                  </div>
                </Stack>
              )}
            </div>
          ))}
          {loading && (
            <div style={{ padding: '20px 0' }}>
              <Group gap="sm" pl={40}>
                <Loader size={16} color="brand" type="dots" />
                <Text size="sm" c="dimmed">
                  Searching documents...
                </Text>
              </Group>
            </div>
          )}
        </Stack>
      )}

      {/* Input */}
      <Paper
        withBorder
        radius="md"
        p={4}
        style={{
          position: 'sticky',
          bottom: 16,
          backgroundColor: '#fff',
        }}
      >
        <Group gap={4} wrap="nowrap">
          <TextInput
            placeholder="Ask a question about your documents..."
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
              }
            }}
            disabled={loading || documents.length === 0}
            variant="unstyled"
            style={{ flex: 1 }}
            styles={{ input: { paddingLeft: 12 } }}
          />
          <ActionIcon
            size={36}
            radius="md"
            color="brand"
            variant={input.trim() ? 'filled' : 'subtle'}
            onClick={handleAsk}
            disabled={!input.trim() || loading || documents.length === 0}
          >
            <IconSend size={16} />
          </ActionIcon>
        </Group>
      </Paper>

      {documents.length === 0 && (
        <Text size="sm" c="dimmed" ta="center">
          Upload a document above to start asking questions.
        </Text>
      )}
    </Stack>
  );
}

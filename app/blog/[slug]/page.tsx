import {
  Anchor,
  Badge,
  Blockquote,
  Box,
  Code,
  Container,
  Divider,
  Group,
  List,
  ListItem,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { getPost, posts, type Block } from '../posts';

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: 'Not found — Dossier AI' };
  return {
    title: `${post.title} — Dossier AI`,
    description: post.description,
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case 'h2':
      return (
        <Title key={i} order={2} fz={{ base: 22, sm: 26 }} fw={700} c="dark.8" mt="lg">
          {block.text}
        </Title>
      );
    case 'p':
      return (
        <Text key={i} size="md" c="dark.7" lh={1.7}>
          {block.text}
        </Text>
      );
    case 'quote':
      return (
        <Blockquote key={i} color="ink" radius="md" my="sm">
          {block.text}
        </Blockquote>
      );
    case 'code':
      return (
        <Code key={i} block>
          {block.text}
        </Code>
      );
    case 'ul':
      return (
        <List key={i} spacing="xs" size="md" c="dark.7">
          {block.items.map((it, j) => (
            <ListItem key={j}>{it}</ListItem>
          ))}
        </List>
      );
    case 'ol':
      return (
        <List key={i} type="ordered" spacing="xs" size="md" c="dark.7">
          {block.items.map((it, j) => (
            <ListItem key={j}>{it}</ListItem>
          ))}
        </List>
      );
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      <Navbar user={null} />
      <Box component="main">
        <Container size="sm" py={{ base: 56, md: 88 }} px="md">
          <Stack gap="xl">
            <Anchor href="/blog" size="sm" c="dimmed">
              ← All posts
            </Anchor>

            <Stack gap="md">
              <Group gap="sm">
                <Badge variant="light" color="ink" radius="sm">
                  {post.tag}
                </Badge>
                <Text size="xs" c="dimmed">
                  {formatDate(post.date)} · {post.readingMinutes} min read
                </Text>
              </Group>
              <Title order={1} fz={{ base: 30, sm: 40 }} fw={700} c="dark.8" lh={1.2}>
                {post.title}
              </Title>
              <Text size="lg" c="dimmed" lh={1.6}>
                {post.description}
              </Text>
            </Stack>

            <Divider />

            <Stack gap="md">{post.body.map(renderBlock)}</Stack>

            <Divider />

            <Group justify="space-between" align="center">
              <Text size="sm" c="dimmed">
                Ready to try it?
              </Text>
              <Anchor href="/auth/signin" size="sm" fw={500}>
                Analyze my resume →
              </Anchor>
            </Group>
          </Stack>
        </Container>
      </Box>
    </>
  );
}

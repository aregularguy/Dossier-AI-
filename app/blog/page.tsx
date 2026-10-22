import {
  Anchor,
  Badge,
  Box,
  Card,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import { posts } from './posts';

export const metadata: Metadata = {
  title: 'Blog — Dossier AI',
  description: 'Guides and explainers on resumes, job matching, and how Dossier AI works.',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogIndexPage() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <Navbar user={null} />
      <Box component="main">
        <Container size="md" py={{ base: 64, md: 96 }} px="md">
          <Stack gap={48}>
            <Stack gap="sm" maw={560}>
              <Title order={1} fz={{ base: 32, sm: 44 }} fw={700} c="dark.8">
                Blog
              </Title>
              <Text size="lg" c="dimmed" lh={1.6}>
                Short, practical writing on resumes, job matching, and the tech
                behind Dossier AI.
              </Text>
            </Stack>

            <Stack gap="lg">
              {sorted.map((post) => (
                <Card key={post.slug} padding="xl" withBorder>
                  <Stack gap="sm">
                    <Group gap="sm">
                      <Badge variant="light" color="ink" radius="sm">
                        {post.tag}
                      </Badge>
                      <Text size="xs" c="dimmed">
                        {formatDate(post.date)} · {post.readingMinutes} min read
                      </Text>
                    </Group>
                    <Anchor href={`/blog/${post.slug}`} underline="never">
                      <Title order={2} fz={{ base: 20, sm: 24 }} fw={700} c="dark.8">
                        {post.title}
                      </Title>
                    </Anchor>
                    <Text size="sm" c="dark.6" lh={1.6}>
                      {post.description}
                    </Text>
                    <Anchor href={`/blog/${post.slug}`} size="sm" fw={500}>
                      Read more →
                    </Anchor>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
}

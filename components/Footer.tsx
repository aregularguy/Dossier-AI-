'use client';

import { Anchor, Box, Container, Group, Stack, Text } from '@mantine/core';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'Analyze resume', href: '/analyze' },
      { label: 'Ask my documents', href: '/ask' },
      { label: 'History', href: '/history' },
      { label: 'Pricing', href: '/pricing' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'How RAG works', href: '/blog/how-rag-works' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/about#contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
];

export default function Footer() {
  const pathname = usePathname();
  // Auth screens are full-bleed — no footer.
  if (pathname?.startsWith('/auth')) return null;

  return (
    <footer
      style={{
        borderTop: '1px solid #D2D9DF',
        background: '#FFFFFF',
        marginTop: 'auto',
      }}
    >
      <Container size="lg" px="md" py={{ base: 48, md: 64 }}>
        <Group align="flex-start" justify="space-between" wrap="wrap" gap={48}>
          <Stack gap="xs" maw={260}>
            <Group gap="xs">
              <Box
                w={10}
                h={10}
                style={{ borderRadius: 999, background: '#101217' }}
              />
              <Text fw={600} c="#101217" style={{ letterSpacing: '-0.02em' }}>
                Dossier AI
              </Text>
            </Group>
            <Text size="sm" c="dimmed" lh={1.6}>
              AI-powered resume feedback and document Q&amp;A. Know what to fix
              before you hit apply.
            </Text>
          </Stack>

          <Group align="flex-start" gap={64} wrap="wrap">
            {columns.map((col) => (
              <Stack key={col.title} gap="sm">
                <Text
                  size="xs"
                  fw={600}
                  c="dark.4"
                  tt="uppercase"
                  style={{ letterSpacing: '0.06em' }}
                >
                  {col.title}
                </Text>
                {col.links.map((link) => (
                  <Anchor
                    key={link.href}
                    component={Link}
                    href={link.href}
                    size="sm"
                    c="dark.6"
                    underline="never"
                  >
                    {link.label}
                  </Anchor>
                ))}
              </Stack>
            ))}
          </Group>
        </Group>

        <Text size="xs" c="dimmed" mt={48}>
          © {new Date().getFullYear()} Dossier AI. All rights reserved.
        </Text>
      </Container>
    </footer>
  );
}

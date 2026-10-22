import { Anchor, Box, Container, Stack, Text, Title } from '@mantine/core';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'About — Dossier AI',
  description: 'What Dossier AI is and how to get in touch.',
};

export default function AboutPage() {
  return (
    <>
      <Navbar user={null} />
      <Box component="main">
        <Container size="sm" py={{ base: 64, md: 96 }} px="md">
          <Stack gap="xl">
            <Stack gap="md">
              <Title order={1} fz={{ base: 32, sm: 42 }} fw={700} c="dark.8">
                About Dossier AI
              </Title>
              <Text size="lg" c="dark.7" lh={1.7}>
                Dossier AI helps you understand exactly what to fix on your resume
                before you apply. Upload a PDF, optionally paste a job
                description, and get a score, line-by-line suggestions, and a
                match readout in about 30 seconds.
              </Text>
              <Text size="lg" c="dark.7" lh={1.7}>
                The Ask feature goes further: upload any document and ask
                questions about its contents, with answers grounded in the source
                text using retrieval-augmented generation.
              </Text>
            </Stack>

            <Stack gap="xs" id="contact">
              <Title order={2} fz={24} fw={700} c="dark.8">
                Contact
              </Title>
              <Text size="md" c="dark.7" lh={1.7}>
                Questions, feedback, or enterprise inquiries:{' '}
                <Anchor href="mailto:hello@dossier.ai">hello@dossier.ai</Anchor>
              </Text>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
}

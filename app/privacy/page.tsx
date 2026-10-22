import { Box, Container, List, ListItem, Stack, Text, Title } from '@mantine/core';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Privacy Policy — Dossier AI',
  description: 'How Dossier AI handles your data.',
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar user={null} />
      <Box component="main">
        <Container size="sm" py={{ base: 64, md: 96 }} px="md">
          <Stack gap="lg">
            <Title order={1} fz={{ base: 30, sm: 40 }} fw={700} c="dark.8">
              Privacy Policy
            </Title>
            <Text size="sm" c="dimmed">
              Last updated: September 8, 2026
            </Text>

            <Text size="md" c="dark.7" lh={1.7}>
              This page describes what Dossier AI collects and how it is used.
              This is placeholder copy — replace it with your reviewed legal
              text before launch.
            </Text>

            <Title order={2} fz={22} fw={700} c="dark.8" mt="md">
              What we collect
            </Title>
            <List spacing="xs" size="md" c="dark.7">
              <ListItem>
                Account details from Google sign-in (name, email, avatar).
              </ListItem>
              <ListItem>
                Documents you upload and the analyses generated from them.
              </ListItem>
              <ListItem>Basic usage logs for reliability and abuse prevention.</ListItem>
            </List>

            <Title order={2} fz={22} fw={700} c="dark.8" mt="md">
              How we use it
            </Title>
            <List spacing="xs" size="md" c="dark.7">
              <ListItem>To provide resume analysis and document Q&amp;A.</ListItem>
              <ListItem>To maintain your history and account.</ListItem>
              <ListItem>
                Document contents are sent to our AI providers only to generate
                your results.
              </ListItem>
            </List>

            <Title order={2} fz={22} fw={700} c="dark.8" mt="md">
              Your choices
            </Title>
            <Text size="md" c="dark.7" lh={1.7}>
              You can delete documents and analyses from your history at any
              time. Contact hello@dossier.ai to request full account deletion.
            </Text>
          </Stack>
        </Container>
      </Box>
    </>
  );
}

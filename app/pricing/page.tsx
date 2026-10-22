import { Box, Container, Stack, Text, Title } from '@mantine/core';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import PricingTiers from '@/components/PricingTiers';

export const metadata: Metadata = {
  title: 'Pricing — Dossier AI',
  description:
    'Simple pricing for AI-powered resume feedback and document Q&A. Start free.',
};

export default function PricingPage() {
  return (
    <>
      <Navbar user={null} />
      <Box component="main">
        <Container size="lg" py={{ base: 64, md: 96 }} px="md">
          <Stack gap={48}>
            <Stack gap="sm" align="center" ta="center" maw={560} mx="auto">
              <Title order={1} fz={{ base: 32, sm: 44 }} fw={700} c="dark.8">
                Pricing
              </Title>
              <Text size="lg" c="dimmed" lh={1.6}>
                Start free. Upgrade when you need unlimited analyses, job-match
                reports, and more document storage.
              </Text>
            </Stack>

            <PricingTiers />

            <Text size="sm" c="dimmed" ta="center">
              Prices in USD. Taxes may apply. Cancel anytime.
            </Text>
          </Stack>
        </Container>
      </Box>
    </>
  );
}

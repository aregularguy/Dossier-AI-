'use client';

import {
  Badge,
  Button,
  Card,
  Group,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';
import { tiers } from '@/lib/pricing';

export default function PricingTiers() {
  const [cycle, setCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <Stack gap="xl" align="center">
      <SegmentedControl
        value={cycle}
        onChange={(v) => setCycle(v as 'monthly' | 'yearly')}
        radius="xl"
        size="md"
        data={[
          { label: 'Monthly', value: 'monthly' },
          { label: 'Yearly (2 months free)', value: 'yearly' },
        ]}
      />

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg" w="100%">
        {tiers.map((tier) => {
          const price =
            cycle === 'monthly' ? tier.monthly : tier.yearlyPerMonth;

          return (
            <Card
              key={tier.name}
              padding="xl"
              withBorder
              style={
                tier.highlight
                  ? { borderColor: '#101217', borderWidth: 2 }
                  : undefined
              }
            >
              <Stack gap="md" h="100%">
                <Group justify="space-between" align="center">
                  <Text fw={700} size="lg" c="dark.8">
                    {tier.name}
                  </Text>
                  {tier.highlight && (
                    <Badge variant="light" color="ink" radius="sm">
                      Popular
                    </Badge>
                  )}
                </Group>

                <Text size="sm" c="dimmed">
                  {tier.tagline}
                </Text>

                <Group gap={4} align="baseline">
                  {price === null ? (
                    <Text fz={28} fw={800} c="dark.8">
                      Custom
                    </Text>
                  ) : (
                    <>
                      <Text fz={32} fw={800} c="dark.8">
                        ${price}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {tier.unit ?? ''}/mo
                      </Text>
                    </>
                  )}
                </Group>

                <Button
                  component={Link}
                  href={tier.cta.href}
                  variant={tier.highlight ? 'filled' : 'light'}
                  color="ink"
                  fullWidth
                >
                  {tier.cta.label}
                </Button>

                <Stack gap="xs" mt="xs">
                  {tier.inherits && (
                    <Text size="sm" fw={500} c="dark.6">
                      Everything in {tier.inherits}, plus:
                    </Text>
                  )}
                  {tier.features.map((f) => (
                    <Group key={f} gap="xs" align="flex-start" wrap="nowrap">
                      <IconCheck
                        size={16}
                        color="#101217"
                        style={{ marginTop: 3, flexShrink: 0 }}
                      />
                      <Text size="sm" c="dark.6" lh={1.5}>
                        {f}
                      </Text>
                    </Group>
                  ))}
                </Stack>
              </Stack>
            </Card>
          );
        })}
      </SimpleGrid>
    </Stack>
  );
}

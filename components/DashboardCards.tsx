'use client';

import { Box, Group, SimpleGrid, Stack, Text, UnstyledButton } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';
import {
  cardLine,
  cyan,
  display,
  ink,
  inkDimmed,
  inkLine,
  innerFill,
  textDimmed,
} from '@/lib/design';

const actions = [
  {
    href: '/analyze',
    label: 'Review my resume',
    hint: 'Upload a PDF, paste the job description, get the gaps and the rewrites.',
    cta: 'Start an analysis',
    primary: true,
  },
  {
    href: '/ask',
    label: 'Ask my documents',
    hint: 'Chat across every PDF you have uploaded. Every answer cites its page.',
    cta: 'Open document chat',
    primary: false,
  },
] as const;

export default function DashboardCards() {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={{ base: 'md', md: 'lg' }}>
      {actions.map((action) => (
        <UnstyledButton
          key={action.href}
          component={Link}
          href={action.href}
          className={action.primary ? 'dossier-on-ink' : undefined}
          p={{ base: 'lg', md: 'xl' }}
          style={{
            display: 'block',
            borderRadius: 20,
            background: action.primary ? ink : '#fff',
            border: `1px solid ${action.primary ? inkLine : cardLine}`,
          }}
        >
          <Stack gap="sm" h="100%" justify="space-between">
            <Stack gap={8}>
              <Text
                fz={18}
                fw={600}
                ff={display}
                c={action.primary ? '#fff' : ink}
              >
                {action.label}
              </Text>
              <Text fz={13} c={action.primary ? inkDimmed : textDimmed} lh={1.6}>
                {action.hint}
              </Text>
            </Stack>

            <Group gap={8} wrap="nowrap" mt="sm">
              <Box
                px={14}
                py={7}
                style={{
                  borderRadius: 999,
                  background: action.primary ? cyan : innerFill,
                  border: `1px solid ${action.primary ? cyan : cardLine}`,
                }}
              >
                <Group gap={6} wrap="nowrap">
                  <Text fz={13} fw={600} c={ink}>
                    {action.cta}
                  </Text>
                  <IconArrowRight size={14} color={ink} />
                </Group>
              </Box>
            </Group>
          </Stack>
        </UnstyledButton>
      ))}
    </SimpleGrid>
  );
}

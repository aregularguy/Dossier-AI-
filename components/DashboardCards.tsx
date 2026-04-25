'use client';

import { Stack, Group, Text, UnstyledButton } from '@mantine/core';
import { IconFileAnalytics, IconMessageChatbot, IconArrowUpRight } from '@tabler/icons-react';
import Link from 'next/link';

const actions = [
  {
    href: '/analyze',
    icon: IconFileAnalytics,
    color: '#4338ca',
    bg: '#eef2ff',
    label: 'Review my resume',
    hint: 'Upload PDF + optional JD',
  },
  {
    href: '/ask',
    icon: IconMessageChatbot,
    color: '#0c7a60',
    bg: '#ecfdf5',
    label: 'Ask my documents',
    hint: 'Chat with any PDF',
  },
];

export default function DashboardCards() {
  return (
    <Stack gap={0} style={{ borderRadius: 12, border: '1px solid #e9ecef', overflow: 'hidden' }}>
      {actions.map((action, i) => (
        <UnstyledButton
          key={action.href}
          component={Link}
          href={action.href}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 22px',
            backgroundColor: '#fff',
            borderBottom: i < actions.length - 1 ? '1px solid #f1f3f5' : 'none',
            transition: 'background-color 0.12s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f8f9fa';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#fff';
          }}
        >
          <Group gap={14} wrap="nowrap">
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                backgroundColor: action.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <action.icon size={18} color={action.color} stroke={1.6} />
            </div>
            <div>
              <Text size="sm" fw={600} c="dark.8">
                {action.label}
              </Text>
              <Text size="xs" c="dimmed" mt={2}>
                {action.hint}
              </Text>
            </div>
          </Group>
          <IconArrowUpRight size={16} color="#adb5bd" style={{ flexShrink: 0 }} />
        </UnstyledButton>
      ))}
    </Stack>
  );
}

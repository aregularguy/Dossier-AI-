'use client';

import { Group, Button } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';

export function ResultsBackButton() {
  return (
    <Button
      component={Link}
      href="/dashboard"
      variant="subtle"
      leftSection={<IconArrowLeft size={16} />}
      size="sm"
    >
      Dashboard
    </Button>
  );
}

export function ResultsActions() {
  return (
    <Group justify="center" gap="md">
      <Button
        component={Link}
        href="/analyze"
        variant="filled"
        color="ink"
        size="md"
      >
        Analyze another
      </Button>
    </Group>
  );
}

'use client';

import { Group, Button, Text, Menu, Avatar } from '@mantine/core';
import { IconFileText, IconLogout, IconHistory } from '@tabler/icons-react';
import Link from 'next/link';
import { signOut } from '@/app/actions/auth';

interface NavbarProps {
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header
      style={{
        borderBottom: '1px solid #e9ecef',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <Group h={70} px="md" justify="space-between">
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Group gap="xs">
            <IconFileText size={28} color="#4338ca" />
            <Text size="lg" fw={700} c="#1e1b4b" style={{ letterSpacing: '-0.02em' }}>
              Dossier AI
            </Text>
          </Group>
        </Link>

        <Group>
          {user ? (
            <>
              <Button component={Link} href="/dashboard" variant="subtle" size="md">
                Dashboard
              </Button>
              <Button
                component={Link}
                href="/history"
                variant="subtle"
                leftSection={<IconHistory size={16} />}
                size="md"
              >
                History
              </Button>
              <Menu shadow="md" width={220}>
                <Menu.Target>
                  <Avatar
                    src={user.avatar}
                    alt={user.name || 'User'}
                    style={{ cursor: 'pointer' }}
                    color="brand"
                    size="md"
                  >
                    {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>
                    <Text size="sm" fw={600}>
                      {user.name || 'User'}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {user.email}
                    </Text>
                  </Menu.Label>
                  <Menu.Divider />
                  <Menu.Item leftSection={<IconLogout size={16} />} color="red" onClick={handleLogout}>
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </>
          ) : (
            <Button component={Link} href="/auth/signin" variant="filled" size="md">
              Sign In
            </Button>
          )}
        </Group>
      </Group>
    </header>
  );
}

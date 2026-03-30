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
    <header style={{
      borderBottom: '1px solid #e9ecef',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <Group h={70} px="md" justify="space-between">
        {/* Logo/Brand */}
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Group gap="xs">
            <IconFileText size={32} color="#228be6" />
            <Text
              size="xl"
              fw={800}
              style={{
                background: 'linear-gradient(135deg, #228be6 0%, #15aabf 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Resume Reviewer AI
            </Text>
          </Group>
        </Link>

        {/* Right side - Navigation or Auth */}
        <Group>
          {user ? (
            <>
              <Button
                component={Link}
                href="/dashboard"
                variant="subtle"
                size="md"
              >
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
                    color="blue"
                    size="md"
                  >
                    {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>
                    <Text size="sm" fw={600}>{user.name || 'User'}</Text>
                    <Text size="xs" c="dimmed">{user.email}</Text>
                  </Menu.Label>
                  <Menu.Divider />
                  <Menu.Item
                    leftSection={<IconLogout size={16} />}
                    color="red"
                    onClick={handleLogout}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </>
          ) : (
            <Button
              component={Link}
              href="/auth/signin"
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
              size="md"
            >
              Sign In
            </Button>
          )}
        </Group>
      </Group>
    </header>
  );
}

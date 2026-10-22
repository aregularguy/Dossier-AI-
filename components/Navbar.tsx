'use client';

import {
  Anchor,
  Avatar,
  Box,
  Burger,
  Button,
  Collapse,
  Container,
  Group,
  Menu,
  Stack,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconLogout } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@/app/actions/auth';
import {
  cardLine,
  cyan,
  display,
  ink,
  inkDimmed,
  inkLine,
  textDimmed,
} from '@/lib/design';

interface NavbarProps {
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
  } | null;
}

const appLinks = [
  { label: 'Overview', href: '/dashboard' },
  { label: 'Analyse', href: '/analyze' },
  { label: 'Documents', href: '/ask' },
  { label: 'History', href: '/history' },
] as const;

const marketingLinks = [
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
] as const;

/** Wordmark: the logo dot is cyan on ink, ink on light. */
function Wordmark({ onInk }: { onInk: boolean }) {
  return (
    <Anchor component={Link} href="/" underline="never">
      <Group gap={10} wrap="nowrap">
        <Box
          w={10}
          h={10}
          style={{
            borderRadius: 999,
            background: onInk ? cyan : ink,
            flexShrink: 0,
          }}
        />
        <Text
          fz={18}
          fw={600}
          c={onInk ? '#fff' : ink}
          ff={display}
          style={{ letterSpacing: '-0.02em' }}
        >
          Dossier AI
        </Text>
      </Group>
    </Anchor>
  );
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [opened, { toggle, close }] = useDisclosure(false);

  const handleLogout = async () => {
    await signOut();
  };

  // Signed-out visitors get the ink marketing bar; signed-in users the white
  // app bar with the text nav.
  if (!user) {
    return (
      <Box
        component="header"
        className="dossier-on-ink"
        style={{
          background: ink,
          borderBottom: `1px solid ${inkLine}`,
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Container size="lg" px="md">
          <Group h={72} justify="space-between" wrap="nowrap">
            <Wordmark onInk />

            <Group gap={28} visibleFrom="md" wrap="nowrap">
              {marketingLinks.map((link) => (
                <Anchor
                  key={link.href}
                  component={Link}
                  href={link.href}
                  underline="never"
                  fz="sm"
                  fw={500}
                  c={inkDimmed}
                >
                  {link.label}
                </Anchor>
              ))}
            </Group>

            <Group gap="sm" wrap="nowrap">
              <Button
                component={Link}
                href="/auth/signin"
                size="sm"
                visibleFrom="md"
                variant="transparent"
                c="#fff"
              >
                Sign in
              </Button>
              <Button
                component={Link}
                href="/auth/signin"
                size="sm"
                visibleFrom="xs"
                style={{ background: cyan, color: ink }}
              >
                Analyse my resume
              </Button>
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="md"
                size="sm"
                color="#fff"
                aria-label="Toggle navigation"
              />
            </Group>
          </Group>

          <Collapse in={opened} hiddenFrom="md">
            <Stack gap="xs" pb="md">
              {marketingLinks.map((link) => (
                <Anchor
                  key={link.href}
                  component={Link}
                  href={link.href}
                  onClick={close}
                  underline="never"
                  fz="sm"
                  fw={500}
                  c={inkDimmed}
                  py={6}
                >
                  {link.label}
                </Anchor>
              ))}
              <Anchor
                component={Link}
                href="/auth/signin"
                onClick={close}
                underline="never"
                fz="sm"
                fw={600}
                c="#fff"
                py={6}
              >
                Sign in
              </Anchor>
            </Stack>
          </Collapse>
        </Container>
      </Box>
    );
  }

  const initial =
    user.name?.charAt(0)?.toUpperCase() ||
    user.email?.charAt(0)?.toUpperCase() ||
    'U';

  return (
    <Box
      component="header"
      style={{
        background: '#fff',
        borderBottom: `1px solid ${cardLine}`,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <Container size="lg" px="md">
        <Group h={68} justify="space-between" wrap="nowrap">
          <Group gap={40} wrap="nowrap">
            <Wordmark onInk={false} />

            <Group gap={24} visibleFrom="sm" wrap="nowrap">
              {appLinks.map((link) => {
                const active =
                  pathname === link.href ||
                  pathname?.startsWith(`${link.href}/`) === true;
                return (
                  <Anchor
                    key={link.href}
                    component={Link}
                    href={link.href}
                    underline="never"
                    fz="sm"
                    fw={active ? 600 : 500}
                    c={active ? ink : textDimmed}
                    py={4}
                    style={{
                      borderBottom: `2px solid ${active ? ink : 'transparent'}`,
                    }}
                    aria-current={active ? 'page' : undefined}
                  >
                    {link.label}
                  </Anchor>
                );
              })}
            </Group>
          </Group>

          <Group gap="sm" wrap="nowrap">
            <Button component={Link} href="/analyze" size="sm" visibleFrom="xs">
              New analysis
            </Button>

            <Menu width={240} position="bottom-end" radius="md">
              <Menu.Target>
                <Avatar
                  src={user.avatar}
                  alt={user.name || 'Account'}
                  component="button"
                  aria-label="Account menu"
                  size={36}
                  style={{
                    cursor: 'pointer',
                    border: `1px solid ${cardLine}`,
                    background: ink,
                    color: '#fff',
                  }}
                >
                  {initial}
                </Avatar>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>
                  <Text size="sm" fw={600} c={ink}>
                    {user.name || 'User'}
                  </Text>
                  <Text size="xs" c={textDimmed}>
                    {user.email}
                  </Text>
                </Menu.Label>
                <Menu.Divider />
                {appLinks.map((link) => (
                  <Menu.Item
                    key={link.href}
                    component={Link}
                    href={link.href}
                    hiddenFrom="sm"
                  >
                    {link.label}
                  </Menu.Item>
                ))}
                <Menu.Item
                  leftSection={<IconLogout size={16} />}
                  color="red"
                  onClick={handleLogout}
                >
                  Sign out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </Container>
    </Box>
  );
}

'use client';

import {
  Anchor,
  Box,
  Button,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconArrowRight, IconCheck } from '@tabler/icons-react';
import Link from 'next/link';
import HeroDemo from '@/components/HeroDemo';
import Navbar from '@/components/Navbar';
import { tiers } from '@/lib/pricing';
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

const steps = [
  {
    n: '01',
    title: 'Upload your resume',
    description:
      'Drop in a PDF. We read both pages, keep the structure, and never train on it.',
  },
  {
    n: '02',
    title: 'Paste the job description',
    description:
      'Optional, but it is what turns generic advice into the gaps that cost you this role.',
  },
  {
    n: '03',
    title: 'Fix what actually matters',
    description:
      'A score, the bullets holding you back, and rewrites you can paste straight in.',
  },
] as const;

const bandTiers = tiers.slice(0, 3);

export default function Home() {
  return (
    <>
      <Navbar user={null} />

      <Box component="main">
        {/* ---------- Ink hero ---------- */}
        <Box className="dossier-on-ink" style={{ background: ink }}>
          <Container size="lg" px="md" pt={{ base: 56, md: 80 }} pb={{ base: 56, md: 88 }}>
            <Stack gap={48} align="center">
              <Stack gap="lg" align="center" maw={760}>
                <Text
                  fz={12}
                  fw={600}
                  c={cyan}
                  tt="uppercase"
                  style={{ letterSpacing: '0.1em' }}
                >
                  Resume review, evidenced
                </Text>
                <Title
                  order={1}
                  ta="center"
                  fz={{ base: 34, sm: 46, md: 58 }}
                  fw={600}
                  lh={1.08}
                  c="#fff"
                >
                  Know exactly what to fix on your resume
                </Title>
                <Text ta="center" fz={{ base: 15, sm: 17 }} c={inkDimmed} lh={1.65} maw={580}>
                  Upload a PDF, paste the job description, and get a score with the
                  bullets that are holding you back — plus the rewrite for each
                  one. About 30 seconds.
                </Text>
                <Group gap="sm" justify="center" mt="xs">
                  <Button
                    component={Link}
                    href="/auth/signin"
                    size="md"
                    style={{ background: cyan, color: ink }}
                    rightSection={<IconArrowRight size={16} />}
                  >
                    Analyse my resume
                  </Button>
                  <Button
                    component={Link}
                    href="/#how-it-works"
                    size="md"
                    variant="outline"
                    c="#fff"
                    styles={{ root: { borderColor: inkLine } }}
                  >
                    See how it works
                  </Button>
                </Group>
                <Text fz={12} c={inkDimmed}>
                  Free to start · No credit card · Your file stays yours
                </Text>
              </Stack>

              <HeroDemo />
            </Stack>
          </Container>
        </Box>

        {/* ---------- Three steps ---------- */}
        <Container id="how-it-works" size="lg" px="md" py={{ base: 64, md: 96 }}>
          <Stack gap={40}>
            <Stack gap="xs" maw={560}>
              <Title order={2} fz={{ base: 26, sm: 32 }} fw={600} c={ink}>
                Three steps, no guesswork
              </Title>
              <Text fz={15} c={textDimmed} lh={1.65}>
                Every claim in the report points back to a line in your resume or
                a requirement in the job description.
              </Text>
            </Stack>

            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={{ base: 'md', md: 'lg' }}>
              {steps.map((step) => (
                <Paper key={step.n} p="xl" withBorder style={{ borderColor: cardLine }}>
                  <Stack gap="sm">
                    <Text fz={13} fw={600} c={textDimmed} ff={display}>
                      {step.n}
                    </Text>
                    <Text fz={18} fw={600} c={ink} ff={display}>
                      {step.title}
                    </Text>
                    <Text fz={14} c={textDimmed} lh={1.6}>
                      {step.description}
                    </Text>
                  </Stack>
                </Paper>
              ))}
            </SimpleGrid>
          </Stack>
        </Container>

        {/* ---------- Document chat strip ---------- */}
        <Container size="lg" px="md" pb={{ base: 64, md: 96 }}>
          <Paper p={{ base: 'lg', md: 40 }} withBorder style={{ borderColor: cardLine }}>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 'xl', md: 48 }}>
              <Stack gap="md" justify="center">
                <Text
                  fz={12}
                  fw={600}
                  c={textDimmed}
                  tt="uppercase"
                  style={{ letterSpacing: '0.08em' }}
                >
                  Ask my documents
                </Text>
                <Title order={2} fz={{ base: 24, sm: 30 }} fw={600} c={ink}>
                  Then interrogate the paperwork
                </Title>
                <Text fz={14} c={textDimmed} lh={1.65}>
                  Upload the resume, the job description, the offer letter —
                  anything in PDF — and ask questions across all of them. Every
                  answer cites the page it came from, so you can check it.
                </Text>
                <Anchor
                  component={Link}
                  href="/ask"
                  underline="never"
                  fz="sm"
                  fw={600}
                  c={ink}
                >
                  <Group gap={6} wrap="nowrap">
                    Try document chat
                    <IconArrowRight size={14} />
                  </Group>
                </Anchor>
              </Stack>

              <Stack gap="sm">
                <Group justify="flex-end">
                  <Box
                    px={14}
                    py={10}
                    maw="85%"
                    style={{
                      background: ink,
                      borderRadius: 16,
                      borderBottomRightRadius: 4,
                    }}
                  >
                    <Text fz={13} c="#fff" lh={1.5}>
                      Does my resume answer the SLO requirement?
                    </Text>
                  </Box>
                </Group>
                <Box
                  px={14}
                  py={12}
                  style={{
                    background: innerFill,
                    border: `1px solid ${cardLine}`,
                    borderRadius: 16,
                    borderBottomLeftRadius: 4,
                  }}
                >
                  <Stack gap={8}>
                    <Text fz={13} c={ink} lh={1.6}>
                      Not directly. You mention uptime once, on page 2, without a
                      target or a number attached to it.
                    </Text>
                    <Group gap={6}>
                      {['resume.pdf · p.2', 'role.pdf · p.1'].map((cite) => (
                        <Text
                          key={cite}
                          fz={11}
                          c={textDimmed}
                          px={8}
                          py={3}
                          style={{
                            background: '#fff',
                            border: `1px solid ${cardLine}`,
                            borderRadius: 999,
                          }}
                        >
                          {cite}
                        </Text>
                      ))}
                    </Group>
                  </Stack>
                </Box>
              </Stack>
            </SimpleGrid>
          </Paper>
        </Container>

        {/* ---------- Pricing band ---------- */}
        <Container size="lg" px="md" pb={{ base: 72, md: 112 }}>
          <Stack gap={36}>
            <Group justify="space-between" align="flex-end" wrap="wrap" gap="md">
              <Stack gap="xs" maw={520}>
                <Title order={2} fz={{ base: 26, sm: 32 }} fw={600} c={ink}>
                  Start free, upgrade when it pays off
                </Title>
                <Text fz={15} c={textDimmed} lh={1.65}>
                  Three analyses a month on the free plan — enough to fix a resume
                  before you apply anywhere.
                </Text>
              </Stack>
              <Anchor
                component={Link}
                href="/pricing"
                underline="never"
                fz="sm"
                fw={600}
                c={ink}
              >
                <Group gap={6} wrap="nowrap">
                  Compare all plans
                  <IconArrowRight size={14} />
                </Group>
              </Anchor>
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={{ base: 'md', md: 'lg' }}>
              {bandTiers.map((tier) => {
                const highlight = tier.highlight === true;
                return (
                  <Paper
                    key={tier.name}
                    p="xl"
                    withBorder={!highlight}
                    className={highlight ? 'dossier-on-ink' : undefined}
                    style={{
                      borderColor: cardLine,
                      background: highlight ? ink : '#fff',
                    }}
                  >
                    <Stack gap="md" h="100%" justify="space-between">
                      <Stack gap="xs">
                        <Group justify="space-between" align="center">
                          <Text fz={16} fw={600} c={highlight ? '#fff' : ink} ff={display}>
                            {tier.name}
                          </Text>
                          {highlight && (
                            <Text fz={11} fw={600} c={cyan} tt="uppercase" style={{ letterSpacing: '0.08em' }}>
                              Popular
                            </Text>
                          )}
                        </Group>
                        <Group gap={6} align="baseline">
                          <Text fz={34} fw={600} c={highlight ? '#fff' : ink} ff={display}>
                            {tier.monthly === null ? 'Custom' : `$${tier.monthly}`}
                          </Text>
                          {tier.monthly !== null && (
                            <Text fz={13} c={highlight ? inkDimmed : textDimmed}>
                              {tier.unit ?? ''}/mo
                            </Text>
                          )}
                        </Group>
                        <Stack gap={8} mt="xs">
                          {tier.features.slice(0, 4).map((feature) => (
                            <Group key={feature} gap={8} wrap="nowrap" align="flex-start">
                              <IconCheck
                                size={14}
                                color={highlight ? cyan : ink}
                                stroke={2.2}
                                style={{ marginTop: 3, flexShrink: 0 }}
                              />
                              <Text fz={13} c={highlight ? inkDimmed : textDimmed} lh={1.5}>
                                {feature}
                              </Text>
                            </Group>
                          ))}
                        </Stack>
                      </Stack>

                      <Button
                        component={Link}
                        href={tier.cta.href}
                        size="sm"
                        fullWidth
                        mt="sm"
                        style={highlight ? { background: cyan, color: ink } : undefined}
                      >
                        {tier.cta.label}
                      </Button>
                    </Stack>
                  </Paper>
                );
              })}
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>
    </>
  );
}

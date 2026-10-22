'use client';

import {
  MantineProvider,
  createTheme,
  type MantineColorsTuple,
} from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { cardLine, radiusCard } from '@/lib/design';

// Authored/dark surfaces. Shade 9 is #101217 — the primary shade, so a filled
// Button is ink with white text.
const inkScale: MantineColorsTuple = [
  '#F2F4F6',
  '#E3E8EC',
  '#C6CED5',
  '#A8ADBB',
  '#7E8597',
  '#565B69',
  '#3A3F4B',
  '#262A33',
  '#191C23',
  '#101217',
];

// The single accent. Shade 4 is #4FD1E8 and is only used on ink surfaces.
const cyanScale: MantineColorsTuple = [
  '#E8FBFE',
  '#CFF6FB',
  '#A3EDF6',
  '#74E0EF',
  '#4FD1E8',
  '#2FC2DC',
  '#1FA9C2',
  '#17879B',
  '#126B7B',
  '#0C4F5B',
];

const theme = createTheme({
  primaryColor: 'ink',
  primaryShade: { light: 9, dark: 9 },
  fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: {
    fontFamily: '"Space Grotesk", "DM Sans", sans-serif',
    fontWeight: '600',
  },
  colors: {
    ink: inkScale,
    cyan: cyanScale,
  },
  defaultRadius: 'lg',
  components: {
    Button: {
      defaultProps: {
        radius: 'xl',
      },
    },
    ActionIcon: {
      defaultProps: {
        radius: 'xl',
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    Textarea: {
      defaultProps: {
        radius: 'md',
      },
    },
    Paper: {
      defaultProps: {
        radius: radiusCard,
        shadow: 'none',
      },
    },
    Card: {
      defaultProps: {
        radius: radiusCard,
        shadow: 'none',
        withBorder: true,
      },
      styles: {
        root: { borderColor: cardLine },
      },
    },
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications position="top-right" />
      {children}
    </MantineProvider>
  );
}

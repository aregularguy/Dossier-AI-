export interface PricingTier {
  name: string;
  tagline: string;
  monthly: number | null; // null = custom
  yearlyPerMonth: number | null; // effective per-month when billed yearly
  unit?: string; // e.g. "/user"
  cta: { label: string; href: string };
  highlight?: boolean;
  inherits?: string; // "Everything in X, plus:"
  features: string[];
}

export const tiers: PricingTier[] = [
  {
    name: 'Free',
    tagline: 'For trying things out',
    monthly: 0,
    yearlyPerMonth: 0,
    cta: { label: 'Get started', href: '/auth/signin' },
    features: [
      'No credit card required',
      '3 resume analyses per month',
      '1 document for Ask',
      'Score, suggestions & match %',
    ],
  },
  {
    name: 'Pro',
    tagline: 'For active job seekers',
    monthly: 12,
    yearlyPerMonth: 10,
    cta: { label: 'Start Pro', href: '/auth/signin' },
    highlight: true,
    inherits: 'Free',
    features: [
      'Unlimited resume analyses',
      'Up to 50 documents for Ask',
      'Job-description match reports',
      'Priority processing',
      'Full analysis history',
    ],
  },
  {
    name: 'Team',
    tagline: 'For recruiting & career teams',
    monthly: 30,
    yearlyPerMonth: 25,
    unit: '/user',
    cta: { label: 'Start Team', href: '/auth/signin' },
    inherits: 'Pro',
    features: [
      'Shared team workspace',
      'Centralized billing & admin',
      'Usage analytics',
      'Role-based access',
    ],
  },
  {
    name: 'Enterprise',
    tagline: 'For organizations at scale',
    monthly: null,
    yearlyPerMonth: null,
    cta: { label: 'Contact us', href: '/about' },
    inherits: 'Team',
    features: [
      'SSO / SAML',
      'Custom data retention',
      'Self-hosted RAG option',
      'Dedicated support & SLA',
    ],
  },
];

// Compact list shown on the sign-in page panel.
export const signInHighlights: string[] = [
  'Line-by-line resume suggestions in ~30 seconds',
  'Paste a job description for a match readout',
  'Ask questions about any PDF you upload',
  'Free to start — no credit card',
];

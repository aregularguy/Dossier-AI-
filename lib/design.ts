/**
 * Dossier AI design tokens.
 *
 * Two surface families: "ink" (authored, dark) and "mist" (the page). Cyan is
 * the single accent and is only ever used on an ink surface — never on light.
 */

export const ink = '#101217';
export const inkSoft = '#191C23';
export const inkLine = '#262A33';
export const inkDimmed = '#A8ADBB';

export const mist = '#E3E8EC';

export const cardBg = '#FFFFFF';
export const cardLine = '#D2D9DF';
export const innerFill = '#EFF3F6';
export const rowLine = '#DFE5EA';
export const buttonLine = '#C6CED5';

export const cyan = '#4FD1E8';

export const textDimmed = '#565B69';

export const scoreGood = '#14694F';
export const scoreFair = '#8A5A00';
export const scorePoor = '#A72B1E';

export const radiusCard = 20;
export const radiusPill = 999;

export const display = '"Space Grotesk", "DM Sans", sans-serif';

/** Score band colour — states differ in lightness as well as hue. */
export function scoreColor(score: number) {
  if (score >= 80) return scoreGood;
  if (score >= 60) return scoreFair;
  return scorePoor;
}

/** One-word verdict used alongside the numeral. */
export function scoreLabel(score: number) {
  if (score >= 80) return 'Strong';
  if (score >= 60) return 'Strong, with gaps';
  return 'Needs work';
}

/** Shared card chrome for Paper/Box on a mist surface. */
export const card = {
  background: cardBg,
  border: `1px solid ${cardLine}`,
  borderRadius: radiusCard,
} as const;

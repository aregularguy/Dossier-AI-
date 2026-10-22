/**
 * Validates a `next` redirect target taken from the URL.
 *
 * The value is attacker-controllable, so only same-origin paths are accepted.
 * `//evil.com` and `/\evil.com` are both parsed as protocol-relative URLs by
 * browsers, which would turn the sign-in flow into an open redirect.
 */
export function safeNextPath(
  value: string | null | undefined,
  fallback = '/dashboard'
): string {
  if (!value) return fallback;
  if (!value.startsWith('/')) return fallback;
  if (value.startsWith('//') || value.startsWith('/\\')) return fallback;
  // Reject control characters and whitespace, which can be used to smuggle
  // a second URL past naive parsers.
  if (/[\s\u0000-\u001f\u007f]/.test(value)) return fallback;
  return value;
}

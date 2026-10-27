import { createHash } from 'node:crypto';

/**
 * Money is stored and computed as integer cents (ISO 25010 / fintech rule).
 * Half-up rounding lives in ONE function — never float arithmetic in handlers.
 */
export function usdToCents(usd: number): number {
  if (!Number.isFinite(usd) || usd < 0) {
    throw new Error('INVALID_USD_AMOUNT');
  }
  return Math.round((usd + Number.EPSILON) * 100);
}

export function centsToUsd(cents: number): number {
  if (!Number.isInteger(cents) || cents < 0) {
    throw new Error('INVALID_CENTS_AMOUNT');
  }
  return cents / 100;
}

export function formatUsdFromCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function previewHash(payload: unknown): string {
  const canonical = JSON.stringify(payload);
  return createHash('sha256').update(canonical).digest('hex');
}

export function assertPreviewHash(expected: string, actual: string): boolean {
  if (expected.length !== actual.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i += 1) {
    mismatch |= expected.charCodeAt(i) ^ actual.charCodeAt(i);
  }
  return mismatch === 0;
}

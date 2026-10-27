import { describe, it, expect } from 'vitest';
import { usdToCents, centsToUsd, previewHash, assertPreviewHash } from '../src/lib/money.js';

describe('Money engine (integer cents + previewHash)', () => {
  it('converts USD to cents with half-up rounding', () => {
    expect(usdToCents(49)).toBe(4900);
    expect(usdToCents(149.99)).toBe(14999);
    expect(usdToCents(0.005)).toBe(1);
  });

  it('rejects negative or non-finite USD', () => {
    expect(() => usdToCents(-1)).toThrow('INVALID_USD_AMOUNT');
    expect(() => usdToCents(Number.NaN)).toThrow('INVALID_USD_AMOUNT');
  });

  it('round-trips cents to USD', () => {
    expect(centsToUsd(49900)).toBe(499);
  });

  it('previewHash is stable and mismatch-safe', () => {
    const a = previewHash({ orgId: 'org_1', plan: 'pro', amountCents: 14900 });
    const b = previewHash({ orgId: 'org_1', plan: 'pro', amountCents: 14900 });
    const c = previewHash({ orgId: 'org_1', plan: 'business', amountCents: 49900 });
    expect(a).toBe(b);
    expect(assertPreviewHash(a, b)).toBe(true);
    expect(assertPreviewHash(a, c)).toBe(false);
  });
});

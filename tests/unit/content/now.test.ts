import {afterEach, describe, expect, it, vi} from 'vitest';
import {currentTime} from '@/lib/content/now';

afterEach(() => vi.unstubAllEnvs());

describe('currentTime', () => {
  it('returns the pinned ELCA_NOW when set', () => {
    vi.stubEnv('ELCA_NOW', '2026-10-13T12:00:00-04:00');
    expect(currentTime().toISOString()).toBe('2026-10-13T16:00:00.000Z');
  });

  it('returns real time when ELCA_NOW is unset', () => {
    vi.stubEnv('ELCA_NOW', '');
    const before = Date.now();
    const t = currentTime().getTime();
    expect(t).toBeGreaterThanOrEqual(before);
    expect(t).toBeLessThanOrEqual(Date.now());
  });
});

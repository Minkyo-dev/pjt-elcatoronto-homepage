import {describe, expect, it} from 'vitest';
import {parseEnum} from '@/lib/validation/query';

const CATEGORIES = ['workshops', 'events', 'stories', 'news'] as const;

describe('parseEnum', () => {
  it('accepts allowed values', () => {
    expect(parseEnum('news', CATEGORIES)).toBe('news');
  });

  it('ignores missing, unknown, differently-cased, or malicious values', () => {
    expect(parseEnum(null, CATEGORIES)).toBeNull();
    expect(parseEnum('', CATEGORIES)).toBeNull();
    expect(parseEnum('NEWS', CATEGORIES)).toBeNull();
    expect(parseEnum('<script>alert(1)</script>', CATEGORIES)).toBeNull();
  });
});

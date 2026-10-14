import {describe, expect, it} from 'vitest';
import {localizedPath} from '@/lib/i18n/paths';

describe('localizedPath', () => {
  it('maps the home path to the bare locale prefix', () => {
    expect(localizedPath('en', '/')).toBe('/en');
    expect(localizedPath('ko', '/')).toBe('/ko');
  });

  it('prefixes nested paths', () => {
    expect(localizedPath('ko', '/get-involved/donate')).toBe('/ko/get-involved/donate');
  });
});

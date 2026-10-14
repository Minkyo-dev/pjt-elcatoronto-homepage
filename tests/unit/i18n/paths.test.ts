import {describe, expect, it} from 'vitest';
import {isKnownInternalHref, localizedPath, STATIC_PATHS} from '@/lib/i18n/paths';

describe('localizedPath', () => {
  it('maps the home path to the bare locale prefix', () => {
    expect(localizedPath('en', '/')).toBe('/en');
    expect(localizedPath('ko', '/')).toBe('/ko');
  });

  it('prefixes nested paths', () => {
    expect(localizedPath('ko', '/get-involved/donate')).toBe('/ko/get-involved/donate');
  });
});

describe('isKnownInternalHref', () => {
  const slugs = ['winter-networking-night-2026'];

  it('accepts static routes with optional query and hash', () => {
    expect(isKnownInternalHref('/get-involved/mentors#become-a-mentor', slugs)).toBe(true);
    expect(isKnownInternalHref('/contact?topic=mentor', slugs)).toBe(true);
    expect(isKnownInternalHref('/', slugs)).toBe(true);
  });

  it('accepts in-page anchors and existing content slugs', () => {
    expect(isKnownInternalHref('#apply', slugs)).toBe(true);
    expect(isKnownInternalHref('/events-news/winter-networking-night-2026', slugs)).toBe(true);
  });

  it('rejects unknown routes and slugs', () => {
    expect(isKnownInternalHref('/get-involved/volunteer', slugs)).toBe(false);
    expect(isKnownInternalHref('/events-news/missing', slugs)).toBe(false);
  });

  it('lists the eight static routes', () => {
    expect(STATIC_PATHS).toHaveLength(8);
  });
});

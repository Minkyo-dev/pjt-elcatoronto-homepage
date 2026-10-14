import {describe, expect, it} from 'vitest';
import {routing} from '@/lib/i18n/routing';

describe('routing', () => {
  it('supports English and Korean with English as default', () => {
    expect(routing.locales).toEqual(['en', 'ko']);
    expect(routing.defaultLocale).toBe('en');
  });

  it('always prefixes the locale in the URL', () => {
    expect(routing.localePrefix).toBe('always');
  });
});

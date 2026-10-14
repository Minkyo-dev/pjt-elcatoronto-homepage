import {describe, expect, it} from 'vitest';
import en from '@/messages/en.json';
import ko from '@/messages/ko.json';

function keyPaths(value: unknown, prefix = ''): string[] {
  if (value === null || typeof value !== 'object') return [prefix];
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    keyPaths(child, prefix ? `${prefix}.${key}` : key),
  );
}

function leafValues(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (value === null || typeof value !== 'object') return [];
  return Object.values(value as Record<string, unknown>).flatMap(leafValues);
}

describe('message catalogs', () => {
  it('have identical key sets in English and Korean', () => {
    expect(keyPaths(ko).sort()).toEqual(keyPaths(en).sort());
  });

  it('contain no blank strings', () => {
    for (const text of [...leafValues(en), ...leafValues(ko)]) {
      expect(text.trim()).not.toBe('');
    }
  });

  it('cover every namespace used by the app', () => {
    expect(Object.keys(en).sort()).toEqual(
      [
        'Carousel', 'Common', 'Contact', 'Donate', 'Errors', 'Events', 'Footer', 'Forms',
        'Mentors', 'Mentorship', 'Metadata', 'Nav', 'Newsletter', 'NotFound', 'Reports',
      ].sort(),
    );
  });
});

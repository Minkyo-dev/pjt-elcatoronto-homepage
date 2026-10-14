import {describe, expect, it} from 'vitest';
import {isLocalized, localize, resolveLocalized} from '@/lib/i18n/localize';

describe('isLocalized', () => {
  it('recognizes {en} and {en, ko} objects only', () => {
    expect(isLocalized({en: 'a'})).toBe(true);
    expect(isLocalized({en: 'a', ko: '가'})).toBe(true);
    expect(isLocalized({ko: '가'})).toBe(false);
    expect(isLocalized({en: 'a', other: 'b'})).toBe(false);
    expect(isLocalized({})).toBe(false);
    expect(isLocalized(['en'])).toBe(false);
    expect(isLocalized(null)).toBe(false);
  });
});

describe('localize', () => {
  it('returns the requested locale when present', () => {
    expect(localize({en: 'Mentor', ko: '멘토'}, 'ko')).toBe('멘토');
    expect(localize({en: 'Mentor', ko: '멘토'}, 'en')).toBe('Mentor');
  });

  it('falls back to English when Korean is missing', () => {
    expect(localize({en: 'Mentor'}, 'ko')).toBe('Mentor');
  });

  it('falls back to English when Korean is blank or empty', () => {
    expect(localize({en: 'Mentor', ko: ''}, 'ko')).toBe('Mentor');
    expect(localize({en: 'Mentor', ko: '   '}, 'ko')).toBe('Mentor');
    expect(localize({en: ['a'], ko: []}, 'ko')).toEqual(['a']);
  });
});

describe('resolveLocalized', () => {
  it('resolves nested objects and arrays', () => {
    const doc = {
      _id: 'x',
      title: {en: 'Hello', ko: '안녕'},
      tags: {en: ['one'], ko: ['하나']},
      ctas: [{label: {en: 'Go', ko: '가기'}, href: '/about'}],
      count: 3,
    };
    expect(resolveLocalized(doc, 'ko')).toEqual({
      _id: 'x',
      title: '안녕',
      tags: ['하나'],
      ctas: [{label: '가기', href: '/about'}],
      count: 3,
    });
  });

  it('passes Portable Text blocks through unchanged', () => {
    const block = {_type: 'block', _key: 'b0', style: 'normal', markDefs: [], children: [{_type: 'span', _key: 's', text: 'Hi', marks: []}]};
    expect(resolveLocalized({body: {en: [block], ko: [block]}}, 'en')).toEqual({body: [block]});
  });
});

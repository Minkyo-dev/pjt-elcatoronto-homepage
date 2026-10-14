import {describe, expect, it} from 'vitest';
import {localizedPt, pt} from '@/lib/utils/pt';

describe('pt', () => {
  const blocks = pt('First paragraph\ncontinues.\n\n## Heading\n\n- one\n- two\n\n### Small');

  it('creates one block per paragraph, heading, and list item', () => {
    expect(blocks.map((b) => [b.style, b.listItem ?? null])).toEqual([
      ['normal', null],
      ['h2', null],
      ['normal', 'bullet'],
      ['normal', 'bullet'],
      ['h3', null],
    ]);
  });

  it('joins wrapped lines and strips markers', () => {
    const texts = blocks.map((b) => (b.children[0] as {text: string}).text);
    expect(texts).toEqual(['First paragraph continues.', 'Heading', 'one', 'two', 'Small']);
  });

  it('gives every block and span a unique key', () => {
    const keys = blocks.flatMap((b) => [b._key, ...(b.children as {_key: string}[]).map((c) => c._key)]);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('builds a localized pair', () => {
    const value = localizedPt({en: 'Hi', ko: '안녕'});
    expect(value.en[0].style).toBe('normal');
    expect((value.ko![0].children[0] as {text: string}).text).toBe('안녕');
  });
});

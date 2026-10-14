import type {PortableTextBlock} from '@portabletext/types';
import type {Localized, RichText} from '@/types/common';

/**
 * Builds Portable Text from a tiny markdown subset so mock content stays readable.
 * Blocks are separated by a blank line. Supported: paragraphs, "## " (h2), "### " (h3),
 * and blocks whose every line starts with "- " (bullet items).
 */
export function pt(source: string, keyPrefix = 'b'): RichText {
  const blocks: PortableTextBlock[] = [];
  let index = 0;

  const block = (text: string, style: string, listItem?: 'bullet'): PortableTextBlock => {
    const key = `${keyPrefix}${index++}`;
    return {
      _type: 'block',
      _key: key,
      style,
      markDefs: [],
      children: [{_type: 'span', _key: `${key}s`, text, marks: []}],
      ...(listItem ? {listItem, level: 1} : {}),
    };
  };

  for (const chunk of source.trim().split(/\n\s*\n/)) {
    const lines = chunk
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    if (lines.length === 0) continue;

    if (lines.every((line) => line.startsWith('- '))) {
      for (const line of lines) blocks.push(block(line.slice(2), 'normal', 'bullet'));
    } else if (lines[0].startsWith('### ')) {
      blocks.push(block(lines.join(' ').slice(4), 'h3'));
    } else if (lines[0].startsWith('## ')) {
      blocks.push(block(lines.join(' ').slice(3), 'h2'));
    } else {
      blocks.push(block(lines.join(' '), 'normal'));
    }
  }

  return blocks;
}

export function localizedPt(value: {en: string; ko: string}): Localized<RichText> {
  return {en: pt(value.en), ko: pt(value.ko)};
}

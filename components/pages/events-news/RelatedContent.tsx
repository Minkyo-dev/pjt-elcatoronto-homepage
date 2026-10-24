import {Section} from '@/components/layout/Section';
import {ContentCard} from '@/components/sections/ContentCard';
import {SectionHeading} from '@/components/sections/SectionHeading';
import {cidAttrs, itemCid, subCid} from '@/lib/utils/cid';
import type {ContentItem} from '@/types/event';

/** `cid` is this block's section ID (the block is a section of the detail screen). */
export function RelatedContent({items, title, cid}: {items: ContentItem[]; title: string; cid?: string}) {
  if (items.length === 0) return null;
  return (
    <Section id="related" labelledBy="related-title" tone="surface" cid={cid}>
      <SectionHeading id="related-title" title={title} cid={subCid(cid, 1)} />
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" {...cidAttrs(subCid(cid, 2), 'RelatedList')}>
        {items.map((item) => (
          <li key={item.slug}>
            <ContentCard item={item} cid={itemCid(subCid(cid, 2))} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

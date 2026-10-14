import {Section} from '@/components/layout/Section';
import {ContentCard} from '@/components/sections/ContentCard';
import {SectionHeading} from '@/components/sections/SectionHeading';
import type {ContentItem} from '@/types/event';

export function RelatedContent({items, title}: {items: ContentItem[]; title: string}) {
  if (items.length === 0) return null;
  return (
    <Section id="related" labelledBy="related-title" tone="surface">
      <SectionHeading id="related-title" title={title} />
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.slug}>
            <ContentCard item={item} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

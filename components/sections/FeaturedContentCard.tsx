import {useFormatter, useTranslations} from 'next-intl';
import {Badge} from '@/components/ui/Badge';
import {FlagBadges} from '@/components/ui/FlagBadges';
import {ImageFrame} from '@/components/ui/ImageFrame';
import {categoryOf} from '@/lib/content/helpers/content';
import {Link} from '@/lib/i18n/navigation';
import {cidAttrs} from '@/lib/utils/cid';
import {cn} from '@/lib/utils/cn';
import type {ContentItem} from '@/types/event';
import {cardClass, cardLinkClass} from './EventCard';

export function FeaturedContentCard({item, cid}: {item: ContentItem; cid?: string}) {
  const t = useTranslations('Events');
  const format = useFormatter();
  const date = item.type === 'event' ? item.startsAt : item.publishedAt;
  const summary = item.type === 'event' ? item.summary : item.excerpt;

  return (
    <article className={cn(cardClass, 'lg:flex-row')} {...cidAttrs(cid, 'FeaturedContentCard')}>
      <ImageFrame image={item.coverImage} ratio="16/9" sizes="(min-width: 1024px) 60vw, 100vw" rounded={false} className="lg:w-3/5" />
      <div className="flex flex-1 flex-col justify-center gap-4 p-6 lg:p-10">
        <div className="flex flex-wrap gap-2">
          <Badge variant="category">{t(`categories.${categoryOf(item)}`)}</Badge>
          <FlagBadges flags={item} />
        </div>
        <p className="text-sm font-medium text-secondary">
          <time dateTime={date}>{format.dateTime(new Date(date), {dateStyle: 'long'})}</time>
        </p>
        <h3 className="font-heading text-h2 font-bold text-text">
          <Link href={`/events-news/${item.slug}`} className={cardLinkClass}>
            {item.title}
          </Link>
        </h3>
        <p className="text-lg text-muted">{summary}</p>
      </div>
    </article>
  );
}

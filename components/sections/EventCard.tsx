import {MapPin} from 'lucide-react';
import {useFormatter, useTranslations} from 'next-intl';
import {Badge} from '@/components/ui/Badge';
import {FlagBadges} from '@/components/ui/FlagBadges';
import {ImageFrame} from '@/components/ui/ImageFrame';
import {Link} from '@/lib/i18n/navigation';
import {cidAttrs} from '@/lib/utils/cid';
import type {EventItem} from '@/types/event';

export const cardClass =
  'relative flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-secondary has-[a:focus-visible]:outline';
export const cardLinkClass = 'after:absolute after:inset-0 focus-visible:outline-none hover:underline';
export const cardImageSizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw';

export function EventCard({event, cid}: {event: EventItem; cid?: string}) {
  const t = useTranslations('Events');
  const format = useFormatter();
  return (
    <article className={cardClass} {...cidAttrs(cid, 'EventCard')}>
      <ImageFrame image={event.coverImage} ratio="3/2" sizes={cardImageSizes} rounded={false} />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="category">{t(`categories.${event.kind === 'workshop' ? 'workshops' : 'events'}`)}</Badge>
          {event.status === 'past' ? <Badge>{t('status.past')}</Badge> : null}
          <FlagBadges flags={event} />
        </div>
        <p className="text-sm font-medium text-secondary">
          <time dateTime={event.startsAt}>
            {format.dateTime(new Date(event.startsAt), {dateStyle: 'medium', timeStyle: 'short'})}
          </time>
        </p>
        <h3 className="font-heading text-h3 font-bold text-text">
          <Link href={`/events-news/${event.slug}`} className={cardLinkClass}>
            {event.title}
          </Link>
        </h3>
        <p className="text-muted">{event.summary}</p>
        <p className="mt-auto flex items-center gap-2 pt-2 text-sm text-muted">
          <MapPin aria-hidden="true" className="size-4 shrink-0" />
          {t(`location.${event.location.mode}`)} · {event.location.label}
        </p>
        {event.status === 'upcoming' ? (
          <p aria-hidden="true" className="text-sm font-semibold text-primary">
            {t('detailsRegister')} →
          </p>
        ) : null}
      </div>
    </article>
  );
}

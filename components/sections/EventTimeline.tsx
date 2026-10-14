import {useFormatter, useTranslations} from 'next-intl';
import {Fragment} from 'react';
import {Badge} from '@/components/ui/Badge';
import {Link} from '@/lib/i18n/navigation';
import type {TimelineYear} from '@/types/event';

export function EventTimeline({years}: {years: TimelineYear[]}) {
  const t = useTranslations('Events');
  const format = useFormatter();
  const firstUpcoming = years.flatMap((year) => year.items).find((item) => item.status === 'upcoming')?.slug;

  return (
    <ol className="flex flex-col gap-10">
      {years.map((year) => (
        <li key={year.year} className="grid gap-4 lg:grid-cols-12">
          <h3 className="font-heading text-h3 font-extrabold text-secondary lg:col-span-2">{year.year}</h3>
          <ul className="flex flex-col gap-3 lg:col-span-10">
            {year.items.map((item) => (
              <Fragment key={item.slug}>
                {item.slug === firstUpcoming ? (
                  <li className="flex items-center gap-3 text-sm font-semibold text-accent-strong">
                    <span aria-hidden="true" className="h-px flex-1 bg-accent" />
                    {t('timelineNow')}
                    <span aria-hidden="true" className="h-px flex-1 bg-accent" />
                  </li>
                ) : null}
                <li className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-card border border-border bg-surface px-4 py-3">
                  <time dateTime={item.startsAt} className="w-32 shrink-0 text-sm text-muted">
                    {format.dateTime(new Date(item.startsAt), {dateStyle: 'medium'})}
                  </time>
                  <Link href={`/events-news/${item.slug}`} className="min-w-0 flex-1 font-semibold text-text underline-offset-4 hover:underline">
                    {item.title}
                  </Link>
                  <Badge variant={item.status === 'upcoming' ? 'category' : 'neutral'}>{t(`status.${item.status}`)}</Badge>
                </li>
              </Fragment>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

import {getFormatter, getTranslations} from 'next-intl/server';
import type {ReactNode} from 'react';
import {Container} from '@/components/layout/Container';
import {Section} from '@/components/layout/Section';
import {Breadcrumb} from '@/components/sections/Breadcrumb';
import {Gallery} from '@/components/sections/Gallery';
import {SectionHeading} from '@/components/sections/SectionHeading';
import {Badge} from '@/components/ui/Badge';
import {Button} from '@/components/ui/Button';
import {FlagBadges} from '@/components/ui/FlagBadges';
import {ImageFrame} from '@/components/ui/ImageFrame';
import {RichText} from '@/components/ui/RichText';
import {cidAttrs, itemCid} from '@/lib/utils/cid';
import type {ContentItem, EventItem} from '@/types/event';
import {EventRegisterForm} from './EventRegisterForm';
import {RelatedContent} from './RelatedContent';

function DetailItem({label, children}: {label: string; children: ReactNode}) {
  return (
    <div className="flex flex-col gap-1 rounded-card border border-border bg-surface p-4" {...cidAttrs(itemCid('EVD-01-05'), 'DetailItem')}>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="font-semibold text-text">{children}</dd>
    </div>
  );
}

export async function EventDetail({event, related}: {event: EventItem; related: ContentItem[]}) {
  const [t, tNav, format] = await Promise.all([getTranslations('Events'), getTranslations('Nav'), getFormatter()]);
  const when = format.dateTimeRange(new Date(event.startsAt), new Date(event.endsAt), {dateStyle: 'full', timeStyle: 'short'});
  const upcoming = event.status === 'upcoming';

  return (
    <>
      <section aria-labelledby="page-title" className="border-b border-border bg-background" {...cidAttrs('EVD-01', 'DetailHeader')}>
        <Container className="flex flex-col items-start gap-6 py-12 lg:py-16">
          <Breadcrumb items={[{label: tNav('eventsNews'), href: '/events-news'}]} current={event.title} cid="EVD-01-01" />
          <div className="flex flex-wrap gap-2" {...cidAttrs('EVD-01-02', 'BadgeRow')}>
            <Badge variant="category">{t(`categories.${event.kind === 'workshop' ? 'workshops' : 'events'}`)}</Badge>
            <Badge>{t(`status.${event.status}`)}</Badge>
            <FlagBadges flags={event} />
          </div>
          <h1 id="page-title" className="max-w-heading font-heading text-display font-extrabold text-balance text-text" {...cidAttrs('EVD-01-03', 'Title')}>
            {event.title}
          </h1>
          <p className="max-w-body text-lg text-muted" {...cidAttrs('EVD-01-04', 'Summary')}>{event.summary}</p>
          <dl className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4" {...cidAttrs('EVD-01-05', 'DetailList')}>
            <DetailItem label={t('when')}>
              <time dateTime={event.startsAt}>{when}</time>
            </DetailItem>
            <DetailItem label={t('where')}>
              {t(`location.${event.location.mode}`)} · {event.location.label}
            </DetailItem>
            {event.audience ? <DetailItem label={t('audience')}>{event.audience}</DetailItem> : null}
            {event.capacity ? <DetailItem label={t('capacity')}>{t('capacityValue', {count: event.capacity})}</DetailItem> : null}
          </dl>
          {upcoming ? (
            <Button href="#register" size="lg" cid="EVD-01-06">
              {t('register')}
            </Button>
          ) : null}
        </Container>
      </section>

      <Section cid="EVD-02">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-8 lg:col-span-8">
            <ImageFrame image={event.coverImage} ratio="16/9" sizes="(min-width: 1024px) 66vw, 100vw" eager cid="EVD-02-01" />
            <RichText value={event.body} cid="EVD-02-02" />
            {event.agenda?.length ? (
              <section aria-labelledby="agenda-title" {...cidAttrs('EVD-02-03', 'Agenda')}>
                <h2 id="agenda-title" className="mb-4 font-heading text-h3 font-bold text-text">
                  {t('agenda')}
                </h2>
                <ol className="divide-y divide-border rounded-card border border-border bg-surface">
                  {event.agenda.map((entry) => (
                    <li key={entry.time} className="flex gap-4 px-5 py-3" {...cidAttrs(itemCid('EVD-02-03'), 'AgendaItem')}>
                      <span className="w-14 shrink-0 font-semibold text-secondary">{entry.time}</span>
                      <span>{entry.item}</span>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}
          </div>
          {upcoming ? (
            <section
              id="register"
              aria-labelledby="register-title"
              className="flex flex-col gap-4 self-start rounded-card border border-border bg-surface p-6 lg:col-span-4"
              {...cidAttrs('EVD-02-04', 'RegisterPanel')}
            >
              <h2 id="register-title" className="font-heading text-h3 font-bold text-text">
                {t('register')}
              </h2>
              <p className="text-sm text-muted">{t('registerIntro')}</p>
              <EventRegisterForm cid="EVD-02-05" />
            </section>
          ) : null}
        </div>
      </Section>

      {!upcoming && event.gallery?.length ? (
        <Section id="recap" labelledBy="recap-title" tone="surface" cid="EVD-03">
          <SectionHeading id="recap-title" title={t('recap')} cid="EVD-03-01" />
          <Gallery
            items={event.gallery.map((image, index) => ({key: `${event.slug}-${index}`, image, caption: event.title}))}
            label={t('galleryLabel')}
            cid="EVD-03-02"
          />
        </Section>
      ) : null}

      <RelatedContent items={related} title={t('related')} cid="EVD-04" />
    </>
  );
}

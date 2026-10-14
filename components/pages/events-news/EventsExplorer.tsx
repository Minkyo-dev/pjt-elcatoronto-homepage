'use client';

import {useTranslations} from 'next-intl';
import {useState, type ReactNode} from 'react';
import {Section} from '@/components/layout/Section';
import {EventCard} from '@/components/sections/EventCard';
import {EventTimeline} from '@/components/sections/EventTimeline';
import {Gallery} from '@/components/sections/Gallery';
import {NewsCard} from '@/components/sections/NewsCard';
import {SectionHeading} from '@/components/sections/SectionHeading';
import {Button} from '@/components/ui/Button';
import {EmptyState} from '@/components/ui/EmptyState';
import {Tabs} from '@/components/ui/Tabs';
import {CONTENT_CATEGORIES, matchesCategory} from '@/lib/content/helpers/content';
import {useQueryParam} from '@/lib/hooks/useQueryParam';
import type {SectionIntroView} from '@/types/common';
import type {ContentCategory, EventItem, Post, TimelineYear} from '@/types/event';

const PAGE_SIZE = 6;
type TabId = ContentCategory | 'all';

type EventsExplorerProps = {
  upcoming: EventItem[];
  past: EventItem[];
  posts: Post[];
  timeline: TimelineYear[];
  intros: {upcoming: SectionIntroView; timeline: SectionIntroView; latest: SectionIntroView; recap: SectionIntroView};
};

function CardList({id, intro, items}: {id: string; intro: SectionIntroView; items: {key: string; node: ReactNode}[]}) {
  const t = useTranslations('Events');
  const tCommon = useTranslations('Common');
  const [visible, setVisible] = useState(PAGE_SIZE);
  return (
    <section id={id} aria-labelledby={`${id}-title`}>
      <SectionHeading id={`${id}-title`} eyebrow={intro.eyebrow} title={intro.title} intro={intro.intro} />
      {items.length === 0 ? (
        <EmptyState title={t('emptyTitle')} body={t('emptyBody')} />
      ) : (
        <>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.slice(0, visible).map((item) => (
              <li key={item.key}>{item.node}</li>
            ))}
          </ul>
          {visible < items.length ? (
            <div className="mt-8 flex justify-center">
              <Button variant="secondary" onClick={() => setVisible((count) => count + PAGE_SIZE)}>
                {tCommon('loadMore')}
              </Button>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}

export function EventsExplorer({upcoming, past, posts, timeline, intros}: EventsExplorerProps) {
  const t = useTranslations('Events');
  const [param, setParam] = useQueryParam('category', CONTENT_CATEGORIES);
  const category: TabId = param ?? 'all';

  const showEvents = category === 'all' || category === 'workshops' || category === 'events';
  const showPosts = category === 'all' || category === 'stories' || category === 'news';
  const eventMatches = (event: {kind: EventItem['kind']}) => matchesCategory({type: 'event', kind: event.kind}, category);

  const filteredUpcoming = upcoming.filter(eventMatches);
  const filteredPast = past.filter(eventMatches);
  const filteredPosts = posts.filter((post) => matchesCategory({type: 'post', kind: post.kind}, category));
  const filteredTimeline = timeline
    .map((year) => ({...year, items: year.items.filter(eventMatches)}))
    .filter((year) => year.items.length > 0);
  const recapPhotos = filteredPast.flatMap((event) =>
    (event.gallery ?? []).map((image, index) => ({
      key: `${event.slug}-${index}`,
      image,
      caption: event.title,
      href: `/events-news/${event.slug}`,
    })),
  );

  const tabs = (['all', ...CONTENT_CATEGORIES] as TabId[]).map((id) => ({id, label: t(`categories.${id}`)}));

  return (
    <Section id="explore" labelledBy="explore-title">
      <h2 id="explore-title" className="sr-only">
        {t('tabsLabel')}
      </h2>
      <Tabs
        label={t('tabsLabel')}
        items={tabs}
        value={category}
        onValueChange={(id) => setParam(id === 'all' ? null : (id as ContentCategory))}
      >
        <div className="flex flex-col gap-20">
          {showEvents ? (
            <CardList
              key={`events-${category}`}
              id="events"
              intro={intros.upcoming}
              items={filteredUpcoming.map((event) => ({key: event.slug, node: <EventCard event={event} />}))}
            />
          ) : null}

          {showEvents && filteredTimeline.length > 0 ? (
            <section id="timeline" aria-labelledby="timeline-title">
              <SectionHeading id="timeline-title" eyebrow={intros.timeline.eyebrow} title={intros.timeline.title} />
              <EventTimeline years={filteredTimeline} />
            </section>
          ) : null}

          {showPosts ? (
            <CardList
              key={`latest-${category}`}
              id="latest"
              intro={intros.latest}
              items={filteredPosts.map((post) => ({key: post.slug, node: <NewsCard post={post} />}))}
            />
          ) : null}

          {showEvents ? (
            <section id="recap" aria-labelledby="recap-title">
              <SectionHeading id="recap-title" eyebrow={intros.recap.eyebrow} title={intros.recap.title} />
              {recapPhotos.length > 0 ? (
                <Gallery key={`recap-${category}`} items={recapPhotos} label={t('galleryLabel')} />
              ) : (
                <EmptyState title={t('emptyTitle')} body={t('emptyBody')} />
              )}
            </section>
          ) : null}
        </div>
      </Tabs>
    </Section>
  );
}

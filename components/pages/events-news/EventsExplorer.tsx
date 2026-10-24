'use client';

import {useTranslations} from 'next-intl';
import {useEffect, useRef, useState, type ReactNode} from 'react';
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
import {useRevealFocus} from '@/lib/hooks/useRevealFocus';
import {useQueryParam} from '@/lib/hooks/useQueryParam';
import {cidAttrs, itemCid, subCid} from '@/lib/utils/cid';
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

/** `cid` is the block's section ID; each item's card carries `itemCid` of the list (`{cid}-02`). */
function CardList({id, intro, items, cid}: {id: string; intro: SectionIntroView; items: {key: string; node: ReactNode}[]; cid: string}) {
  const t = useTranslations('Events');
  const tCommon = useTranslations('Common');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const {listRef, reveal} = useRevealFocus<HTMLUListElement>(visible);
  return (
    <section id={id} aria-labelledby={`${id}-title`} {...cidAttrs(cid, 'Section')}>
      <SectionHeading id={`${id}-title`} eyebrow={intro.eyebrow} title={intro.title} intro={intro.intro} cid={subCid(cid, 1)} />
      {items.length === 0 ? (
        <EmptyState title={t('emptyTitle')} body={t('emptyBody')} cid={subCid(cid, 4)} />
      ) : (
        <>
          <ul ref={listRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" {...cidAttrs(subCid(cid, 2), 'CardList')}>
            {items.slice(0, visible).map((item) => (
              <li key={item.key}>{item.node}</li>
            ))}
          </ul>
          {visible < items.length ? (
            <div className="mt-8 flex justify-center">
              <Button variant="secondary" cid={subCid(cid, 3)} onClick={() => {
                  reveal(visible);
                  setVisible((count) => count + PAGE_SIZE);
                }}
              >
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

  // "View Upcoming Events" (#events) must work from the Stories/News tabs, which hide that block.
  // Only react to the hash being followed (on load or hashchange), never to later tab changes.
  const eventsHidden = useRef(false);
  useEffect(() => {
    eventsHidden.current = !showEvents;
  }, [showEvents]);
  useEffect(() => {
    const followHash = () => {
      if (window.location.hash !== '#events' || !eventsHidden.current) return;
      setParam(null);
      requestAnimationFrame(() => document.getElementById('events')?.scrollIntoView());
    };
    followHash();
    window.addEventListener('hashchange', followHash);
    return () => window.removeEventListener('hashchange', followHash);
  }, [setParam]);

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
    <Section id="explore" labelledBy="explore-title" cid="EVT-03">
      <h2 id="explore-title" className="sr-only">
        {t('tabsLabel')}
      </h2>
      <Tabs
        label={t('tabsLabel')}
        items={tabs}
        value={category}
        onValueChange={(id) => setParam(id === 'all' ? null : (id as ContentCategory))}
        cid="EVT-03-01"
      >
        <div className="flex flex-col gap-20">
          {showEvents ? (
            <CardList
              key={`events-${category}`}
              id="events"
              cid="EVT-04"
              intro={intros.upcoming}
              items={filteredUpcoming.map((event) => ({key: event.slug, node: <EventCard event={event} cid={itemCid('EVT-04-02')} />}))}
            />
          ) : null}

          {showEvents && filteredTimeline.length > 0 ? (
            <section id="timeline" aria-labelledby="timeline-title" {...cidAttrs('EVT-05', 'Section')}>
              <SectionHeading id="timeline-title" eyebrow={intros.timeline.eyebrow} title={intros.timeline.title} cid="EVT-05-01" />
              <EventTimeline years={filteredTimeline} cid="EVT-05-02" />
            </section>
          ) : null}

          {showPosts ? (
            <CardList
              key={`latest-${category}`}
              id="latest"
              cid="EVT-06"
              intro={intros.latest}
              items={filteredPosts.map((post) => ({key: post.slug, node: <NewsCard post={post} cid={itemCid('EVT-06-02')} />}))}
            />
          ) : null}

          {showEvents ? (
            <section id="recap" aria-labelledby="recap-title" {...cidAttrs('EVT-07', 'Section')}>
              <SectionHeading id="recap-title" eyebrow={intros.recap.eyebrow} title={intros.recap.title} cid="EVT-07-01" />
              {recapPhotos.length > 0 ? (
                <Gallery key={`recap-${category}`} items={recapPhotos} label={t('galleryLabel')} cid="EVT-07-02" />
              ) : (
                <EmptyState title={t('emptyTitle')} body={t('emptyBody')} cid="EVT-07-03" />
              )}
            </section>
          ) : null}
        </div>
      </Tabs>
    </Section>
  );
}

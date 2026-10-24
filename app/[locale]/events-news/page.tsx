import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {Section} from '@/components/layout/Section';
import {EventForms} from '@/components/pages/events-news/EventForms';
import {EventsExplorer} from '@/components/pages/events-news/EventsExplorer';
import {FAQSection} from '@/components/sections/FAQSection';
import {FeaturedContentCard} from '@/components/sections/FeaturedContentCard';
import {Hero} from '@/components/sections/Hero';
import {SectionHeading} from '@/components/sections/SectionHeading';
import {getFeaturedContent} from '@/lib/content/content';
import {getEventTimeline, getEvents} from '@/lib/content/events';
import {getFaqs} from '@/lib/content/faq';
import {getEventsPage} from '@/lib/content/pages';
import {getPosts} from '@/lib/content/posts';
import {assertLocale} from '@/lib/i18n/locale';
import {buildPageMetadata} from '@/lib/i18n/metadata';

export async function generateMetadata({params}: PageProps<'/[locale]/events-news'>): Promise<Metadata> {
  const locale = assertLocale((await params).locale);
  const page = await getEventsPage(locale);
  return buildPageMetadata({locale, path: '/events-news', title: page.seo.title, description: page.seo.description});
}

export default async function EventsNewsPage({params}: PageProps<'/[locale]/events-news'>) {
  const locale = assertLocale((await params).locale);
  const [page, featured, upcoming, past, posts, timeline, faqs, t] = await Promise.all([
    getEventsPage(locale),
    getFeaturedContent(locale),
    getEvents({locale, status: 'upcoming'}),
    getEvents({locale, status: 'past'}),
    getPosts({locale}),
    getEventTimeline(locale),
    getFaqs(locale, 'events'),
    getTranslations('Events'),
  ]);

  return (
    <>
      <Hero hero={page.hero} cid="EVT-01" />

      {featured ? (
        <Section id="featured" labelledBy="featured-title" tone="surface" cid="EVT-02">
          <SectionHeading id="featured-title" eyebrow={page.featured.eyebrow} title={page.featured.title} cid="EVT-02-01" />
          <FeaturedContentCard item={featured} cid="EVT-02-02" />
        </Section>
      ) : null}

      <EventsExplorer
        upcoming={upcoming}
        past={past}
        posts={posts}
        timeline={timeline}
        intros={{upcoming: page.upcoming, timeline: page.timeline, latest: page.latest, recap: page.recap}}
      />

      <Section id="host-or-request" labelledBy="forms-title" tone="surface" cid="EVT-08">
        <SectionHeading id="forms-title" eyebrow={page.forms.eyebrow} title={page.forms.title} cid="EVT-08-01" />
        <EventForms hostIntro={page.forms.hostIntro} requestIntro={page.forms.requestIntro} cid="EVT-08-02" formCid="EVT-08-03" />
      </Section>

      <FAQSection id="event-qa" intro={{title: t('questionsTitle')}} faqs={faqs} cid="EVT-09" />
    </>
  );
}

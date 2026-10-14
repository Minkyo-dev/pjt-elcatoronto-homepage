import 'server-only';
import {events} from '@/data/mock/events';
import {aboutPage} from '@/data/mock/pages/about';
import {contactPage} from '@/data/mock/pages/contact';
import {donatePage} from '@/data/mock/pages/donate';
import {eventsPage} from '@/data/mock/pages/events';
import {homePage} from '@/data/mock/pages/home';
import {mentorshipPage} from '@/data/mock/pages/mentorship';
import {mentorsPage} from '@/data/mock/pages/mentors';
import {reportsPage} from '@/data/mock/pages/reports';
import {resolveLocalized} from '@/lib/i18n/localize';
import type {Locale} from '@/types/common';
import type {
  AboutPage,
  ContactPage,
  DonatePage,
  EventsPage,
  HomePage,
  MentorshipPage,
  MentorsPage,
  ReportsPage,
} from '@/types/pages';

export async function getHomePage(locale: Locale): Promise<HomePage> {
  'use cache';
  const page = resolveLocalized(homePage, locale);
  const heroSlides = page.heroSlides.map((slide) => {
    if (slide.kind !== 'event' || !slide.eventSlug) return slide;
    const doc = events.find((event) => event.slug === slide.eventSlug);
    if (!doc) return slide;
    const event = resolveLocalized(doc, locale);
    return {
      ...slide,
      media: {...slide.media, image: event.coverImage},
      ctas: slide.ctas.map((cta, index) => (index === 0 ? {...cta, href: `/events-news/${event.slug}`} : cta)),
    };
  });
  return {...page, heroSlides};
}

export async function getAboutPage(locale: Locale): Promise<AboutPage> {
  'use cache';
  return resolveLocalized(aboutPage, locale);
}

export async function getReportsPage(locale: Locale): Promise<ReportsPage> {
  'use cache';
  return resolveLocalized(reportsPage, locale);
}

export async function getMentorshipPage(locale: Locale): Promise<MentorshipPage> {
  'use cache';
  return resolveLocalized(mentorshipPage, locale);
}

export async function getMentorsPage(locale: Locale): Promise<MentorsPage> {
  'use cache';
  return resolveLocalized(mentorsPage, locale);
}

export async function getDonatePage(locale: Locale): Promise<DonatePage> {
  'use cache';
  return resolveLocalized(donatePage, locale);
}

export async function getEventsPage(locale: Locale): Promise<EventsPage> {
  'use cache';
  return resolveLocalized(eventsPage, locale);
}

export async function getContactPage(locale: Locale): Promise<ContactPage> {
  'use cache';
  return resolveLocalized(contactPage, locale);
}

import 'server-only';
import {mentors} from '@/data/mock/mentors';
import {localize, resolveLocalized} from '@/lib/i18n/localize';
import type {Locale} from '@/types/common';
import type {Mentor} from '@/types/mentor';

const otherLocale = (locale: Locale): Locale => (locale === 'en' ? 'ko' : 'en');

export async function getMentors(locale: Locale): Promise<Mentor[]> {
  'use cache';
  return [...mentors]
    .sort((a, b) => a.order - b.order)
    .map((doc) => ({...resolveLocalized(doc, locale), nameAlt: localize(doc.name, otherLocale(locale))}));
}

export async function getFeaturedMentors(locale: Locale, limit = 4): Promise<Mentor[]> {
  'use cache';
  return (await getMentors(locale)).filter((mentor) => mentor.featured).slice(0, limit);
}

import 'server-only';
import {events} from '@/data/mock/events';
import {posts} from '@/data/mock/posts';
import {resolveLocalized} from '@/lib/i18n/localize';
import type {Locale} from '@/types/common';
import type {ContentItem} from '@/types/event';
import {getEvents, toEventItem} from './events';
import {categoryOf} from './helpers/content';
import {getPosts} from './posts';

/** Events (upcoming first, then past) followed by posts (newest first). */
export async function getAllContent(locale: Locale, now?: string): Promise<ContentItem[]> {
  'use cache';
  const [eventItems, postItems] = await Promise.all([getEvents({locale, now}), getPosts({locale})]);
  return [
    ...eventItems.map((event) => ({...event, type: 'event' as const})),
    ...postItems.map((post) => ({...post, type: 'post' as const})),
  ];
}

export async function getContentBySlug(locale: Locale, slug: string, now?: string): Promise<ContentItem | null> {
  'use cache';
  const event = events.find((doc) => doc.slug === slug);
  if (event) return {...toEventItem(event, locale, now ? new Date(now) : new Date()), type: 'event'};
  const post = posts.find((doc) => doc.slug === slug);
  if (post) return {...resolveLocalized(post, locale), type: 'post'};
  return null;
}

export async function getAllContentSlugs(): Promise<string[]> {
  return [...events, ...posts].map((doc) => doc.slug);
}

export async function getLatestHighlights(locale: Locale, limit = 3, now?: string): Promise<ContentItem[]> {
  'use cache';
  const all = await getAllContent(locale, now);
  const upcoming = all.filter((item) => item.type === 'event' && item.status === 'upcoming');
  const latestPosts = all.filter((item) => item.type === 'post');
  return [...upcoming, ...latestPosts].slice(0, limit);
}

export async function getRelated(locale: Locale, slug: string, limit = 3, now?: string): Promise<ContentItem[]> {
  'use cache';
  const item = await getContentBySlug(locale, slug, now);
  if (!item) return [];
  const category = categoryOf(item);
  const all = await getAllContent(locale, now);
  return all.filter((other) => other.slug !== slug && categoryOf(other) === category).slice(0, limit);
}

export async function getFeaturedContent(locale: Locale, now?: string): Promise<ContentItem | null> {
  'use cache';
  const all = await getAllContent(locale, now);
  return all.find((item) => item.featured) ?? all[0] ?? null;
}

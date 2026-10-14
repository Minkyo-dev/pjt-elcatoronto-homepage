import 'server-only';
import {events} from '@/data/mock/events';
import {resolveLocalized} from '@/lib/i18n/localize';
import type {Locale} from '@/types/common';
import type {EventDoc, EventItem, EventKind, EventStatus, TimelineYear} from '@/types/event';
import {buildTimeline, getEventStatus, sortEventItems} from './helpers/events';

export function toEventItem(doc: EventDoc, locale: Locale, now: Date): EventItem {
  return {...resolveLocalized(doc, locale), status: getEventStatus(doc, now)};
}

export async function getEvents(options: {
  locale: Locale;
  status?: EventStatus;
  kind?: EventKind;
  now?: string;
}): Promise<EventItem[]> {
  'use cache';
  const {locale, status, kind, now} = options;
  const current = now ? new Date(now) : new Date();
  const items = events
    .map((doc) => toEventItem(doc, locale, current))
    .filter((event) => (!status || event.status === status) && (!kind || event.kind === kind));
  return sortEventItems(items);
}

export async function getEventTimeline(locale: Locale, now?: string): Promise<TimelineYear[]> {
  'use cache';
  return buildTimeline(await getEvents({locale, now}));
}

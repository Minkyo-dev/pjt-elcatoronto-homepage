import type {EventItem, EventStatus, TimelineYear} from '@/types/event';

/** An event stays "upcoming" until it has ended, so ongoing events still show registration. */
export function getEventStatus(event: {endsAt: string}, now: Date): EventStatus {
  return Date.parse(event.endsAt) >= now.getTime() ? 'upcoming' : 'past';
}

export function compareByStartAsc(a: {startsAt: string}, b: {startsAt: string}): number {
  return Date.parse(a.startsAt) - Date.parse(b.startsAt);
}

export function sortEventItems<T extends {status: EventStatus; startsAt: string}>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    if (a.status !== b.status) return a.status === 'upcoming' ? -1 : 1;
    return a.status === 'upcoming' ? compareByStartAsc(a, b) : compareByStartAsc(b, a);
  });
}

export function buildTimeline(events: EventItem[]): TimelineYear[] {
  const byYear = new Map<number, TimelineYear['items']>();
  for (const event of [...events].sort(compareByStartAsc)) {
    // The ISO string carries Toronto local time, so its first four characters are the local year.
    const year = Number(event.startsAt.slice(0, 4));
    const items = byYear.get(year) ?? [];
    items.push({slug: event.slug, title: event.title, startsAt: event.startsAt, status: event.status, kind: event.kind});
    byYear.set(year, items);
  }
  return [...byYear.entries()].sort(([a], [b]) => a - b).map(([year, items]) => ({year, items}));
}

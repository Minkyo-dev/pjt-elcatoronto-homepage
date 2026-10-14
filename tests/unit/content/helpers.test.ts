import {describe, expect, it} from 'vitest';
import {categoryOf, CONTENT_CATEGORIES, matchesCategory} from '@/lib/content/helpers/content';
import {buildTimeline, getEventStatus, sortEventItems} from '@/lib/content/helpers/events';
import {filterMentors, normalizeSearch} from '@/lib/content/helpers/mentors';
import type {EventItem} from '@/types/event';

const NOW = new Date('2026-10-13T12:00:00-04:00');

describe('getEventStatus', () => {
  it('marks events that ended before now as past', () => {
    expect(getEventStatus({endsAt: '2026-10-12T21:00:00-04:00'}, NOW)).toBe('past');
  });

  it('keeps an event that is happening right now upcoming', () => {
    expect(getEventStatus({endsAt: '2026-10-13T14:00:00-04:00'}, NOW)).toBe('upcoming');
  });

  it('treats an event ending exactly now as upcoming', () => {
    expect(getEventStatus({endsAt: '2026-10-13T12:00:00-04:00'}, NOW)).toBe('upcoming');
  });
});

describe('sortEventItems', () => {
  it('lists upcoming events soonest first, then past events most recent first', () => {
    const items = [
      {slug: 'past-old', status: 'past', startsAt: '2024-01-01T10:00:00-05:00'},
      {slug: 'up-late', status: 'upcoming', startsAt: '2027-03-01T10:00:00-05:00'},
      {slug: 'past-new', status: 'past', startsAt: '2026-05-01T10:00:00-04:00'},
      {slug: 'up-soon', status: 'upcoming', startsAt: '2026-11-01T10:00:00-04:00'},
    ] as const;
    expect(sortEventItems([...items]).map((i) => i.slug)).toEqual(['up-soon', 'up-late', 'past-new', 'past-old']);
  });
});

describe('buildTimeline', () => {
  const event = (slug: string, startsAt: string, status: 'past' | 'upcoming') =>
    ({slug, title: slug, startsAt, status, kind: 'event'}) as EventItem;

  it('groups by local year in ascending order', () => {
    const timeline = buildTimeline([
      event('b', '2027-01-30T13:00:00-05:00', 'upcoming'),
      event('a', '2025-12-31T21:00:00-05:00', 'past'),
      event('c', '2025-04-12T10:00:00-04:00', 'past'),
    ]);
    expect(timeline.map((y) => y.year)).toEqual([2025, 2027]);
    expect(timeline[0].items.map((i) => i.slug)).toEqual(['c', 'a']);
  });
});

describe('mentor search', () => {
  const mentors = [
    {name: 'Jiwon Kim', nameAlt: '김지원'},
    {name: 'Daniel Park', nameAlt: '박다니엘'},
  ];

  it('normalizes case and whitespace', () => {
    expect(normalizeSearch('  JIWON   Kim ')).toBe('jiwon kim');
  });

  it('returns everyone for an empty or blank query', () => {
    expect(filterMentors(mentors, '')).toHaveLength(2);
    expect(filterMentors(mentors, '   ')).toHaveLength(2);
  });

  it('matches case-insensitively in either language', () => {
    expect(filterMentors(mentors, 'kim')).toEqual([mentors[0]]);
    expect(filterMentors(mentors, '박다')).toEqual([mentors[1]]);
  });

  it('ignores spaces inside Korean names', () => {
    expect(filterMentors(mentors, '김 지원')).toEqual([mentors[0]]);
  });

  it('returns nothing when no name matches', () => {
    expect(filterMentors(mentors, 'zzz')).toEqual([]);
  });
});

describe('content categories', () => {
  it('maps event and post kinds to categories', () => {
    expect(categoryOf({type: 'event', kind: 'workshop'})).toBe('workshops');
    expect(categoryOf({type: 'event', kind: 'event'})).toBe('events');
    expect(categoryOf({type: 'post', kind: 'story'})).toBe('stories');
    expect(categoryOf({type: 'post', kind: 'news'})).toBe('news');
  });

  it('matches everything for "all"', () => {
    expect(matchesCategory({type: 'post', kind: 'news'}, 'all')).toBe(true);
    expect(matchesCategory({type: 'post', kind: 'news'}, 'stories')).toBe(false);
  });

  it('lists the four categories in tab order', () => {
    expect(CONTENT_CATEGORIES).toEqual(['workshops', 'events', 'stories', 'news']);
  });
});

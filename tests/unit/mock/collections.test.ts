import {describe, expect, it} from 'vitest';
import {coreValues} from '@/data/mock/core-values';
import {donationTiers} from '@/data/mock/donation-tiers';
import {events} from '@/data/mock/events';
import {faqs} from '@/data/mock/faq';
import {mentors} from '@/data/mock/mentors';
import {posts} from '@/data/mock/posts';
import {reports} from '@/data/mock/reports';
import {sponsors} from '@/data/mock/sponsors';
import {stats} from '@/data/mock/stats';
import {team} from '@/data/mock/team';
import {testimonials} from '@/data/mock/testimonials';
import {history} from '@/data/mock/timeline';
import {getEventStatus} from '@/lib/content/helpers/events';
import {findImages, findLocalized, isBlank} from './walk';

const collections = {coreValues, donationTiers, events, faqs, mentors, posts, reports, sponsors, stats, team, testimonials, history};
const allDocs = Object.values(collections).flat();
const NOW = new Date('2026-10-13T12:00:00-04:00');

describe('mock collections', () => {
  it('use unique _id values', () => {
    const ids = allDocs.map((doc) => doc._id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('use unique kebab-case slugs across events and posts (they share /events-news/[slug])', () => {
    const slugs = [...events, ...posts].map((doc) => doc.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it('have localized alt text and fixed dimensions for every image', () => {
    const images = findImages(collections);
    expect(images.length).toBeGreaterThan(20);
    for (const {path, value} of images) {
      expect(value.url, path).toMatch(/^https:\/\/images\.unsplash\.com\//);
      expect(value.width, path).toBeGreaterThan(0);
      expect(value.height, path).toBeGreaterThan(0);
      expect(isBlank(value.alt.en), path).toBe(false);
      expect(isBlank(value.alt.ko), path).toBe(false);
    }
  });

  it('never ship a blank translation', () => {
    for (const {path, value} of findLocalized(collections)) {
      expect(isBlank(value.en), `${path}.en`).toBe(false);
      if ('ko' in value) expect(isBlank(value.ko), `${path}.ko`).toBe(false);
    }
  });

  it('flag every person, sponsor, report, tier, and testimonial as sample', () => {
    for (const doc of [...mentors, ...team, ...sponsors, ...reports, ...donationTiers, ...testimonials, ...events, ...posts]) {
      expect(doc.isSample, doc._id).toBe(true);
    }
  });

  it('flag every stat as either sample or needs-review', () => {
    for (const stat of stats) expect(Boolean(stat.isSample || stat.needsReview), stat._id).toBe(true);
  });
});

describe('mentors', () => {
  it('has 18 mentors with 4 featured and unique order', () => {
    expect(mentors).toHaveLength(18);
    expect(mentors.filter((m) => m.featured)).toHaveLength(4);
    expect(new Set(mentors.map((m) => m.order)).size).toBe(18);
  });

  it('includes a very long company name to exercise wrapping at 375px', () => {
    expect(mentors.some((m) => m.company.en.length > 60)).toBe(true);
  });
});

describe('events and posts', () => {
  it('has 4 upcoming and 6 past events relative to 2026-10-13', () => {
    const statuses = events.map((e) => getEventStatus(e, NOW));
    expect(statuses.filter((s) => s === 'upcoming')).toHaveLength(4);
    expect(statuses.filter((s) => s === 'past')).toHaveLength(6);
  });

  it('has 4 workshops and 6 events', () => {
    expect(events.filter((e) => e.kind === 'workshop')).toHaveLength(4);
    expect(events.filter((e) => e.kind === 'event')).toHaveLength(6);
  });

  it('uses ISO timestamps with offsets and ends after it starts', () => {
    for (const e of events) {
      expect(e.startsAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
      expect(Date.parse(e.endsAt)).toBeGreaterThan(Date.parse(e.startsAt));
    }
  });

  it('gives every past event a gallery and exactly one featured event', () => {
    for (const e of events.filter((ev) => getEventStatus(ev, NOW) === 'past')) {
      expect(e.gallery?.length, e.slug).toBeGreaterThanOrEqual(3);
    }
    expect(events.filter((e) => e.featured)).toHaveLength(1);
  });

  it('has 4 stories and 4 news posts', () => {
    expect(posts.filter((p) => p.kind === 'story')).toHaveLength(4);
    expect(posts.filter((p) => p.kind === 'news')).toHaveLength(4);
  });
});

describe('other collections', () => {
  it('has at least 4 FAQs per group', () => {
    for (const group of ['home', 'about', 'mentorship', 'donate', 'events', 'contact'] as const) {
      expect(faqs.filter((f) => f.group === group).length, group).toBeGreaterThanOrEqual(4);
    }
  });

  it('has the expected counts', () => {
    expect(team).toHaveLength(6);
    expect(sponsors).toHaveLength(6);
    expect(reports).toHaveLength(4);
    expect(testimonials).toHaveLength(8);
    expect(coreValues).toHaveLength(4);
    expect(donationTiers.map((t) => t.amount)).toEqual([25, 50, 100, 250]);
    expect(stats.filter((s) => s.group === 'home')).toHaveLength(4);
    expect(stats.filter((s) => s.group === 'about')).toHaveLength(4);
  });
});

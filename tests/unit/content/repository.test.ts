import {describe, expect, it} from 'vitest';
import {
  getAllContentSlugs,
  getContentBySlug,
  getFeaturedContent,
  getLatestHighlights,
  getRelated,
} from '@/lib/content/content';
import {getEventTimeline, getEvents} from '@/lib/content/events';
import {getFaqs} from '@/lib/content/faq';
import {getFeaturedMentors, getMentors} from '@/lib/content/mentors';
import {getHomePage} from '@/lib/content/pages';
import {getPosts} from '@/lib/content/posts';
import {getReports} from '@/lib/content/reports';
import {getSiteSettings} from '@/lib/content/site';
import {getStats} from '@/lib/content/stats';
import {getTestimonials} from '@/lib/content/testimonials';

const NOW = '2026-10-13T12:00:00-04:00';

describe('mentors', () => {
  it('returns all mentors in order with names in the requested locale', async () => {
    const mentors = await getMentors('ko');
    expect(mentors).toHaveLength(18);
    expect(mentors[0]).toMatchObject({slug: 'jiwon-kim', name: '김지원', nameAlt: 'Jiwon Kim'});
  });

  it('returns the four featured mentors', async () => {
    const featured = await getFeaturedMentors('en');
    expect(featured.map((m) => m.slug)).toEqual(['jiwon-kim', 'daniel-park', 'sora-lee', 'minho-choi']);
  });
});

describe('events', () => {
  it('splits upcoming and past relative to now', async () => {
    const upcoming = await getEvents({locale: 'en', status: 'upcoming', now: NOW});
    const past = await getEvents({locale: 'en', status: 'past', now: NOW});
    expect(upcoming.map((e) => e.slug)).toEqual([
      'winter-networking-night-2026',
      'resume-linkedin-workshop-2026',
      'cohort-14-kickoff-2027',
      'startup-pitch-workshop-2027',
    ]);
    expect(past[0].slug).toBe('cohort-12-graduation-2026');
    expect(past).toHaveLength(6);
  });

  it('filters by kind', async () => {
    const workshops = await getEvents({locale: 'en', kind: 'workshop', now: NOW});
    expect(workshops).toHaveLength(4);
    expect(workshops.every((e) => e.kind === 'workshop')).toBe(true);
  });

  it('builds a timeline from 2024 to 2027', async () => {
    const timeline = await getEventTimeline('en', NOW);
    expect(timeline.map((y) => y.year)).toEqual([2024, 2025, 2026, 2027]);
  });
});

describe('content', () => {
  it('finds events and posts by slug', async () => {
    expect(await getContentBySlug('ko', 'winter-networking-night-2026', NOW)).toMatchObject({
      type: 'event',
      status: 'upcoming',
      title: '윈터 네트워킹 나이트',
    });
    expect(await getContentBySlug('en', 'from-mentee-to-mentor', NOW)).toMatchObject({type: 'post', kind: 'story'});
    expect(await getContentBySlug('en', 'missing', NOW)).toBeNull();
  });

  it('lists 18 unique slugs', async () => {
    const slugs = await getAllContentSlugs();
    expect(slugs).toHaveLength(18);
    expect(new Set(slugs).size).toBe(18);
  });

  it('highlights upcoming events first', async () => {
    const items = await getLatestHighlights('en', 3, NOW);
    expect(items.map((i) => i.slug)).toEqual([
      'winter-networking-night-2026',
      'resume-linkedin-workshop-2026',
      'cohort-14-kickoff-2027',
    ]);
  });

  it('relates items from the same category, excluding the item itself', async () => {
    const related = await getRelated('en', 'winter-networking-night-2026', 3, NOW);
    expect(related).toHaveLength(3);
    expect(related.every((i) => i.type === 'event' && i.kind === 'event')).toBe(true);
    expect(related.map((i) => i.slug)).not.toContain('winter-networking-night-2026');
  });

  it('returns the featured event', async () => {
    expect((await getFeaturedContent('en', NOW))?.slug).toBe('winter-networking-night-2026');
  });

  it('sorts posts newest first', async () => {
    const posts = await getPosts({locale: 'en'});
    expect(posts[0].slug).toBe('new-website-preview');
    expect(await getPosts({locale: 'en', kind: 'story'})).toHaveLength(4);
  });
});

describe('pages and settings', () => {
  it('swaps the event slide to the event cover and detail link', async () => {
    const home = await getHomePage('ko');
    const slide = home.heroSlides.find((s) => s.kind === 'event')!;
    expect(slide.media.image.url).toContain('1515169067868-5387ec356754');
    expect(slide.media.image.alt).toBe('저녁 네트워킹 행사에서 음료를 들고 대화하는 사람들');
    expect(slide.ctas[0].href).toBe('/events-news/winter-networking-night-2026');
  });

  it('adds the current year to site settings', async () => {
    const settings = await getSiteSettings('ko');
    expect(settings.currentYear).toBeGreaterThanOrEqual(2026);
    expect(settings.description).toBe('멘토십과 리더십, 그리고 커뮤니티로 사람을 잇습니다.');
  });
});

describe('small collections', () => {
  it('returns FAQs for a group in order', async () => {
    const faqs = await getFaqs('en', 'mentorship');
    expect(faqs).toHaveLength(6);
    expect(faqs.map((f) => f.order)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('filters testimonials by author type', async () => {
    expect(await getTestimonials('en', {authorType: 'mentee'})).toHaveLength(5);
    expect(await getTestimonials('en')).toHaveLength(8);
  });

  it('returns stats by group and reports newest first', async () => {
    expect(await getStats('en', 'home')).toHaveLength(4);
    expect((await getReports('en'))[0].year).toBe(2025);
  });
});

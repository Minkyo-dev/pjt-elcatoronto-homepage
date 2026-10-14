import {describe, expect, it} from 'vitest';
import {events} from '@/data/mock/events';
import {aboutPage} from '@/data/mock/pages/about';
import {contactPage} from '@/data/mock/pages/contact';
import {donatePage} from '@/data/mock/pages/donate';
import {eventsPage} from '@/data/mock/pages/events';
import {homePage} from '@/data/mock/pages/home';
import {mentorshipPage} from '@/data/mock/pages/mentorship';
import {mentorsPage} from '@/data/mock/pages/mentors';
import {reportsPage} from '@/data/mock/pages/reports';
import {posts} from '@/data/mock/posts';
import {siteSettings} from '@/data/mock/site-settings';
import {isKnownInternalHref} from '@/lib/i18n/paths';
import {findImages, findLocalized, isBlank, walk} from './walk';

const singletons = {siteSettings, homePage, aboutPage, reportsPage, mentorshipPage, mentorsPage, donatePage, eventsPage, contactPage};
const slugs = [...events, ...posts].map((d) => d.slug);

describe('page singletons', () => {
  it('never ship a blank translation', () => {
    for (const {path, value} of findLocalized(singletons)) {
      expect(isBlank(value.en), `${path}.en`).toBe(false);
      if ('ko' in value) expect(isBlank(value.ko), `${path}.ko`).toBe(false);
    }
  });

  it('give every image Korean and English alt text', () => {
    for (const {path, value} of findImages(singletons)) {
      expect(isBlank(value.alt.en), path).toBe(false);
      expect(isBlank(value.alt.ko), path).toBe(false);
    }
  });

  it('only link CTAs to routes and anchors that exist', () => {
    walk(singletons, (value, path) => {
      if (value && typeof value === 'object' && 'href' in value && 'label' in value) {
        const href = (value as {href: string}).href;
        if (href.startsWith('http')) return;
        expect(isKnownInternalHref(href, slugs), `${path}: ${href}`).toBe(true);
      }
    });
  });

  it('has three hero slides with exactly one event slide pointing at a real event', () => {
    expect(homePage.heroSlides).toHaveLength(3);
    const eventSlides = homePage.heroSlides.filter((s) => s.kind === 'event');
    expect(eventSlides).toHaveLength(1);
    expect(slugs).toContain(eventSlides[0].eventSlug);
  });

  it('fund usage adds up to 100%', () => {
    expect(donatePage.fundUsage.items.reduce((sum, i) => sum + i.percent, 0)).toBe(100);
  });
});

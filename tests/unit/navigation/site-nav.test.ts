import {describe, expect, it} from 'vitest';
import {isCurrent, isNavGroup, isWithin, PRIMARY_NAV, resolveNav} from '@/lib/navigation/site-nav';

describe('site navigation', () => {
  it('has the five top-level items from the spec, with two dropdowns', () => {
    const items = resolveNav(PRIMARY_NAV, (key) => key.toUpperCase());
    expect(items.map((item) => item.label)).toEqual(['HOME', 'ABOUT', 'GETINVOLVED', 'EVENTSNEWS', 'CONTACT']);
    const groups = items.filter(isNavGroup);
    expect(groups.map((g) => g.children.map((c) => c.href))).toEqual([
      ['/about', '/about/reports'],
      ['/get-involved/mentorship', '/get-involved/mentors', '/get-involved/donate'],
    ]);
  });

  it('marks only the exact path as current', () => {
    expect(isCurrent('/about', '/about')).toBe(true);
    expect(isCurrent('/about/reports', '/about')).toBe(false);
    expect(isCurrent('/contact', '/contact?topic=mentor')).toBe(true);
  });

  it('treats nested paths as within a section, but home only matches itself', () => {
    expect(isWithin('/events-news/winter-networking-night-2026', '/events-news')).toBe(true);
    expect(isWithin('/about', '/')).toBe(false);
    expect(isWithin('/', '/')).toBe(true);
    expect(isWithin('/aboutx', '/about')).toBe(false);
  });
});

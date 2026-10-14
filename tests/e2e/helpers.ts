import AxeBuilder from '@axe-core/playwright';
import {expect, type Page} from './fixtures';

export const LOCALES = ['en', 'ko'] as const;

/** Every route, including one upcoming event, one past event, and one post. */
export const ROUTES = [
  '/',
  '/about',
  '/about/reports',
  '/get-involved/mentorship',
  '/get-involved/mentors',
  '/get-involved/donate',
  '/events-news',
  '/events-news/winter-networking-night-2026',
  '/events-news/annual-mentorship-conference-2024',
  '/events-news/from-mentee-to-mentor',
  '/contact',
] as const;

export function localized(locale: string, route: string): string {
  return `/${locale}${route === '/' ? '' : route}`;
}

export async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const {scrollWidth, clientWidth} = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth, `page is ${scrollWidth - clientWidth}px wider than the viewport`).toBeLessThanOrEqual(clientWidth);
}

export async function expectNoSeriousA11yViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  expect(
    serious.map((v) => ({id: v.id, help: v.help, targets: v.nodes.map((n) => n.target.join(' '))})),
    'serious/critical axe violations',
  ).toEqual([]);
}

/** Heading levels in document order, skipping display:none content (closed dialogs, hidden slides). */
export async function visibleHeadingLevels(page: Page): Promise<number[]> {
  return page
    .locator('h1, h2, h3, h4, h5, h6')
    .evaluateAll((elements) =>
      elements.filter((el) => (el as HTMLElement).checkVisibility()).map((el) => Number(el.tagName.slice(1))),
    );
}

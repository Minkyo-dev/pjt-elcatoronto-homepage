import {expect, test} from './fixtures';

test('robots.txt blocks the studio and UI lab and points to the sitemap', async ({request}) => {
  const body = await (await request.get('/robots.txt')).text();
  expect(body).toContain('Disallow: /studio');
  expect(body).toContain('Disallow: /en/ui-lab');
  expect(body).toContain('Disallow: /ko/ui-lab');
  expect(body).toMatch(/Sitemap: .+\/sitemap\.xml/);
});

test('sitemap lists every page in both locales with alternates', async ({request}) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  expect(urls).toHaveLength((8 + 18) * 2);
  expect(urls.some((url) => url.endsWith('/ko/events-news/winter-networking-night-2026'))).toBe(true);
  expect(urls.some((url) => url.endsWith('/en'))).toBe(true);
  expect(xml).toContain('hreflang="ko"');
});

test('pages declare canonical and alternate-language links', async ({page}) => {
  await page.goto('/en/about');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/en\/about$/);
  await expect(page.locator('link[rel="alternate"][hreflang="ko"]')).toHaveAttribute('href', /\/ko\/about$/);
  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', /\/en\/about$/);
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'en_CA');
});

test('the UI Lab is not indexable', async ({page}) => {
  await page.goto('/en/ui-lab');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});

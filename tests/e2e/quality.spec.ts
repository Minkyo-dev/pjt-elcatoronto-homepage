import {expect, test} from './fixtures';
import {
  expectNoHorizontalOverflow,
  expectNoSeriousA11yViolations,
  LOCALES,
  localized,
  ROUTES,
  visibleHeadingLevels,
} from './helpers';

for (const locale of LOCALES) {
  for (const route of ROUTES) {
    const url = localized(locale, route);

    test(`${url} — status, language, headings, accessibility, overflow`, async ({page}, testInfo) => {
      const response = await page.goto(url);
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('main#main')).toHaveCount(1);
      await expect(page.locator('h1')).toHaveCount(1);

      const levels = await visibleHeadingLevels(page);
      expect(levels[0]).toBe(1);
      levels.forEach((level, index) => {
        if (index > 0) expect(level, `heading level jumps at index ${index}: ${levels.join(',')}`).toBeLessThanOrEqual(levels[index - 1] + 1);
      });

      await expectNoSeriousA11yViolations(page);
      await expectNoHorizontalOverflow(page);

      if (testInfo.project.name === 'desktop') {
        await page.setViewportSize({width: 768, height: 1024});
        await expectNoHorizontalOverflow(page);
      }
    });
  }
}

test('images reserve their space (no layout shift from images)', async ({page}) => {
  await page.goto('/en/events-news');
  const unsized = await page.locator('main img').evaluateAll((images) =>
    images
      .filter((img) => {
        const style = getComputedStyle(img);
        const filled = style.position === 'absolute' && img.parentElement && getComputedStyle(img.parentElement).position !== 'static';
        return !filled && !(img.getAttribute('width') && img.getAttribute('height'));
      })
      .map((img) => img.getAttribute('src')),
  );
  expect(unsized).toEqual([]);
});

test('demo forms never send network requests', async ({page}) => {
  await page.goto('/en/contact');
  const writes: string[] = [];
  page.on('request', (request) => {
    if (request.method() !== 'GET') writes.push(`${request.method()} ${request.url()}`);
  });
  const form = page.locator('#contact-form');
  await form.getByLabel(/^Full name/).fill('Jiwon Kim');
  await form.getByLabel(/^Email/).fill('jiwon@example.com');
  await form.getByLabel(/^Topic/).selectOption('general');
  await form.getByLabel(/^Message/).fill('Hello!');
  await form.getByRole('button', {name: 'Send Message (Demo)'}).click();
  await expect(form.getByText(/^Demo/)).toBeVisible();

  await page.locator('footer').getByLabel(/Email address/).fill('reader@example.com');
  await page.locator('footer').getByRole('button', {name: 'Subscribe'}).click();
  await expect(page.getByText('This is a demo. No subscription was created.')).toBeVisible();

  expect(writes).toEqual([]);
});

test('reduced motion disables transitions', async ({page}) => {
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.goto('/en');
  const duration = await page
    .getByRole('link', {name: 'Donate'})
    .first()
    .evaluate((el) => getComputedStyle(el).transitionDuration);
  expect(parseFloat(duration)).toBeLessThan(0.01);
});

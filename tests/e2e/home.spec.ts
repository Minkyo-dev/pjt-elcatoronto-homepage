import {expect, test} from '@playwright/test';

test.describe('home — hero carousel', () => {
  test('has one h1 and shows the first slide', async ({page}) => {
    await page.goto('/en');
    await expect(page.locator('h1')).toHaveCount(1);
    const carousel = page.locator('[aria-roledescription="carousel"]');
    await expect(carousel.getByRole('heading', {name: 'Grow your path with mentors who have walked it'})).toBeVisible();
    await expect(carousel.getByRole('heading', {name: 'Share what you know. Shape who comes next.'})).toBeHidden();
    await expect(carousel.getByRole('link', {name: 'Explore Mentorship'})).toHaveAttribute('href', '/en/get-involved/mentorship');
  });

  test('previous, next, and dot controls change slides', async ({page}) => {
    await page.goto('/en');
    const carousel = page.locator('[aria-roledescription="carousel"]');
    await carousel.getByRole('button', {name: 'Pause slideshow'}).click();
    await carousel.getByRole('button', {name: 'Previous slide'}).click();
    await expect(carousel.getByRole('link', {name: 'View event details'})).toBeVisible(); // wrapped to last slide
    await carousel.getByRole('button', {name: 'Next slide'}).click();
    await expect(carousel.getByRole('heading', {name: 'Grow your path with mentors who have walked it'})).toBeVisible();
    await carousel.getByRole('button', {name: 'Next slide'}).click();
    await expect(carousel.getByRole('heading', {name: 'Share what you know. Shape who comes next.'})).toBeVisible();
    await expect(carousel.getByRole('link', {name: 'Become a Mentor'})).toHaveAttribute('href', '/en/get-involved/mentors#become-a-mentor');
    await carousel.getByRole('button', {name: 'Go to slide 3'}).click();
    await expect(carousel.getByRole('link', {name: 'View event details'})).toHaveAttribute(
      'href',
      '/en/events-news/winter-networking-night-2026',
    );
    await carousel.getByRole('button', {name: 'Next slide'}).click();
    await expect(carousel.getByRole('heading', {name: 'Grow your path with mentors who have walked it'})).toBeVisible();
  });

  test('autoplays every 7 seconds and the pause button stops it', async ({page}) => {
    await page.clock.install();
    await page.goto('/en');
    const carousel = page.locator('[aria-roledescription="carousel"]');
    const slide2 = carousel.getByRole('heading', {name: 'Share what you know. Shape who comes next.'});
    await expect(carousel).toHaveAttribute('data-autoplay', 'true'); // hydrated, timer armed
    await expect(carousel.locator('[aria-live]')).toHaveAttribute('aria-live', 'off');
    await page.clock.fastForward(7500);
    await expect(slide2).toBeVisible();
    await carousel.getByRole('button', {name: 'Pause slideshow'}).click();
    await expect(carousel.getByRole('button', {name: 'Play slideshow'})).toBeVisible();
    await expect(carousel.locator('[aria-live]')).toHaveAttribute('aria-live', 'polite');
    // move focus and pointer out so only the explicit pause can be holding autoplay off
    await page.locator('body').click({position: {x: 5, y: 5}});
    await page.mouse.move(0, 0);
    await expect(carousel).toHaveAttribute('data-autoplay', 'false');
    await page.clock.fastForward(15000);
    await expect(slide2).toBeVisible();
  });

  test('pauses on hover and resumes when the pointer leaves', async ({page}) => {
    await page.clock.install();
    await page.goto('/en');
    const carousel = page.locator('[aria-roledescription="carousel"]');
    await expect(carousel).toHaveAttribute('data-autoplay', 'true');
    await carousel.hover();
    await expect(carousel).toHaveAttribute('data-autoplay', 'false');
    await page.mouse.move(0, 0);
    await expect(carousel).toHaveAttribute('data-autoplay', 'true');
  });

  test('never autoplays with reduced motion', async ({page}) => {
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.clock.install();
    await page.goto('/en');
    const carousel = page.locator('[aria-roledescription="carousel"]');
    const slide2 = carousel.getByRole('heading', {name: 'Share what you know. Shape who comes next.'});
    await carousel.getByRole('button', {name: 'Next slide'}).click(); // only works once hydrated
    await expect(slide2).toBeVisible();
    await page.locator('body').click({position: {x: 5, y: 5}});
    await page.mouse.move(0, 0);
    await expect(carousel).toHaveAttribute('data-autoplay', 'false');
    await page.clock.fastForward(15000);
    await expect(slide2).toBeVisible();
  });
});

test.describe('home — sponsors, purpose, impact, mentorship preview', () => {
  test('renders sample sponsors and flagged impact stats', async ({page}) => {
    await page.goto('/en');
    const sponsors = page.getByRole('region', {name: 'Supported by'});
    await expect(sponsors.getByRole('listitem')).toHaveCount(6);
    await expect(sponsors.getByText('Sample', {exact: true})).toBeVisible();

    const impact = page.getByRole('region', {name: 'Cohort by cohort, our community keeps growing'});
    await expect(impact.locator('dd').filter({hasText: '~200'})).toBeVisible();
    await expect(impact.getByText('Needs review', {exact: true}).first()).toBeVisible();
  });

  test('links purpose and mentorship preview to the right pages', async ({page}) => {
    await page.goto('/en');
    await expect(page.getByRole('link', {name: 'Learn about ELCA'})).toHaveAttribute('href', '/en/about');
    const preview = page.getByRole('region', {name: 'A six-month journey, one conversation at a time'});
    await expect(preview.getByRole('heading', {level: 3})).toHaveCount(3);
    await expect(preview.getByRole('link', {name: 'Explore Mentorship'})).toHaveAttribute('href', '/en/get-involved/mentorship');
  });

  test('renders in Korean', async ({page}) => {
    await page.goto('/ko');
    await expect(page.getByRole('heading', {name: '먼저 걸어 본 멘토와 함께 나의 길을 찾아가세요'})).toBeVisible();
    await expect(page.getByRole('region', {name: '함께하는 후원사'})).toBeVisible();
  });
});

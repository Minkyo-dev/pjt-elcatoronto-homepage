import {expect, test} from './fixtures';

test.describe('event detail — upcoming', () => {
  test('shows details, agenda, and a demo registration form', async ({page}) => {
    await page.goto('/en/events-news/winter-networking-night-2026');
    await expect(page).toHaveTitle('Winter Networking Night | ELCA Toronto');
    await expect(page.getByRole('heading', {level: 1, name: 'Winter Networking Night'})).toBeVisible();
    await expect(page.getByRole('navigation', {name: 'Breadcrumb'}).getByRole('link', {name: 'Events & News'})).toHaveAttribute(
      'href',
      '/en/events-news',
    );
    await expect(page.getByText('Friday, November 20, 2026')).toBeVisible();
    await expect(page.getByText('80 people')).toBeVisible();
    await expect(page.getByRole('region', {name: 'Agenda'}).getByRole('listitem')).toHaveCount(4);

    const register = page.getByRole('region', {name: 'Register for this event'});
    await register.getByRole('button', {name: 'Register (Demo)'}).click();
    await expect(register.getByText('This field is required.')).toHaveCount(2);
    await register.getByLabel(/^Full name/).fill('Seoyeon');
    await register.getByLabel(/^Email/).fill('seoyeon@example.com');
    await register.getByRole('button', {name: 'Register (Demo)'}).click();
    await expect(register.getByText('Demo — nothing was sent. Your input passed validation.')).toBeVisible();
  });

  test('lists related events', async ({page}) => {
    await page.goto('/en/events-news/winter-networking-night-2026');
    await expect(page.getByRole('region', {name: 'Related'}).getByRole('article')).toHaveCount(3);
  });

  test('is localized', async ({page}) => {
    await page.goto('/ko/events-news/winter-networking-night-2026');
    await expect(page.getByRole('heading', {level: 1, name: '윈터 네트워킹 나이트'})).toBeVisible();
    await expect(page.getByText('80명')).toBeVisible();
  });
});

test.describe('event detail — past', () => {
  test('replaces registration with a recap gallery', async ({page}) => {
    await page.goto('/en/events-news/annual-mentorship-conference-2024');
    await expect(page.getByRole('region', {name: 'Register for this event'})).toHaveCount(0);
    const recap = page.getByRole('region', {name: 'Event recap'});
    await expect(recap.getByRole('button', {name: /^Open photo/})).toHaveCount(3);
    await recap.getByRole('button', {name: /^Open photo/}).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
  });
});

test.describe('post detail', () => {
  test('renders a story with author, body, and breadcrumb', async ({page}) => {
    await page.goto('/en/events-news/from-mentee-to-mentor');
    await expect(page.getByRole('heading', {level: 1, name: 'From Mentee to Mentor: Jiwon’s Story'})).toBeVisible();
    await expect(page.getByText('By ELCA Communications').first()).toBeVisible();
    await expect(page.getByRole('heading', {level: 2, name: 'Coming back'})).toBeVisible();
    await expect(page.getByRole('region', {name: 'Related'}).getByRole('article')).toHaveCount(3);
  });
});

test('unknown slugs return 404', async ({page}) => {
  const response = await page.goto('/en/events-news/does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', {level: 1, name: 'Page not found'})).toBeVisible();
});

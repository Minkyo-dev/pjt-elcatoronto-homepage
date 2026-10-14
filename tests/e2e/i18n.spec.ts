import {expect, test} from '@playwright/test';

test('the root URL redirects to the default locale', async ({page}) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('paths without a locale receive the default prefix', async ({page}) => {
  await page.goto('/contact');
  await expect(page).toHaveURL(/\/en\/contact$/);
});

test.describe('Korean browser', () => {
  test.use({locale: 'ko-KR'});

  test('the root URL redirects to /ko', async ({page}) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/ko$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
  });
});

test('unknown paths render a localized 404 with status 404', async ({page}) => {
  const en = await page.goto('/en/this-page-does-not-exist');
  expect(en?.status()).toBe(404);
  await expect(page.getByRole('heading', {level: 1, name: 'Page not found'})).toBeVisible();

  const ko = await page.goto('/ko/no/such/page');
  expect(ko?.status()).toBe(404);
  await expect(page.getByRole('heading', {level: 1, name: '페이지를 찾을 수 없습니다'})).toBeVisible();
});

test('pages get the default localized title', async ({page}) => {
  await page.goto('/ko/no/such/page');
  await expect(page).toHaveTitle('ELCA 토론토 — 멘토십 · 리더십 · 커뮤니티');
});

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

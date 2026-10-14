import {expect, test} from './fixtures';

const contact = (page: import('./fixtures').Page) => page.getByRole('link', {name: 'Open the contact page'});
const top = (page: import('./fixtures').Page) => page.getByRole('button', {name: 'Back to top'});

test('back-to-top appears after 600px and scrolls to the top', async ({page}) => {
  await page.goto('/en/ui-lab');
  await expect(contact(page)).toBeVisible();
  await expect(top(page)).toBeHidden();

  await page.evaluate(() => window.scrollTo(0, 700));
  await expect(top(page)).toBeVisible();
  await top(page).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.locator('main#main')).toBeFocused();
});

test('floating buttons hide while a dialog is open', async ({page}) => {
  await page.goto('/en/ui-lab');
  await page.getByRole('button', {name: 'Open dialog'}).click();
  await expect(contact(page)).toBeHidden();
  await page.keyboard.press('Escape');
  await expect(contact(page)).toBeVisible();
});

test('floating buttons come back after navigating away from an open drawer', async ({page}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'drawer is mobile-only');
  await page.goto('/en/ui-lab');
  await page.getByRole('button', {name: 'Open menu'}).click();
  await expect(contact(page)).toBeHidden();
  await page.getByRole('dialog', {name: 'Menu'}).getByRole('link', {name: 'Home'}).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(contact(page)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('');
});

test('browser Back with an open dialog releases the overlay and scroll lock', async ({page}) => {
  await page.goto('/en');
  await page.goto('/en/ui-lab');
  await page.getByRole('button', {name: 'Open dialog'}).click();
  await page.goBack();
  await expect(page).toHaveURL(/\/en$/);
  await expect(contact(page)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('');
});

test('the contact button is not shown on the contact page', async ({page}) => {
  await page.goto('/en/contact');
  await expect(contact(page)).toBeHidden();
});

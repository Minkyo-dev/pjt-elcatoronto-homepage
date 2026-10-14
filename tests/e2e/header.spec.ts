import {expect, test} from '@playwright/test';

test.describe('header — desktop', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'desktop navigation');
  });

  test('skip link moves focus to the main content', async ({page}) => {
    await page.goto('/en/ui-lab');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', {name: 'Skip to content'});
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('main#main')).toBeFocused();
  });

  test('Get Involved dropdown works with mouse and keyboard', async ({page}) => {
    await page.goto('/en/ui-lab');
    const nav = page.getByRole('navigation', {name: 'Main'});
    const trigger = nav.getByRole('button', {name: 'Get Involved'});
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(nav.getByRole('link', {name: 'Mentors', exact: true})).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(nav.getByRole('link', {name: 'Mentorship'})).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(nav.getByRole('link', {name: 'Mentors', exact: true})).toBeFocused();

    await page.mouse.click(10, 600);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('current page is marked inside its dropdown', async ({page}) => {
    await page.goto('/en/ui-lab');
    const nav = page.getByRole('navigation', {name: 'Main'});
    await nav.getByRole('button', {name: 'Get Involved'}).click();
    await nav.getByRole('link', {name: 'Donate'}).click();
    await expect(page).toHaveURL(/\/en\/get-involved\/donate$/);
    await nav.getByRole('button', {name: 'Get Involved'}).click();
    await expect(nav.getByRole('link', {name: 'Donate'})).toHaveAttribute('aria-current', 'page');
  });

  test('language switcher keeps the path and query', async ({page}) => {
    await page.goto('/en/ui-lab?tab=second');
    await page.getByRole('group', {name: 'Language'}).getByRole('link', {name: /KO/}).click();
    await expect(page).toHaveURL(/\/ko\/ui-lab\?tab=second$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
  });
});

test.describe('header — mobile', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'mobile navigation');
  });

  test('menu drawer opens, traps focus, and closes with Escape', async ({page}) => {
    await page.goto('/en/ui-lab');
    await expect(page.getByRole('navigation', {name: 'Main'})).toBeHidden();
    const open = page.getByRole('button', {name: 'Open menu'});
    await open.click();
    const drawer = page.getByRole('dialog', {name: 'Menu'});
    await expect(drawer).toBeVisible();
    for (let i = 0; i < 15; i++) await page.keyboard.press('Tab');
    expect(await drawer.evaluate((el) => el.contains(document.activeElement))).toBe(true);
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await expect(open).toBeFocused();
  });

  test('tapping a link inside a section navigates and closes the drawer', async ({page}) => {
    await page.goto('/en/ui-lab');
    await page.getByRole('button', {name: 'Open menu'}).click();
    const drawer = page.getByRole('dialog', {name: 'Menu'});
    await drawer.getByText('Get Involved').click();
    await drawer.getByRole('link', {name: 'Mentors', exact: true}).click();
    await expect(page).toHaveURL(/\/en\/get-involved\/mentors$/);
    await expect(drawer).toBeHidden();
  });
});

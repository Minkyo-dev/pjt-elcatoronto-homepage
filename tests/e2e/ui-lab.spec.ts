import {expect, test} from '@playwright/test';

test.describe('UI Lab — static primitives', () => {
  test('renders buttons with the right link behaviour', async ({page}) => {
    await page.goto('/en/ui-lab');
    await expect(page.getByRole('heading', {level: 1, name: 'UI Lab'})).toBeVisible();
    await expect(page.getByRole('link', {name: 'Internal link'})).toHaveAttribute('href', '/en/about');
    await expect(page.getByRole('link', {name: 'Anchor link'})).toHaveAttribute('href', '#buttons');
    const external = page.getByRole('link', {name: 'External link'});
    await expect(external).toHaveAttribute('target', '_blank');
    await expect(external).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(page.getByRole('button', {name: 'Disabled'})).toBeDisabled();
  });

  test('shows localized flag badges and initials', async ({page}) => {
    await page.goto('/ko/ui-lab');
    await expect(page.getByText('샘플', {exact: true})).toBeVisible();
    await expect(page.getByText('검수 필요', {exact: true})).toBeVisible();
    await expect(page.getByText('JK', {exact: true})).toBeVisible();
    await expect(page.getByText('김', {exact: true})).toBeVisible();
  });

  test('keeps images in a fixed 3:2 frame', async ({page}) => {
    await page.goto('/en/ui-lab');
    const image = page.getByRole('img', {name: 'Three young adults talking around a café table with laptops'});
    await expect(image).toBeVisible();
    const box = await image.locator('xpath=..').boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width / box!.height).toBeCloseTo(1.5, 1);
  });

  test('the 404 page offers a way home', async ({page}) => {
    await page.goto('/en/nope');
    await expect(page.getByRole('link', {name: 'Back to home'})).toHaveAttribute('href', '/en');
  });
});

test.describe('UI Lab — interactive primitives', () => {
  test('dialog opens, traps the page, and closes with Escape', async ({page}) => {
    await page.goto('/en/ui-lab');
    const opener = page.getByRole('button', {name: 'Open dialog'});
    await opener.click();
    const dialog = page.getByRole('dialog', {name: 'Demo dialog'});
    await expect(dialog).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('hidden');
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('');
  });

  test('dialog closes from the close button and the backdrop', async ({page}) => {
    await page.goto('/en/ui-lab');
    await page.getByRole('button', {name: 'Open dialog'}).click();
    await page.getByRole('dialog').getByRole('button', {name: 'Close'}).click();
    await expect(page.getByRole('dialog')).toBeHidden();

    await page.getByRole('button', {name: 'Open dialog'}).click();
    await page.mouse.click(5, 5);
    await expect(page.getByRole('dialog')).toBeHidden();
  });

  test('tabs follow the WAI-ARIA keyboard pattern', async ({page}) => {
    await page.goto('/en/ui-lab');
    const first = page.getByRole('tab', {name: 'First'});
    await first.focus();
    await page.keyboard.press('ArrowRight');
    const second = page.getByRole('tab', {name: 'Second'});
    await expect(second).toBeFocused();
    await expect(second).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel')).toContainText('Second panel');
    await page.keyboard.press('End');
    await expect(page.getByRole('tab', {name: 'Third'})).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('ArrowRight');
    await expect(first).toHaveAttribute('aria-selected', 'true');
  });

  test('accordion items expand and collapse', async ({page}) => {
    await page.goto('/en/ui-lab');
    const item = page.locator('details', {hasText: 'What is an accordion?'});
    await expect(item).not.toHaveAttribute('open', '');
    await item.locator('summary').click();
    await expect(item).toHaveAttribute('open', '');
    await expect(item.getByText('It shows and hides content.')).toBeVisible();
  });

  test('scroller moves with the next button', async ({page}) => {
    await page.goto('/en/ui-lab');
    const list = page.getByRole('list', {name: /Scroller demo/});
    const before = await list.evaluate((el) => el.scrollLeft);
    await page.getByRole('button', {name: 'Next'}).first().click();
    await expect.poll(() => list.evaluate((el) => el.scrollLeft)).toBeGreaterThan(before);
  });
});

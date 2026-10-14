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

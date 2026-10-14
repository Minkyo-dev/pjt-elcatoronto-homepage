import {expect, test} from '@playwright/test';

test.describe('donate page', () => {
  test('photo hero CTA jumps to the donation options', async ({page}) => {
    await page.goto('/en/get-involved/donate');
    await expect(page.getByRole('heading', {level: 1, name: 'Invest in the next generation of leaders'})).toBeVisible();
    await expect(page.getByRole('link', {name: 'Make a Donation'})).toHaveAttribute('href', '#donation-options');
  });

  test('explains impact tiers and fund usage', async ({page}) => {
    await page.goto('/en/get-involved/donate');
    await expect(page.getByRole('region', {name: 'What your gift can do'}).getByRole('listitem')).toHaveCount(4);
    const usage = page.getByRole('region', {name: 'Where your donation goes'});
    await expect(usage.getByRole('listitem')).toHaveCount(4);
    await expect(usage).toContainText('40%');
  });

  test('preset amounts and frequency update the summary', async ({page}) => {
    await page.goto('/en/get-involved/donate');
    const options = page.getByRole('region', {name: 'Choose your gift'});
    await options.getByText('CA$100', {exact: true}).click();
    await expect(options.getByText(/You are giving CA\$100\.$/)).toBeVisible();
    await expect(options.getByText('Supports one month of program operations for a mentoring group.')).toBeVisible();
    await options.getByText('Monthly', {exact: true}).click();
    await expect(options.getByText('You are giving CA$100 every month.')).toBeVisible();
  });

  test('custom amounts are validated before the demo notice', async ({page}) => {
    await page.goto('/en/get-involved/donate');
    const options = page.getByRole('region', {name: 'Choose your gift'});
    await options.getByText('Other', {exact: true}).click();
    const other = options.getByLabel(/Other amount/);
    await other.fill('3');
    await options.getByRole('button', {name: 'Continue (Demo)'}).click();
    await expect(options.getByText('The minimum amount is $5.')).toBeVisible();
    await expect(other).toBeFocused();
    await other.fill('3.5');
    await expect(options.getByText('Enter a whole-dollar amount.')).toBeVisible();
    await other.fill('50');
    await options.getByRole('button', {name: 'Continue (Demo)'}).click();
    await expect(options.getByText('Demo — no payment was processed.')).toBeVisible();
  });

  test('FAQ flags the tax receipt answer for review', async ({page}) => {
    await page.goto('/en/get-involved/donate');
    const faq = page.getByRole('region', {name: 'Donation FAQ'});
    await faq.getByText('Will I receive a tax receipt?').click();
    await expect(faq.getByText('Needs review', {exact: true}).first()).toBeVisible();
  });
});

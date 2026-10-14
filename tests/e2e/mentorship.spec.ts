import {expect, test} from './fixtures';

test.describe('mentorship page', () => {
  test('uses a photo hero whose CTA jumps to #apply', async ({page}) => {
    await page.goto('/en/get-involved/mentorship');
    await expect(page.getByRole('heading', {level: 1, name: 'Mentorship that meets you where you are'})).toBeVisible();
    await page.getByRole('link', {name: 'Apply for Mentorship'}).click();
    await expect(page).toHaveURL(/#apply$/);
    await expect(page.getByRole('region', {name: 'Apply for the next cohort'})).toBeInViewport();
  });

  test('shows the offer, eligibility, six-step process, details, and outcomes', async ({page}) => {
    await page.goto('/en/get-involved/mentorship');
    await expect(page.getByRole('region', {name: 'More than advice — a relationship'}).getByRole('heading', {level: 3})).toHaveCount(4);
    await expect(page.getByRole('region', {name: 'Is this program for you?'}).getByRole('listitem')).toHaveCount(4);
    await expect(page.getByRole('region', {name: 'How it works'}).getByRole('listitem')).toHaveCount(6);
    await expect(page.getByRole('region', {name: 'At a glance'})).toContainText('Free for mentees');
    await expect(page.getByRole('region', {name: 'Where you could be in six months'}).getByRole('heading', {level: 3})).toHaveCount(4);
    await expect(page.getByRole('region', {name: 'Mentees who took the first step'}).locator('figure')).toHaveCount(3);
  });

  test('the application dialog validates and ends in a demo notice', async ({page}) => {
    await page.goto('/en/get-involved/mentorship');
    await page.getByRole('button', {name: 'Apply Now (Demo)'}).click();
    const dialog = page.getByRole('dialog', {name: 'Mentee application (Demo)'});
    await expect(dialog).toBeVisible();

    await dialog.getByRole('button', {name: 'Submit (Demo)'}).click();
    await expect(dialog.getByText('This field is required.')).toHaveCount(4);
    await expect(dialog.getByLabel(/Full name/)).toBeFocused();

    await dialog.getByLabel(/Full name/).fill('Jiwon Kim');
    await dialog.getByLabel(/^Email/).fill('jiwon@example.com');
    await dialog.getByLabel(/School and grade/).fill('Grade 11');
    await dialog.getByLabel('Technology').check();
    await dialog.getByRole('button', {name: 'Submit (Demo)'}).click();
    await expect(dialog.getByText('Demo — nothing was sent. Your input passed validation.')).toBeVisible();
  });

  test('FAQ has six questions', async ({page}) => {
    await page.goto('/en/get-involved/mentorship');
    await expect(page.getByRole('region', {name: 'Mentorship FAQ'}).locator('details')).toHaveCount(6);
  });
});

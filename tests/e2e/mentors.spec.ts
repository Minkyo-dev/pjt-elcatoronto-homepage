import {expect, test} from './fixtures';

test.describe('mentors page', () => {
  test('hero and closing CTA both send mentors to the contact form with the topic set', async ({page}) => {
    await page.goto('/en/get-involved/mentors');
    await expect(page.getByRole('heading', {level: 1, name: 'Mentors who were once in your shoes'})).toBeVisible();
    await expect(page.getByRole('link', {name: 'Become a Mentor'}).first()).toHaveAttribute('href', '/en/contact?topic=mentor');
    const cta = page.locator('#become-a-mentor');
    await expect(cta.getByRole('link', {name: 'Become a Mentor'})).toHaveAttribute('href', '/en/contact?topic=mentor');
  });

  test('shows four featured mentors without photos or ratings', async ({page}) => {
    await page.goto('/en/get-involved/mentors');
    const featured = page.getByRole('region', {name: 'Featured mentors'});
    await expect(featured.getByRole('article')).toHaveCount(4);
    await expect(featured.getByRole('img')).toHaveCount(0);
  });

  test('directory pages through 18 mentors 12 at a time', async ({page}) => {
    await page.goto('/en/get-involved/mentors');
    const directory = page.getByRole('region', {name: 'All mentors'});
    await expect(directory.getByRole('status')).toHaveText('18 mentors');
    await expect(directory.getByRole('article')).toHaveCount(12);
    await expect(directory.getByRole('combobox')).toHaveCount(0);
    await directory.getByRole('button', {name: 'Load more'}).click();
    await expect(directory.getByRole('article')).toHaveCount(18);
    await expect(directory.getByRole('button', {name: 'Load more'})).toHaveCount(0);
  });

  test('search matches English and Korean names and handles no results', async ({page}) => {
    await page.goto('/en/get-involved/mentors');
    const directory = page.getByRole('region', {name: 'All mentors'});
    const search = directory.getByRole('searchbox', {name: 'Search mentors by name'});

    await search.fill('kim');
    await expect(directory.getByRole('status')).toHaveText('1 mentor');
    await expect(directory.getByRole('heading', {level: 3, name: 'Jiwon Kim'})).toBeVisible();

    await search.fill('김 지원');
    await expect(directory.getByRole('status')).toHaveText('1 mentor');

    await search.fill('zzz');
    await expect(directory.getByText('No mentors match your search')).toBeVisible();
    await directory.getByRole('button', {name: 'Clear search'}).click();
    await expect(search).toHaveValue('');
    await expect(search).toBeFocused();
    await expect(directory.getByRole('status')).toHaveText('18 mentors');
  });

  test('profile dialog shows details including long company names', async ({page}) => {
    await page.goto('/en/get-involved/mentors');
    const directory = page.getByRole('region', {name: 'All mentors'});
    await directory.getByRole('searchbox').fill('Taeyoung');
    await directory.getByRole('button', {name: 'View profile: Taeyoung Moon'}).click();
    const dialog = page.getByRole('dialog', {name: 'Taeyoung Moon'});
    await expect(dialog).toContainText('Department of Mechanical and Industrial Engineering');
    await expect(dialog).toContainText('Cohort 9 Mentee → Junior Mentor');
  });

  test('Korean page finds mentors by their English name', async ({page}) => {
    await page.goto('/ko/get-involved/mentors');
    const directory = page.getByRole('region', {name: '전체 멘토'});
    await directory.getByRole('searchbox').fill('Jiwon');
    await expect(directory.getByRole('heading', {level: 3, name: '김지원'})).toBeVisible();
    await expect(directory.getByRole('status')).toHaveText('멘토 1명');
  });
});

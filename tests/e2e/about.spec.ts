import {expect, test} from '@playwright/test';

test.describe('about page', () => {
  test('introduces ELCA with a hero and CTA', async ({page}) => {
    await page.goto('/en/about');
    await expect(page).toHaveTitle('About ELCA | ELCA Toronto');
    await expect(page.getByRole('heading', {level: 1, name: 'A community built on mentorship'})).toBeVisible();
    await expect(page.locator('main').getByRole('link', {name: 'Get Involved'}).first()).toHaveAttribute(
      'href',
      '/en/get-involved/mentorship',
    );
  });

  test('shows purpose, values, mission and vision', async ({page}) => {
    await page.goto('/en/about');
    const purpose = page.getByRole('region', {name: 'Why we exist'});
    await expect(purpose.getByRole('heading', {level: 3})).toHaveCount(4);
    await expect(page.getByRole('heading', {level: 2, name: 'Mission'})).toBeVisible();
    await expect(page.getByRole('heading', {level: 2, name: 'Vision'})).toBeVisible();
  });

  test('lists the story, impact, and sample team', async ({page}) => {
    await page.goto('/en/about');
    const story = page.getByRole('region', {name: 'From a small circle to a growing community'});
    await expect(story.getByRole('listitem')).toHaveCount(6);
    await expect(story).toContainText('2019');

    const impact = page.getByRole('region', {name: 'Growth we can see'});
    await expect(impact.locator('dl > div')).toHaveCount(4);

    const team = page.getByRole('region', {name: 'The people behind ELCA'});
    await expect(team.getByRole('listitem')).toHaveCount(6);
    await expect(team.getByText('Sample', {exact: true}).first()).toBeVisible();
  });

  test('links to reports and ends with FAQ and CTA', async ({page}) => {
    await page.goto('/en/about');
    await expect(page.getByRole('link', {name: 'View Reports'})).toHaveAttribute('href', '/en/about/reports');
    await expect(page.getByRole('region', {name: 'Questions about ELCA'}).locator('details')).toHaveCount(4);
    const cta = page.getByRole('region', {name: 'Ready to get involved?'});
    await expect(cta.getByRole('link', {name: 'Donate'})).toHaveAttribute('href', '/en/get-involved/donate');
  });

  test('is localized', async ({page}) => {
    await page.goto('/ko/about');
    await expect(page.getByRole('heading', {level: 1, name: '멘토십으로 이어진 커뮤니티'})).toBeVisible();
  });
});

test.describe('reports page', () => {
  test('switches between financial statements and annual reports', async ({page}) => {
    await page.goto('/en/about/reports');
    await expect(page.getByRole('heading', {level: 1, name: 'Reports & transparency'})).toBeVisible();
    const panel = page.getByRole('tabpanel');
    await expect(panel.getByRole('heading', {level: 3})).toHaveText(['2025 Financial Statements', '2024 Financial Statements']);

    await page.getByRole('tab', {name: 'Financial Statements'}).focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tab', {name: 'Annual Reports'})).toHaveAttribute('aria-selected', 'true');
    await expect(panel.getByRole('heading', {level: 3})).toHaveText(['2025 Annual Report', '2024 Annual Report']);
  });

  test('marks sample files as unavailable', async ({page}) => {
    await page.goto('/en/about/reports');
    const buttons = page.getByRole('tabpanel').getByRole('button', {name: 'Sample — file not available'});
    await expect(buttons).toHaveCount(2);
    await expect(buttons.first()).toBeDisabled();
  });
});

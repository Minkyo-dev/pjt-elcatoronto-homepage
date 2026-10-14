import {expect, test} from './fixtures';

test.describe('events & news page', () => {
  test('hero CTA, featured item, and default "All" view', async ({page}) => {
    await page.goto('/en/events-news');
    await expect(page.getByRole('heading', {level: 1, name: 'Learn, connect, and celebrate together'})).toBeVisible();
    await expect(page.getByRole('link', {name: 'View Upcoming Events'})).toHaveAttribute('href', '#events');
    await expect(page.getByRole('region', {name: 'Featured', exact: true}).getByRole('link', {name: 'Winter Networking Night'})).toBeVisible();
    await expect(page.getByRole('tab', {name: 'All'})).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('region', {name: 'Upcoming events & workshops'}).getByRole('article')).toHaveCount(4);
  });

  test('timeline spans 2024–2027 with a Today marker', async ({page}) => {
    await page.goto('/en/events-news');
    const timeline = page.getByRole('region', {name: 'Our events over the years'});
    await expect(timeline.getByRole('heading', {level: 3})).toHaveText(['2024', '2025', '2026', '2027']);
    await expect(timeline.getByText('Today', {exact: true})).toBeVisible();
  });

  test('news & stories load six at a time', async ({page}) => {
    await page.goto('/en/events-news');
    const latest = page.getByRole('region', {name: 'News & stories'});
    await expect(latest.getByRole('article')).toHaveCount(6);
    await latest.getByRole('button', {name: 'Load more'}).click();
    await expect(latest.getByRole('article')).toHaveCount(8);
  });

  test('category tabs filter blocks and sync with the URL', async ({page}) => {
    await page.goto('/en/events-news');
    await page.getByRole('tab', {name: 'Workshops'}).click();
    await expect(page).toHaveURL(/\?category=workshops$/);
    await expect(page.getByRole('region', {name: 'Upcoming events & workshops'}).getByRole('article')).toHaveCount(2);
    await expect(page.getByRole('region', {name: 'News & stories'})).toHaveCount(0);

    await page.reload();
    await page.locator('html[data-hydrated="true"]').waitFor({state: 'attached'});
    await expect(page.getByRole('tab', {name: 'Workshops'})).toHaveAttribute('aria-selected', 'true');

    await page.getByRole('tab', {name: 'Stories'}).click();
    await expect(page.getByRole('region', {name: 'Upcoming events & workshops'})).toHaveCount(0);
    await expect(page.getByRole('region', {name: 'News & stories'}).getByRole('article')).toHaveCount(4);

    await page.getByRole('tab', {name: 'All'}).click();
    await expect(page).toHaveURL(/\/en\/events-news$/);
  });

  test('"View Upcoming Events" from the Stories tab switches to All and scrolls to upcoming', async ({page}) => {
    await page.goto('/en/events-news');
    await page.getByRole('tab', {name: 'Stories'}).click();
    await expect(page.getByRole('region', {name: 'Upcoming events & workshops'})).toHaveCount(0);
    await page.getByRole('link', {name: 'View Upcoming Events'}).click();
    await expect(page.getByRole('tab', {name: 'All'})).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('region', {name: 'Upcoming events & workshops'})).toBeInViewport();
  });

  test('ignores hand-edited category values', async ({page}) => {
    for (const value of ['WORKSHOPS', '%3Cscript%3E', 'unknown']) {
      await page.goto(`/en/events-news?category=${value}`);
      await expect(page.getByRole('tab', {name: 'All'})).toHaveAttribute('aria-selected', 'true');
    }
  });

  test('recap gallery pages and opens a lightbox', async ({page}) => {
    await page.goto('/en/events-news');
    const recap = page.getByRole('region', {name: 'Past events recap'});
    const photos = recap.getByRole('button', {name: /^Open photo/});
    await expect(photos).toHaveCount(6);
    await recap.getByRole('button', {name: 'Load more'}).click();
    await expect(photos).toHaveCount(12);
    await photos.first().click();
    const lightbox = page.getByRole('dialog');
    await expect(lightbox.getByRole('link', {name: 'View event'})).toHaveAttribute('href', /\/en\/events-news\/.+/);
    await page.keyboard.press('Escape');
    await expect(lightbox).toBeHidden();
  });

  test('host and request forms validate', async ({page}) => {
    await page.goto('/en/events-news');
    const forms = page.getByRole('region', {name: 'Host or request an event'});
    await forms.getByRole('button', {name: 'Submit (Demo)'}).click();
    await expect(forms.getByText('This field is required.')).toHaveCount(7);

    await forms.getByRole('tab', {name: 'Request an Event'}).click();
    await expect(forms.getByLabel(/Topic you would like/)).toBeVisible();
    await forms.getByLabel(/^Full name/).fill('Minseo');
    await forms.getByLabel(/^Email/).fill('minseo@example.com');
    await forms.getByLabel(/Topic you would like/).fill('Law school');
    await forms.getByLabel(/Your request or question/).fill('A session on law school admissions, please.');
    await forms.getByRole('button', {name: 'Submit (Demo)'}).click();
    await expect(forms.getByText('Demo — nothing was sent. Your input passed validation.')).toBeVisible();
  });

  test('event Q&A is an accordion', async ({page}) => {
    await page.goto('/en/events-news');
    await expect(page.getByRole('region', {name: 'Event Q&A'}).locator('details')).toHaveCount(4);
  });
});

import {expect, test} from './fixtures';
import {ROUTES, localized} from './helpers';

const CID = /^[A-Z]{3}-\d{2}(-\d{2})?[a-z]?$/;

for (const route of ROUTES) {
  const url = localized('en', route);

  test(`${url} — component IDs are well-formed, unique, and belong to one screen`, async ({page}) => {
    await page.goto(url);
    const ids = await page.locator('[data-cid]').evaluateAll((elements) => elements.map((el) => (el as HTMLElement).dataset.cid!));
    // Closed dialogs and inactive slides may repeat an ID (same design, one shown at a time); visible ones may not.
    const visibleIds = await page
      .locator('[data-cid]')
      .evaluateAll((elements) => elements.filter((el) => el.checkVisibility()).map((el) => (el as HTMLElement).dataset.cid!));

    expect(ids.filter((id) => !CID.test(id)), 'malformed IDs').toEqual([]);
    // Repeated items (trailing letter) share an ID by design; everything else is unique.
    const single = visibleIds.filter((id) => !/[a-z]$/.test(id));
    expect(single.filter((id, index) => single.indexOf(id) !== index), 'duplicate IDs').toEqual([]);
    const screens = new Set(ids.map((id) => id.slice(0, 3)).filter((code) => code !== 'GLB'));
    expect([...screens], 'one screen code per page').toHaveLength(1);
  });
}

test('the overlay toggles with ?ids and Shift+Alt+I and remembers the choice', async ({page}) => {
  const labels = page.locator('[data-cid-overlay] span');

  await page.goto('/en/contact');
  await expect(labels).toHaveCount(0);

  await page.goto('/en/contact?ids=1');
  await expect(labels.filter({hasText: 'GLB-01'}).first()).toBeVisible();

  await page.goto('/en/about');
  await expect(labels.first()).toBeVisible();

  await page.keyboard.press('Shift+Alt+KeyI');
  await expect(labels).toHaveCount(0);

  await page.keyboard.press('Shift+Alt+KeyI');
  await expect(labels.first()).toBeVisible();

  await page.goto('/en/about?ids=0');
  await expect(labels).toHaveCount(0);
});

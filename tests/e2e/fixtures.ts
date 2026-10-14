import {test as base, expect} from '@playwright/test';

/** `page.goto` waits until the app has hydrated, so tests never interact with inert server HTML. */
export const test = base.extend({
  page: async ({page}, provide) => {
    const goto = page.goto.bind(page);
    page.goto = (async (url, options) => {
      const response = await goto(url, options);
      await page.locator('html[data-hydrated="true"]').waitFor({state: 'attached'});
      return response;
    }) as typeof page.goto;
    await provide(page);
  },
});

export {expect};
export type {Page} from '@playwright/test';

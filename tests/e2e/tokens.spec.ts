import {expect, test} from '@playwright/test';

test('body uses the background token and the English font stack', async ({page}) => {
  await page.goto('/en');
  const styles = await page.evaluate(() => {
    const body = getComputedStyle(document.body);
    return {background: body.backgroundColor, color: body.color, font: body.fontFamily};
  });
  expect(styles.background).toBe('rgb(249, 250, 248)');
  expect(styles.color).toBe('rgb(23, 35, 43)');
  expect(styles.font.split(',')[0]).toContain('Inter');
});

test('Korean pages put Noto Sans KR first and relax heading tracking', async ({page}) => {
  await page.goto('/ko');
  const result = await page.evaluate(() => {
    const h1 = document.querySelector('h1')!;
    return {
      font: getComputedStyle(document.body).fontFamily,
      tracking: getComputedStyle(h1).letterSpacing,
      fontSize: parseFloat(getComputedStyle(h1).fontSize),
    };
  });
  expect(result.font.split(',')[0]).toContain('Noto Sans KR');
  expect(result.fontSize).toBeGreaterThanOrEqual(36);
  expect(parseFloat(result.tracking)).toBeGreaterThan(-0.02 * result.fontSize);
});

test('display heading scales between mobile and desktop', async ({page}, testInfo) => {
  await page.goto('/en');
  const size = await page.locator('h1').evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  if (testInfo.project.name === 'mobile') {
    expect(size).toBeGreaterThanOrEqual(36);
    expect(size).toBeLessThanOrEqual(40);
  } else {
    expect(size).toBeGreaterThanOrEqual(52);
    expect(size).toBeLessThanOrEqual(60);
  }
});

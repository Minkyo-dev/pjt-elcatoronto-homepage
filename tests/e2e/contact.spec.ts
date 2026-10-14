import {expect, test} from '@playwright/test';

test.describe('contact page', () => {
  test('lists contact information and a map placeholder', async ({page}) => {
    await page.goto('/en/contact');
    await expect(page.getByRole('heading', {level: 1, name: 'We would love to hear from you'})).toBeVisible();
    await expect(page.getByRole('link', {name: 'Send Message (Demo)'}).first()).toHaveAttribute('href', '#contact-form');
    const info = page.getByRole('region', {name: 'Ways to reach us'});
    await expect(info.getByRole('link', {name: 'info@elcatoronto.com'})).toHaveAttribute('href', 'mailto:info@elcatoronto.com');
    await expect(page.getByText('Map placeholder — no external map is loaded in this prototype.')).toBeVisible();
  });

  test('pre-selects the topic from ?topic=mentor', async ({page}) => {
    await page.goto('/en/contact?topic=mentor');
    await expect(page.getByLabel(/^Topic/)).toHaveValue('mentor');
  });

  test('ignores unknown or malicious topics', async ({page}) => {
    for (const topic of ['MENTOR', 'unknown', '%3Cscript%3Ealert(1)%3C%2Fscript%3E']) {
      await page.goto(`/en/contact?topic=${topic}`);
      await expect(page.getByLabel(/^Topic/)).toHaveValue('');
    }
  });

  test('validates (trimming whitespace) and handles a double submit', async ({page}) => {
    await page.goto('/en/contact');
    const form = page.locator('#contact-form');
    const send = form.getByRole('button', {name: 'Send Message (Demo)'});

    await form.getByLabel(/^Full name/).fill('   ');
    await send.click();
    await expect(form.getByText('This field is required.')).toHaveCount(4);
    await expect(form.getByLabel(/^Full name/)).toBeFocused();

    await form.getByLabel(/^Full name/).fill('Jiwon Kim');
    await form.getByLabel(/^Email/).fill('jiwon@example.com');
    await form.getByLabel(/^Topic/).selectOption('partnership');
    await form.getByLabel(/^Message/).fill('We would like to host a workshop.');
    await send.dblclick();
    await expect(form.getByText('Demo — nothing was sent. Your input passed validation.')).toBeVisible();
    await expect(form.getByText('This field is required.')).toHaveCount(0);
    await expect(form.getByLabel(/^Full name/)).toHaveValue('');
  });

  test('the Become a Mentor CTA from the mentors page arrives with the topic set', async ({page}) => {
    await page.goto('/ko/contact?topic=mentor');
    await expect(page.getByLabel(/^문의 주제/)).toHaveValue('mentor');
  });
});

import {expect, test} from '@playwright/test';

test('footer shows navigation, contact, social links, and copyright', async ({page}) => {
  await page.goto('/en/ui-lab');
  const footer = page.locator('footer');
  await expect(footer.getByRole('navigation', {name: 'Explore'})).toBeVisible();
  await expect(footer.getByRole('navigation', {name: 'Get Involved'}).getByRole('link', {name: 'Mentors', exact: true})).toHaveAttribute(
    'href',
    '/en/get-involved/mentors',
  );
  await expect(footer.getByRole('link', {name: 'info@elcatoronto.com'})).toHaveAttribute('href', 'mailto:info@elcatoronto.com');
  const facebook = footer.getByRole('link', {name: /ELCA on Facebook/});
  await expect(facebook).toHaveAttribute('target', '_blank');
  await expect(footer).toContainText(`© ${new Date().getFullYear()} ELCA.`);
  await expect(footer.getByRole('link', {name: /Privacy Policy \(coming soon\)/})).toHaveAttribute('href', '/en/contact');
});

test('newsletter validates, then shows a demo notice without subscribing', async ({page}) => {
  await page.goto('/en/ui-lab');
  const footer = page.locator('footer');
  const email = footer.getByLabel(/Email address/);
  const submit = footer.getByRole('button', {name: 'Subscribe'});

  await submit.click();
  await expect(footer.getByText('This field is required.')).toBeVisible();
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  await expect(email).toBeFocused();

  await email.fill('not-an-email');
  await expect(footer.getByText('Enter a valid email address.')).toBeVisible();
  await email.fill('reader@example.com');
  await expect(footer.getByText('Enter a valid email address.')).toBeHidden();

  await submit.click();
  await expect(footer.getByText('This is a demo. No subscription was created.')).toBeVisible();
  await expect(email).toHaveValue('');
});

test('footer is localized', async ({page}) => {
  await page.goto('/ko/ui-lab');
  await expect(page.locator('footer').getByRole('navigation', {name: '둘러보기'})).toBeVisible();
});

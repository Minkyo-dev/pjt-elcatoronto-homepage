import {expect, test} from './fixtures';

type Check = {page: string; scope?: string; name: string | RegExp; href: string};

const CHECKS: Check[] = [
  {page: '/en', scope: 'header', name: 'Donate', href: '/en/get-involved/donate'},
  {page: '/en', scope: '[aria-roledescription="carousel"]', name: 'Explore Mentorship', href: '/en/get-involved/mentorship'},
  {page: '/en', scope: '#featured-mentors', name: 'View all mentors', href: '/en/get-involved/mentors'},
  {page: '/en', scope: '#highlights', name: 'View all', href: '/en/events-news'},
  {page: '/en', scope: '#get-involved', name: 'Apply for Mentorship', href: '/en/get-involved/mentorship'},
  {page: '/en', scope: '#get-involved', name: 'Become a Mentor', href: '/en/get-involved/mentors#become-a-mentor'},
  {page: '/en', scope: '#get-involved', name: 'Make a Donation', href: '/en/get-involved/donate'},
  {page: '/en/about', scope: 'main', name: 'Get Involved', href: '/en/get-involved/mentorship'},
  {page: '/en/about', scope: '#reports', name: 'View Reports', href: '/en/about/reports'},
  {page: '/en/get-involved/mentorship', scope: 'main', name: 'Apply for Mentorship', href: '#apply'},
  {page: '/en/get-involved/mentors', scope: 'main', name: 'Become a Mentor', href: '/en/contact?topic=mentor'},
  {page: '/en/get-involved/donate', scope: 'main', name: 'Make a Donation', href: '#donation-options'},
  {page: '/en/events-news', scope: 'main', name: 'View Upcoming Events', href: '#events'},
  {page: '/en/events-news', scope: '#events', name: 'Winter Networking Night', href: '/en/events-news/winter-networking-night-2026'},
  {page: '/en/contact', scope: 'main', name: 'Send Message (Demo)', href: '#contact-form'},
  {page: '/en', scope: 'footer', name: 'Explore Mentorship', href: '/en/get-involved/mentorship'},
  {page: '/en', scope: 'footer', name: /^Donate$/, href: '/en/get-involved/donate'},
  {page: '/en', name: 'Open the contact page', href: '/en/contact'},
];

for (const check of CHECKS) {
  test(`${check.page} [${check.scope ?? "page"}] → "${check.name}" links to ${check.href}`, async ({page}, testInfo) => {
    await page.goto(check.page);
    // Below lg the header Donate button lives inside the mobile drawer.
    if (check.scope === 'header' && testInfo.project.name === 'mobile') {
      await page.getByRole('button', {name: 'Open menu'}).click();
      await page.getByRole('dialog').getByRole('link', {name: check.name}).first().waitFor();
      await expect(page.getByRole('dialog').getByRole('link', {name: check.name}).first()).toHaveAttribute('href', check.href);
      return;
    }
    const root = check.scope ? page.locator(check.scope) : page;
    await expect(root.getByRole('link', {name: check.name}).first()).toHaveAttribute('href', check.href);
  });
}

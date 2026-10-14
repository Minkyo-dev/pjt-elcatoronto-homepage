# Phase 1 · M7 SEO, Quality Suite, README (Tasks 24–26)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Read [the index](2026-10-13-phase1-00-index.md) first — its **Global Constraints** apply to every task.

**Milestone goal:** robots/sitemap, a cross-route quality suite that enforces the Definition of Done, and the project README.

**Spec references:** [07-quality-and-testing.md](../specs/07-quality-and-testing.md) (all), [04-pages.md](../specs/04-pages.md) Appendix A, [01-architecture.md](../specs/01-architecture.md) §2 and §6.

---

### Task 24: robots.txt, sitemap.xml, and alternate-language metadata

**Files:**
- Create: `app/robots.ts`, `app/sitemap.ts`
- Test: `tests/e2e/seo.spec.ts`

**Interfaces:**
- Consumes: `STATIC_PATHS`, `localizedPath` (Tasks 3, 7), `getAllContentSlugs` (Task 8), `siteUrl` (Task 3), `routing`.
- Produces: `/robots.txt` (disallows `/studio` and `/{locale}/ui-lab`), `/sitemap.xml` (8 static paths + 18 content slugs, × 2 locales, with `hreflang` alternates).

- [ ] **Step 1: Write the failing E2E test**

`tests/e2e/seo.spec.ts`:
```ts
import {expect, test} from '@playwright/test';

test('robots.txt blocks the studio and UI lab and points to the sitemap', async ({request}) => {
  const body = await (await request.get('/robots.txt')).text();
  expect(body).toContain('Disallow: /studio');
  expect(body).toContain('Disallow: /en/ui-lab');
  expect(body).toContain('Disallow: /ko/ui-lab');
  expect(body).toMatch(/Sitemap: .+\/sitemap\.xml/);
});

test('sitemap lists every page in both locales with alternates', async ({request}) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  expect(urls).toHaveLength((8 + 18) * 2);
  expect(urls.some((url) => url.endsWith('/ko/events-news/winter-networking-night-2026'))).toBe(true);
  expect(urls.some((url) => url.endsWith('/en'))).toBe(true);
  expect(xml).toContain('hreflang="ko"');
});

test('pages declare canonical and alternate-language links', async ({page}) => {
  await page.goto('/en/about');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/en\/about$/);
  await expect(page.locator('link[rel="alternate"][hreflang="ko"]')).toHaveAttribute('href', /\/ko\/about$/);
  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', /\/en\/about$/);
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'en_CA');
});

test('the UI Lab is not indexable', async ({page}) => {
  await page.goto('/en/ui-lab');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});
```

Run: `npm run test:e2e -- tests/e2e/seo.spec.ts`
Expected: robots/sitemap tests FAIL (404).

- [ ] **Step 2: Implement**

`app/robots.ts`:
```ts
import type {MetadataRoute} from 'next';
import {routing} from '@/lib/i18n/routing';
import {siteUrl} from '@/lib/utils/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /studio is the Phase 2 Sanity Studio; ui-lab is a dev-only showcase.
        disallow: ['/studio', ...routing.locales.map((locale) => `/${locale}/ui-lab`)],
      },
    ],
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
```

`app/sitemap.ts`:
```ts
import type {MetadataRoute} from 'next';
import {getAllContentSlugs} from '@/lib/content/content';
import {localizedPath, STATIC_PATHS} from '@/lib/i18n/paths';
import {routing} from '@/lib/i18n/routing';
import {siteUrl} from '@/lib/utils/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const slugs = await getAllContentSlugs();
  const paths = [...STATIC_PATHS, ...slugs.map((slug) => `/events-news/${slug}`)];

  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${base}${localizedPath(locale, path)}`,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((other) => [other, `${base}${localizedPath(other, path)}`])),
      },
    })),
  );
}
```

- [ ] **Step 3: Run tests and commit**

Run: `npm run test:e2e -- tests/e2e/seo.spec.ts && npm run typecheck && npm run lint`
Expected: PASS.

```bash
git add app tests
git commit -m "$(cat <<'EOF'
feat: add robots.txt and bilingual sitemap

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 25: Cross-route quality suite (accessibility, overflow, headings, CTA map, no network)

**Files:**
- Create: `tests/unit/architecture.test.ts`, `tests/e2e/helpers.ts`, `tests/e2e/quality.spec.ts`, `tests/e2e/cta-map.spec.ts`
- Modify: any component the suite proves wrong (fix the component, never weaken the test)

**Interfaces:**
- Consumes: the whole app.
- Produces: architecture guard unit test; `ROUTES`, `LOCALES`, `localized(locale, route)`, `expectNoHorizontalOverflow(page)`, `expectNoSeriousA11yViolations(page)`, `visibleHeadingLevels(page)` in `tests/e2e/helpers.ts`.

- [ ] **Step 1: Write the architecture guard (unit)**

It enforces two Definition-of-Done rules that no feature test covers: components never read data directly, and no hard-coded colors or pixel values leak outside the token layer (spec 02, designer hand-off).

`tests/unit/architecture.test.ts`:
```ts
import {readdirSync, readFileSync, statSync} from 'node:fs';
import {join} from 'node:path';
import {describe, expect, it} from 'vitest';

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return path.endsWith('.ts') || path.endsWith('.tsx') ? [path] : [];
  });
}

const componentFiles = sourceFiles('components');
const uiFiles = [...componentFiles, ...sourceFiles('app')];

describe('architecture guards', () => {
  it('components never import the repository or mock data (pure helpers are allowed)', () => {
    const offenders = componentFiles.filter((file) =>
      /from '@\/(data\/|lib\/content\/(?!helpers\/))/.test(readFileSync(file, 'utf8')),
    );
    expect(offenders).toEqual([]);
  });

  it('components and routes use tokens: no hex colors, no arbitrary px values', () => {
    const offenders = uiFiles.flatMap((file) => {
      const hits = [...readFileSync(file, 'utf8').matchAll(/#[0-9a-fA-F]{3,8}\b|\[[^\]\n]*\d+px[^\]\n]*\]/g)].map((m) => m[0]);
      return hits.length > 0 ? [`${file}: ${hits.join(', ')}`] : [];
    });
    expect(offenders).toEqual([]);
  });
});
```

Run: `npm run test -- tests/unit/architecture.test.ts`
Expected: PASS (fix any offender it reports).

- [ ] **Step 2: Write the E2E helpers and the suite**

`tests/e2e/helpers.ts`:
```ts
import AxeBuilder from '@axe-core/playwright';
import {expect, type Page} from '@playwright/test';

export const LOCALES = ['en', 'ko'] as const;

/** Every route, including one upcoming event, one past event, and one post. */
export const ROUTES = [
  '/',
  '/about',
  '/about/reports',
  '/get-involved/mentorship',
  '/get-involved/mentors',
  '/get-involved/donate',
  '/events-news',
  '/events-news/winter-networking-night-2026',
  '/events-news/annual-mentorship-conference-2024',
  '/events-news/from-mentee-to-mentor',
  '/contact',
] as const;

export function localized(locale: string, route: string): string {
  return `/${locale}${route === '/' ? '' : route}`;
}

export async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const {scrollWidth, clientWidth} = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth, `page is ${scrollWidth - clientWidth}px wider than the viewport`).toBeLessThanOrEqual(clientWidth);
}

export async function expectNoSeriousA11yViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  expect(
    serious.map((v) => ({id: v.id, help: v.help, targets: v.nodes.map((n) => n.target.join(' '))})),
    'serious/critical axe violations',
  ).toEqual([]);
}

/** Heading levels in document order, skipping display:none content (closed dialogs, hidden slides). */
export async function visibleHeadingLevels(page: Page): Promise<number[]> {
  return page
    .locator('h1, h2, h3, h4, h5, h6')
    .evaluateAll((elements) =>
      elements.filter((el) => (el as HTMLElement).checkVisibility()).map((el) => Number(el.tagName.slice(1))),
    );
}
```

`tests/e2e/quality.spec.ts`:
```ts
import {expect, test} from '@playwright/test';
import {
  expectNoHorizontalOverflow,
  expectNoSeriousA11yViolations,
  LOCALES,
  localized,
  ROUTES,
  visibleHeadingLevels,
} from './helpers';

for (const locale of LOCALES) {
  for (const route of ROUTES) {
    const url = localized(locale, route);

    test(`${url} — status, language, headings, accessibility, overflow`, async ({page}, testInfo) => {
      const response = await page.goto(url);
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('main#main')).toHaveCount(1);
      await expect(page.locator('h1')).toHaveCount(1);

      const levels = await visibleHeadingLevels(page);
      expect(levels[0]).toBe(1);
      levels.forEach((level, index) => {
        if (index > 0) expect(level, `heading level jumps at index ${index}: ${levels.join(',')}`).toBeLessThanOrEqual(levels[index - 1] + 1);
      });

      await expectNoSeriousA11yViolations(page);
      await expectNoHorizontalOverflow(page);

      if (testInfo.project.name === 'desktop') {
        await page.setViewportSize({width: 768, height: 1024});
        await expectNoHorizontalOverflow(page);
      }
    });
  }
}

test('images reserve their space (no layout shift from images)', async ({page}) => {
  await page.goto('/en/events-news');
  const unsized = await page.locator('main img').evaluateAll((images) =>
    images
      .filter((img) => {
        const style = getComputedStyle(img);
        const filled = style.position === 'absolute' && img.parentElement && getComputedStyle(img.parentElement).position !== 'static';
        return !filled && !(img.getAttribute('width') && img.getAttribute('height'));
      })
      .map((img) => img.getAttribute('src')),
  );
  expect(unsized).toEqual([]);
});

test('demo forms never send network requests', async ({page}) => {
  await page.goto('/en/contact');
  const writes: string[] = [];
  page.on('request', (request) => {
    if (request.method() !== 'GET') writes.push(`${request.method()} ${request.url()}`);
  });
  const form = page.locator('#contact-form');
  await form.getByLabel(/^Full name/).fill('Jiwon Kim');
  await form.getByLabel(/^Email/).fill('jiwon@example.com');
  await form.getByLabel(/^Topic/).selectOption('general');
  await form.getByLabel(/^Message/).fill('Hello!');
  await form.getByRole('button', {name: 'Send Message (Demo)'}).click();
  await expect(form.getByText(/^Demo/)).toBeVisible();

  await page.locator('footer').getByLabel(/Email address/).fill('reader@example.com');
  await page.locator('footer').getByRole('button', {name: 'Subscribe'}).click();
  await expect(page.getByText('This is a demo. No subscription was created.')).toBeVisible();

  expect(writes).toEqual([]);
});

test('reduced motion disables transitions', async ({page}) => {
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.goto('/en');
  const duration = await page
    .getByRole('link', {name: 'Donate'})
    .first()
    .evaluate((el) => getComputedStyle(el).transitionDuration);
  expect(parseFloat(duration)).toBeLessThan(0.01);
});
```

`tests/e2e/cta-map.spec.ts` (spec 04, Appendix A):
```ts
import {expect, test} from '@playwright/test';

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
  test(`${check.page} → "${check.name}" links to ${check.href}`, async ({page}) => {
    await page.goto(check.page);
    const root = check.scope ? page.locator(check.scope) : page;
    await expect(root.getByRole('link', {name: check.name}).first()).toHaveAttribute('href', check.href);
  });
}
```

- [ ] **Step 3: Run the suite and fix what it finds**

Run: `npm run test:e2e -- tests/e2e/quality.spec.ts tests/e2e/cta-map.spec.ts`
Expected: PASS. If a check fails, fix the component (contrast token, missing label, overflow source, heading level) and re-run. Record each real fix in the commit message body. Do not loosen assertions or add axe rule exclusions.

- [ ] **Step 4: Run everything**

Run: `npm run typecheck && npm run lint && npm run test && npm run test:e2e`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add tests components app lib
git commit -m "$(cat <<'EOF'
test: add cross-route accessibility, overflow, heading, and CTA map suite

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 26: README and final verification

**Files:**
- Modify: `README.md` (replace), `docs/README.md` (link the plans)
- Test: full verification run

**Interfaces:**
- Consumes: everything.
- Produces: README covering setup, scripts, structure, data editing, and known limitations (spec 07 §5 item 9).

- [ ] **Step 1: Write the README**

`README.md`:
````markdown
# ELCA Toronto — Website (Phase 1 prototype)

Front-end prototype of the ELCA (Entrepreneurial Leadership Canada) website: Next.js 16 App Router,
EN/KO, mock data shaped for a future Sanity CMS. Design specs live in [`docs/`](docs/README.md).

> All people, numbers, sponsors, and reports are **samples** (marked "Sample"). Facts taken from the
> previous site are marked "Needs review". Forms are **demos** — nothing is sent anywhere.

## Requirements

- **Node 24** (pinned in `.nvmrc`). This repo does not change your global default:
  ```bash
  nvm install 24   # once
  nvm use          # in this repo, every new shell
  ```
- npm 11 (bundled with Node 24)

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at http://localhost:3000 (redirects to `/en` or `/ko`) |
| `npm run build && npm start` | Production build and server |
| `npm run typecheck` | Generate route types and run `tsc` |
| `npm run lint` | ESLint |
| `npm run test` | Unit tests (Vitest) |
| `npm run test:e2e` | Builds, starts on :3100, runs Playwright (desktop 1280 + mobile 375) |

First E2E run: `npx playwright install chromium`.

UI Lab (component showcase for designers): build with `NEXT_PUBLIC_ENABLE_UI_LAB=1`, then open `/en/ui-lab`.
It returns 404 otherwise.

## Routes

`/{en|ko}` + `/`, `/about`, `/about/reports`, `/get-involved/mentorship`, `/get-involved/mentors`,
`/get-involved/donate`, `/events-news`, `/events-news/[slug]`, `/contact`.

## Structure

```
app/[locale]/         Routes (all statically generated for en + ko)
components/ui/        Primitives — the only place (with app/globals.css) that makes visual decisions
components/layout/    Header, Footer, floating buttons, overlay registry
components/sections/  Reusable page sections (Hero, cards, FAQ, …)
components/pages/     Page-specific sections and demo forms
data/mock/            Mock content — { en, ko } fields, same shape as future Sanity documents
lib/content/          Server-only repository: the ONLY way pages read data (swap point for Sanity)
lib/i18n/             Routing, navigation, locale resolver, metadata helpers
lib/validation/       zod schemas for every demo form
messages/             UI labels (en.json / ko.json — identical keys, unit-tested)
types/                Domain types (Doc = stored shape, View = locale-resolved)
tests/unit, tests/e2e Vitest and Playwright
```

## Editing content

- Text editors would change in a CMS → `data/mock/**` (both `en` and `ko`; a missing `ko` falls back to `en`).
- Button labels, form labels, errors → `messages/*.json` (keep keys identical in both files).
- Images → `data/mock/images.ts` (Unsplash stand-ins; replace with real photos).
- Design tokens → `app/globals.css` (`@theme`). Designer updates should only touch this file and `components/ui/*`.

## Known limitations

- **Event status is computed when a page is rendered.** Mock events are dated 2026-11 → 2027-03 (upcoming)
  and 2024 → 2026-09 (past). Builds outside that window will show different upcoming/past splits.
- No CMS, deployment, auth, payments, email, or subscriptions (see `docs/specs/06-roadmap-sanity-vercel.md`).
- Social icons are lettermarks; the logo is a text wordmark.
````

In `docs/README.md`, replace the `plans/` row of the directory table with:
```markdown
| `plans/` | 구현 계획 — [Phase 1 인덱스](plans/2026-10-13-phase1-00-index.md) |
```

- [ ] **Step 2: Full verification**

Run each and confirm the expected result:
- `npm run typecheck` → exit 0
- `npm run lint` → exit 0, no warnings
- `npm run test` → all unit tests pass
- `npm run test:e2e` → all E2E tests pass in both projects
- `npm run build` → build output shows `/en`, `/ko` and every route as prerendered (`○`/`●`), and 36 detail pages

Then check manually (spec 07 §4) and note results in the commit body:
- Photo heroes (Mentorship, Donate) readable over the overlay.
- Korean pages wrap words cleanly (`word-break: keep-all`) and headings look right.
- One VoiceOver or NVDA pass through Home → Mentors → Donate.
- Lighthouse mobile on `/en`: record Performance / Accessibility / Best Practices / SEO (target Accessibility ≥ 95, CLS < 0.1).

- [ ] **Step 3: Commit**

```bash
git add README.md docs/README.md
git commit -m "$(cat <<'EOF'
docs: add project README and link the Phase 1 plan

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 4: Finish the branch**

Use the superpowers:finishing-a-development-branch skill to decide how to integrate `feat/phase1-ui-prototype`.

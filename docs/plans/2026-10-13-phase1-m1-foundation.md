# Phase 1 · M1 Foundation (Tasks 1–3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Read [the index](2026-10-13-phase1-00-index.md) first — its **Global Constraints** apply to every task.

**Milestone goal:** A building Next.js 16 app with Node 24 tooling, locale-prefixed routing (`/en`, `/ko`), design tokens and fonts, complete UI message catalogs, metadata helpers, and a localized 404.

**Spec references:** [01-architecture.md](../specs/01-architecture.md) §1–§5, [02-design-system.md](../specs/02-design-system.md), [05-data-model.md](../specs/05-data-model.md) §6.

---

### Task 1: Toolchain, Next.js app, and locale routing

**Files:**
- Create: `.nvmrc`, `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `vitest.config.ts`, `playwright.config.ts`, `proxy.ts`
- Create: `lib/i18n/routing.ts`, `lib/i18n/navigation.ts`, `lib/i18n/request.ts`
- Create: `messages/en.json`, `messages/ko.json` (minimal; replaced in Task 3)
- Create: `app/globals.css` (minimal; replaced in Task 2), `app/[locale]/layout.tsx`, `app/[locale]/page.tsx`
- Create: `tests/unit/stubs/server-only.ts`, `tests/unit/i18n/routing.test.ts`, `tests/e2e/i18n.spec.ts`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `routing` (next-intl routing config), `type Locale = 'en' | 'ko'`, `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname` from `@/lib/i18n/navigation`; `npm` scripts `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `test:e2e`.

- [ ] **Step 1: Install Node 24 for this repo only and pin it**

```bash
source ~/.nvm/nvm.sh && nvm install 24 && nvm alias default
```
Expected: `nvm install` prints `Now using node v24.x`. `nvm alias default` must still print `default -> 20 (-> v20.19.6)` — if it changed, run `nvm alias default 20`.

Create `.nvmrc`:
```
24
```

- [ ] **Step 2: Create `package.json` and install**

```json
{
  "name": "elca-toronto-homepage",
  "version": "0.1.0",
  "private": true,
  "engines": {
    "node": ">=24"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "typecheck": "next typegen && tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "@portabletext/react": "8.0.1",
    "@portabletext/types": "4.0.2",
    "lucide-react": "1.56.0",
    "next": "16.4.0",
    "next-intl": "4.14.9",
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "server-only": "0.0.1",
    "zod": "4.6.7"
  },
  "devDependencies": {
    "@axe-core/playwright": "4.13.0",
    "@playwright/test": "1.64.0",
    "@tailwindcss/turbopack": "4.3.3",
    "@types/node": "24.19.2",
    "@types/react": "19.3.0",
    "@types/react-dom": "19.3.0",
    "eslint": "9.39.5",
    "eslint-config-next": "16.4.0",
    "tailwindcss": "4.3.3",
    "typescript": "5.9.3",
    "vitest": "5.0.4"
  }
}
```

Run: `npm install`
Expected: completes without `ERR!`. (Audit warnings are acceptable.)

Run: `npx playwright install chromium`
Expected: Chromium headless shell is present (downloads once).

- [ ] **Step 3: Add config files**

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
```

`next.config.ts`:
```ts
import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts');

const nextConfig: NextConfig = {
  // Partial Prefetching stays off: with it on, unknown [slug] paths answer 200 instead of 404.
  cacheComponents: true,
  images: {
    remotePatterns: [{protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**'}],
  },
  turbopack: {
    rules: {
      '*.css': {loaders: ['@tailwindcss/turbopack'], as: '*.css'},
    },
  },
};

export default withNextIntl(nextConfig);
```

`eslint.config.mjs`:
```js
import {defineConfig, globalIgnores} from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'test-results/**',
    'playwright-report/**',
    'blob-report/**',
  ]),
]);
```

`vitest.config.ts`:
```ts
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vitest/config';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      // `server-only` throws outside the react-server condition; unit tests run in plain Node.
      'server-only': fileURLToPath(new URL('./tests/unit/stubs/server-only.ts', import.meta.url)),
    },
  },
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
});
```

`tests/unit/stubs/server-only.ts`:
```ts
export {};
```

`playwright.config.ts`:
```ts
import {defineConfig, devices} from '@playwright/test';

const PORT = 3100;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    {name: 'desktop', use: {...devices['Desktop Chrome'], viewport: {width: 1280, height: 800}}},
    {
      name: 'mobile',
      use: {...devices['Desktop Chrome'], viewport: {width: 375, height: 812}, hasTouch: true},
    },
  ],
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}/en`,
    reuseExistingServer: false,
    timeout: 300_000,
    env: {NEXT_PUBLIC_ENABLE_UI_LAB: '1'},
  },
});
```

Append to `.gitignore`:
```
# playwright
/test-results/
/playwright-report/
/blob-report/
/playwright/.cache/
```

- [ ] **Step 4: Write the failing routing unit test**

`tests/unit/i18n/routing.test.ts`:
```ts
import {describe, expect, it} from 'vitest';
import {routing} from '@/lib/i18n/routing';

describe('routing', () => {
  it('supports English and Korean with English as default', () => {
    expect(routing.locales).toEqual(['en', 'ko']);
    expect(routing.defaultLocale).toBe('en');
  });

  it('always prefixes the locale in the URL', () => {
    expect(routing.localePrefix).toBe('always');
  });
});
```

Run: `npm run test`
Expected: FAIL — cannot resolve `@/lib/i18n/routing`.

- [ ] **Step 5: Implement locale routing**

`lib/i18n/routing.ts`:
```ts
import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ko'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];
```

`lib/i18n/navigation.ts`:
```ts
import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing';

// Locale-aware wrappers around Next.js navigation APIs. Always use these for internal links.
export const {Link, redirect, usePathname, useRouter, getPathname} = createNavigation(routing);
```

`lib/i18n/request.ts`:
```ts
import * as rootParams from 'next/root-params';
import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';

export default getRequestConfig(async ({locale}) => {
  let resolved = locale;
  if (!resolved) {
    const paramValue = await rootParams.locale();
    if (!hasLocale(routing.locales, paramValue)) notFound();
    resolved = paramValue;
  }

  return {
    locale: resolved,
    messages: (await import(`../../messages/${resolved}.json`)).default,
    timeZone: 'America/Toronto',
  };
});
```

`proxy.ts`:
```ts
import createMiddleware from 'next-intl/middleware';
import {routing} from './lib/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Skip /api, /studio (Phase 2 Sanity Studio), Next.js and Vercel internals, and any path with a file extension.
  matcher: '/((?!api|studio|_next|_vercel|.*\\..*).*)',
};
```

`messages/en.json`:
```json
{
  "Metadata": {
    "siteName": "ELCA Toronto"
  }
}
```

`messages/ko.json`:
```json
{
  "Metadata": {
    "siteName": "ELCA 토론토"
  }
}
```

`app/globals.css`:
```css
@import "tailwindcss";
```

`app/[locale]/layout.tsx`:
```tsx
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/lib/i18n/routing';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({children, params}: LayoutProps<'/[locale]'>) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
```

`app/[locale]/page.tsx`:
```tsx
import {getTranslations} from 'next-intl/server';

export default async function HomePage() {
  const t = await getTranslations('Metadata');
  return (
    <main id="main">
      <h1>{t('siteName')}</h1>
    </main>
  );
}
```

Run: `npm run test`
Expected: PASS (2 tests).

- [ ] **Step 6: Write the routing E2E test**

`tests/e2e/i18n.spec.ts`:
```ts
import {expect, test} from '@playwright/test';

test('the root URL redirects to the default locale', async ({page}) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('paths without a locale receive the default prefix', async ({page}) => {
  await page.goto('/contact');
  await expect(page).toHaveURL(/\/en\/contact$/);
});

test.describe('Korean browser', () => {
  test.use({locale: 'ko-KR'});

  test('the root URL redirects to /ko', async ({page}) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/ko$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
  });
});
```

Run: `npm run test:e2e -- tests/e2e/i18n.spec.ts`
Expected: PASS (6 = 3 tests × 2 projects). The build output lists `/en` and `/ko` as static (`○`).

- [ ] **Step 7: Typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: both exit 0. (`next typegen` generates `LayoutProps`/`PageProps` and `next/root-params` types.)

If `next dev` or `next build` created `AGENTS.md` (and/or `CLAUDE.md`) at the repo root, keep them — they are regenerated by Next.js.

- [ ] **Step 8: Commit**

```bash
git add .nvmrc .gitignore package.json package-lock.json tsconfig.json next.config.ts eslint.config.mjs vitest.config.ts playwright.config.ts proxy.ts lib messages app tests
git add AGENTS.md CLAUDE.md 2>/dev/null || true
git commit -m "$(cat <<'EOF'
chore: scaffold Next.js 16 app with Node 24 toolchain and locale routing

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Design tokens, fonts, and layout primitives

**Files:**
- Modify: `app/globals.css` (full replacement)
- Create: `lib/fonts.ts`, `lib/utils/cn.ts`, `components/layout/Container.tsx`, `components/layout/Section.tsx`
- Modify: `app/[locale]/layout.tsx`, `app/[locale]/page.tsx`
- Test: `tests/e2e/tokens.spec.ts`

**Interfaces:**
- Consumes: `routing` (Task 1).
- Produces:
  - Tailwind tokens: colors `primary primary-hover primary-deep secondary accent accent-strong background surface text muted on-primary on-primary-muted border border-strong danger danger-on-dark overlay`; fonts `font-heading font-body`; text sizes `text-display text-h2 text-h3 text-eyebrow`; widths `max-w-body max-w-heading`; radius `rounded-card rounded-button`; shadow `shadow-float`; utilities `container-page section-y`; class `.on-dark` (white focus ring inside).
  - `cn(...classes: Array<string | false | null | undefined>): string` from `@/lib/utils/cn`.
  - `fontVariables: string` from `@/lib/fonts`.
  - `<Container className? children>`; `<Section id? labelledBy? tone?: 'default' | 'surface' | 'primary' className? contained?: boolean children>`.

- [ ] **Step 1: Write the failing token E2E test**

`tests/e2e/tokens.spec.ts`:
```ts
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
```

Run: `npm run test:e2e -- tests/e2e/tokens.spec.ts`
Expected: FAIL (background is transparent/white, no fonts).

- [ ] **Step 2: Implement tokens**

`app/globals.css` (replace entirely):
```css
@import "tailwindcss";

/*
 * Design tokens — docs/specs/02-design-system.md.
 * These are prototype values and may change with the designer's work.
 * Only this file and components/ui/* make visual decisions.
 */
@theme static {
  --color-primary: #17324d;
  --color-primary-hover: #10263b;
  --color-primary-deep: #10263b;
  --color-secondary: #406a72;
  --color-accent: #b85b35;
  --color-accent-strong: #a14e2c;
  --color-background: #f9faf8;
  --color-surface: #ffffff;
  --color-text: #17232b;
  --color-muted: #65727c;
  --color-on-primary: #ffffff;
  --color-on-primary-muted: #b9c1ca;
  --color-border: #e3e8e5;
  --color-border-strong: #8a959c;
  --color-danger: #b42318;
  --color-danger-on-dark: #fda29b;
  --color-overlay: rgb(23 35 43 / 0.72);

  --font-heading: var(--font-manrope), var(--font-noto-kr), ui-sans-serif, system-ui, sans-serif;
  --font-body: var(--font-inter), var(--font-noto-kr), ui-sans-serif, system-ui, sans-serif;

  --text-display: clamp(2.25rem, 1.5rem + 3vw, 3.75rem);
  --text-display--line-height: 1.1;
  --text-display--letter-spacing: -0.03em;
  --text-h2: clamp(1.75rem, 1.4rem + 1.5vw, 2.5rem);
  --text-h2--line-height: 1.15;
  --text-h2--letter-spacing: -0.02em;
  --text-h3: clamp(1.375rem, 1.25rem + 0.4vw, 1.5rem);
  --text-h3--line-height: 1.2;
  --text-h3--letter-spacing: -0.02em;
  --text-eyebrow: 0.8125rem;
  --text-eyebrow--line-height: 1.4;
  --text-eyebrow--letter-spacing: 0.06em;

  --container-body: 42.5rem;
  --container-heading: 56.25rem;

  --radius-card: 0.5rem;
  --radius-button: 0.375rem;

  --shadow-float: 0 0.25rem 1rem rgb(23 35 43 / 0.12);
}

/* Page container: max 1280px, side padding 20 / 32 / 48px */
@utility container-page {
  margin-inline: auto;
  width: 100%;
  max-width: 80rem;
  padding-inline: 1.25rem;
  @media (width >= 40rem) {
    padding-inline: 2rem;
  }
  @media (width >= 64rem) {
    padding-inline: 3rem;
  }
}

/* Section vertical rhythm: 56 / 72 / 96px */
@utility section-y {
  padding-block: 3.5rem;
  @media (width >= 40rem) {
    padding-block: 4.5rem;
  }
  @media (width >= 64rem) {
    padding-block: 6rem;
  }
}

@layer base {
  html[lang="ko"] {
    --font-body: var(--font-noto-kr), var(--font-inter), ui-sans-serif, system-ui, sans-serif;
    --text-display--letter-spacing: -0.01em;
    --text-h2--letter-spacing: -0.01em;
    --text-h3--letter-spacing: -0.01em;
    word-break: keep-all;
  }

  body {
    background-color: var(--color-background);
    color: var(--color-text);
    font-family: var(--font-body);
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
  }

  h1,
  h2,
  h3,
  h4 {
    font-family: var(--font-heading);
  }

  :focus-visible {
    outline: 2px solid var(--color-secondary);
    outline-offset: 2px;
  }

  .on-dark :focus-visible {
    outline-color: var(--color-on-primary);
  }

  [id] {
    scroll-margin-top: 1.5rem;
  }

  @media (prefers-reduced-motion: no-preference) {
    html {
      scroll-behavior: smooth;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}
```

`lib/fonts.ts`:
```ts
import {Inter, Manrope, Noto_Sans_KR} from 'next/font/google';

const inter = Inter({subsets: ['latin'], variable: '--font-inter', display: 'swap'});
const manrope = Manrope({subsets: ['latin'], variable: '--font-manrope', display: 'swap'});
// Korean glyphs are split into many unicode-range files; do not preload them all.
const notoKr = Noto_Sans_KR({subsets: ['latin'], variable: '--font-noto-kr', display: 'swap', preload: false});

export const fontVariables = `${inter.variable} ${manrope.variable} ${notoKr.variable}`;
```

`lib/utils/cn.ts`:
```ts
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
```

`components/layout/Container.tsx`:
```tsx
import type {ReactNode} from 'react';
import {cn} from '@/lib/utils/cn';

export function Container({className, children}: {className?: string; children: ReactNode}) {
  return <div className={cn('container-page', className)}>{children}</div>;
}
```

`components/layout/Section.tsx`:
```tsx
import type {ReactNode} from 'react';
import {cn} from '@/lib/utils/cn';
import {Container} from './Container';

export type SectionTone = 'default' | 'surface' | 'primary';

const toneClasses: Record<SectionTone, string> = {
  default: 'bg-background',
  surface: 'bg-surface',
  primary: 'on-dark bg-primary text-on-primary',
};

type SectionProps = {
  id?: string;
  labelledBy?: string;
  tone?: SectionTone;
  className?: string;
  /** Wrap children in the page container (default true). */
  contained?: boolean;
  children: ReactNode;
};

export function Section({id, labelledBy, tone = 'default', className, contained = true, children}: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn('section-y', toneClasses[tone], className)}>
      {contained ? <Container>{children}</Container> : children}
    </section>
  );
}
```

`app/[locale]/layout.tsx` (replace):
```tsx
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {fontVariables} from '@/lib/fonts';
import {routing} from '@/lib/i18n/routing';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({children, params}: LayoutProps<'/[locale]'>) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html lang={locale} className={fontVariables}>
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider>
          <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

`app/[locale]/page.tsx` (replace; Home is rebuilt in M4):
```tsx
import {getTranslations} from 'next-intl/server';
import {Section} from '@/components/layout/Section';

export default async function HomePage() {
  const t = await getTranslations('Metadata');
  return (
    <Section>
      <h1 className="max-w-heading font-heading text-display font-extrabold text-text">{t('siteName')}</h1>
    </Section>
  );
}
```

- [ ] **Step 3: Run the token test**

Run: `npm run test:e2e -- tests/e2e/tokens.spec.ts tests/e2e/i18n.spec.ts`
Expected: PASS (all tests in both projects).

- [ ] **Step 4: Typecheck, lint, commit**

Run: `npm run typecheck && npm run lint`
Expected: exit 0.

```bash
git add app lib components tests
git commit -m "$(cat <<'EOF'
feat: add design tokens, fonts, and layout primitives

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Message catalogs, metadata helpers, and localized 404

**Files:**
- Modify: `messages/en.json`, `messages/ko.json` (full replacement — final catalogs used by all later tasks)
- Create: `lib/i18n/locale.ts`, `lib/i18n/paths.ts`, `lib/i18n/metadata.ts`, `lib/utils/site.ts`
- Create: `app/[locale]/not-found.tsx`, `app/[locale]/[...rest]/page.tsx`
- Modify: `app/[locale]/layout.tsx` (add `generateMetadata`)
- Test: `tests/unit/i18n/messages.test.ts`, `tests/unit/i18n/paths.test.ts`, `tests/unit/i18n/metadata.test.ts`, `tests/e2e/i18n.spec.ts` (extend)

**Interfaces:**
- Consumes: `routing`, `Locale` (Task 1).
- Produces:
  - `assertLocale(value: string): Locale` — calls `notFound()` for unsupported values.
  - `localizedPath(locale: string, path: string): string` — `('en', '/') → '/en'`, `('ko', '/about') → '/ko/about'`.
  - `siteUrl(): string` — `NEXT_PUBLIC_SITE_URL` without trailing slash, default `http://localhost:3000`.
  - `buildPageMetadata(input: {locale: string; path: string; title: string; description: string; image?: {url: string; width: number; height: number; alt: string}}): Metadata`.
  - Message namespaces (exact keys below): `Metadata Common Nav Footer Newsletter Forms Errors Carousel Mentors Events Donate Reports Mentorship Contact NotFound`.

- [ ] **Step 1: Write failing unit tests**

`tests/unit/i18n/messages.test.ts`:
```ts
import {describe, expect, it} from 'vitest';
import en from '@/messages/en.json';
import ko from '@/messages/ko.json';

function keyPaths(value: unknown, prefix = ''): string[] {
  if (value === null || typeof value !== 'object') return [prefix];
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    keyPaths(child, prefix ? `${prefix}.${key}` : key),
  );
}

function leafValues(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (value === null || typeof value !== 'object') return [];
  return Object.values(value as Record<string, unknown>).flatMap(leafValues);
}

describe('message catalogs', () => {
  it('have identical key sets in English and Korean', () => {
    expect(keyPaths(ko).sort()).toEqual(keyPaths(en).sort());
  });

  it('contain no blank strings', () => {
    for (const text of [...leafValues(en), ...leafValues(ko)]) {
      expect(text.trim()).not.toBe('');
    }
  });

  it('cover every namespace used by the app', () => {
    expect(Object.keys(en).sort()).toEqual(
      [
        'Carousel', 'Common', 'Contact', 'Donate', 'Errors', 'Events', 'Footer', 'Forms',
        'Mentors', 'Mentorship', 'Metadata', 'Nav', 'Newsletter', 'NotFound', 'Reports',
      ].sort(),
    );
  });
});
```

`tests/unit/i18n/paths.test.ts`:
```ts
import {describe, expect, it} from 'vitest';
import {localizedPath} from '@/lib/i18n/paths';

describe('localizedPath', () => {
  it('maps the home path to the bare locale prefix', () => {
    expect(localizedPath('en', '/')).toBe('/en');
    expect(localizedPath('ko', '/')).toBe('/ko');
  });

  it('prefixes nested paths', () => {
    expect(localizedPath('ko', '/get-involved/donate')).toBe('/ko/get-involved/donate');
  });
});
```

`tests/unit/i18n/metadata.test.ts`:
```ts
import {describe, expect, it} from 'vitest';
import {buildPageMetadata} from '@/lib/i18n/metadata';

describe('buildPageMetadata', () => {
  const metadata = buildPageMetadata({
    locale: 'ko',
    path: '/about',
    title: 'ELCA 소개',
    description: '설명',
  });

  it('sets a canonical URL for the current locale', () => {
    expect(metadata.alternates?.canonical).toBe('/ko/about');
  });

  it('lists every locale plus x-default as alternates', () => {
    expect(metadata.alternates?.languages).toEqual({
      en: '/en/about',
      ko: '/ko/about',
      'x-default': '/en/about',
    });
  });

  it('uses the Korean Open Graph locale', () => {
    expect(metadata.openGraph).toMatchObject({locale: 'ko_KR', title: 'ELCA 소개', url: '/ko/about'});
  });

  it('adds an Open Graph image when provided', () => {
    const withImage = buildPageMetadata({
      locale: 'en',
      path: '/',
      title: 'Home',
      description: 'd',
      image: {url: 'https://images.unsplash.com/x', width: 1200, height: 800, alt: 'A photo'},
    });
    expect(withImage.openGraph?.images).toEqual([
      {url: 'https://images.unsplash.com/x', width: 1200, height: 800, alt: 'A photo'},
    ]);
  });
});
```

Run: `npm run test`
Expected: FAIL — `paths`/`metadata` modules missing; message key test fails.

- [ ] **Step 2: Write the final message catalogs**

`messages/en.json` (replace):
```json
{
  "Metadata": {
    "siteName": "ELCA Toronto",
    "defaultTitle": "ELCA Toronto — Mentorship, Leadership & Community",
    "titleTemplate": "%s | ELCA Toronto",
    "defaultDescription": "Connecting people through mentorship, leadership, and community."
  },
  "Common": {
    "skipToContent": "Skip to content",
    "homeLabel": "ELCA Toronto home",
    "close": "Close",
    "previous": "Previous",
    "next": "Next",
    "loadMore": "Load more",
    "sample": "Sample",
    "needsReview": "Needs review",
    "demo": "Demo",
    "opensInNewTab": "(opens in a new tab)",
    "backToTop": "Back to top",
    "openContact": "Open the contact page",
    "breadcrumb": "Breadcrumb",
    "scrollerLabel": "{label} — scroll for more"
  },
  "Nav": {
    "primaryLabel": "Main",
    "mobileTitle": "Menu",
    "openMenu": "Open menu",
    "home": "Home",
    "about": "About ELCA",
    "aboutOverview": "About ELCA",
    "reports": "Reports",
    "getInvolved": "Get Involved",
    "mentorship": "Mentorship",
    "mentors": "Mentors",
    "donate": "Donate",
    "eventsNews": "Events & News",
    "contact": "Contact Us",
    "languageLabel": "Language",
    "langEn": "English",
    "langKo": "한국어"
  },
  "Footer": {
    "explore": "Explore",
    "getInvolved": "Get Involved",
    "stayConnected": "Stay Connected",
    "social": "Social media",
    "facebook": "ELCA on Facebook",
    "linkedin": "ELCA on LinkedIn",
    "email": "Email",
    "copyright": "© {year} ELCA. All rights reserved.",
    "privacy": "Privacy Policy",
    "privacyNote": "(coming soon)"
  },
  "Newsletter": {
    "label": "Email address",
    "placeholder": "you@example.com",
    "submit": "Subscribe",
    "demoNotice": "This is a demo. No subscription was created."
  },
  "Forms": {
    "required": "required",
    "optional": "optional",
    "submit": "Submit (Demo)",
    "demoSuccess": "Demo — nothing was sent. Your input passed validation.",
    "errorSummary": "Please fix the highlighted fields.",
    "characterCount": "{count} / {max}",
    "selectPlaceholder": "Select an option",
    "fields": {
      "name": "Full name",
      "email": "Email",
      "topic": "Topic",
      "message": "Message",
      "school": "School and grade (or program)",
      "interests": "Areas of interest",
      "motivation": "Why do you want to join?",
      "cohort": "ELCA cohort (if any)",
      "question": "Questions for the organizers",
      "eventType": "Event type",
      "title": "Event title",
      "preferredDate": "Preferred timing",
      "format": "Format",
      "description": "Description",
      "requestTopic": "Topic you would like",
      "details": "Your request or question"
    },
    "topics": {
      "general": "General inquiry",
      "mentorship": "Mentorship",
      "mentor": "Become a Mentor",
      "donation": "Donation",
      "event": "Events",
      "partnership": "Partnership"
    },
    "interests": {
      "business": "Business & entrepreneurship",
      "technology": "Technology",
      "healthcare": "Healthcare",
      "law": "Law",
      "finance": "Finance & accounting",
      "engineering": "Engineering",
      "arts": "Arts & design",
      "other": "Other"
    },
    "eventTypes": {
      "workshop": "Workshop",
      "seminar": "Seminar",
      "networking": "Networking",
      "other": "Other"
    },
    "formats": {
      "online": "Online",
      "in-person": "In person",
      "hybrid": "Hybrid"
    }
  },
  "Errors": {
    "required": "This field is required.",
    "email": "Enter a valid email address.",
    "tooLong": "This is too long.",
    "min": "The minimum amount is $5.",
    "max": "The maximum amount is $10,000.",
    "integer": "Enter a whole-dollar amount.",
    "number": "Enter a number."
  },
  "Carousel": {
    "label": "Highlights",
    "slideLabel": "{index} of {total}",
    "previous": "Previous slide",
    "next": "Next slide",
    "pause": "Pause slideshow",
    "play": "Play slideshow",
    "goTo": "Go to slide {index}"
  },
  "Mentors": {
    "viewProfile": "View profile",
    "location": "Location",
    "cohort": "ELCA cohort",
    "expertise": "Expertise",
    "linkedin": "LinkedIn profile",
    "searchLabel": "Search mentors by name",
    "searchPlaceholder": "e.g. Jiwon Kim or 김지원",
    "resultCount": "{count, plural, =0 {No mentors found} one {# mentor} other {# mentors}}",
    "emptyTitle": "No mentors match your search",
    "emptyBody": "Try a different spelling, or search in English or Korean.",
    "clearSearch": "Clear search",
    "listLabel": "Featured mentors"
  },
  "Events": {
    "tabsLabel": "Filter by category",
    "categories": {
      "all": "All",
      "workshops": "Workshops",
      "events": "Events",
      "stories": "Stories",
      "news": "News"
    },
    "location": {
      "online": "Online",
      "in-person": "In person",
      "hybrid": "Hybrid"
    },
    "status": {
      "upcoming": "Upcoming",
      "past": "Past"
    },
    "timelineNow": "Today",
    "detailsRegister": "Details & register",
    "readMore": "Read more",
    "emptyTitle": "Nothing here yet",
    "emptyBody": "Try another category.",
    "openPhoto": "Open photo: {alt}",
    "viewEvent": "View event",
    "byAuthor": "By {author}",
    "when": "When",
    "where": "Where",
    "audience": "Who it’s for",
    "capacity": "Capacity",
    "capacityValue": "{count} people",
    "agenda": "Agenda",
    "register": "Register for this event",
    "registerIntro": "This registration form is a demo. Nothing will be sent.",
    "registerSubmit": "Register (Demo)",
    "recap": "Event recap",
    "related": "Related",
    "galleryLabel": "Event photos",
    "hostTab": "Host an Event",
    "requestTab": "Request an Event",
    "formsTabsLabel": "Event forms",
    "questionsTitle": "Event Q&A"
  },
  "Donate": {
    "frequency": "Frequency",
    "oneTime": "One-time",
    "monthly": "Monthly",
    "amount": "Amount",
    "other": "Other",
    "otherAmount": "Other amount (CAD)",
    "summary": "You are giving {amount}{frequency, select, monthly { every month} other {}}.",
    "summaryEmpty": "Choose an amount to see your impact.",
    "optionalDetails": "Your details (optional)",
    "continue": "Continue (Demo)",
    "noPayment": "Demo — no payment was processed."
  },
  "Reports": {
    "tabsLabel": "Report type",
    "financial": "Financial Statements",
    "annual": "Annual Reports",
    "download": "Download PDF",
    "unavailable": "Sample — file not available",
    "emptyTitle": "No reports yet"
  },
  "Mentorship": {
    "applyNow": "Apply Now (Demo)",
    "applyTitle": "Mentee application (Demo)",
    "nextCohort": "Next cohort",
    "deadline": "Deadline"
  },
  "Contact": {
    "email": "Email",
    "location": "Location",
    "social": "Social media",
    "mapPlaceholder": "Map placeholder — no external map is loaded in this prototype.",
    "send": "Send Message (Demo)"
  },
  "NotFound": {
    "title": "Page not found",
    "body": "The page you are looking for does not exist or has moved.",
    "backHome": "Back to home"
  }
}
```

`messages/ko.json` (replace):
```json
{
  "Metadata": {
    "siteName": "ELCA 토론토",
    "defaultTitle": "ELCA 토론토 — 멘토십 · 리더십 · 커뮤니티",
    "titleTemplate": "%s | ELCA 토론토",
    "defaultDescription": "멘토십과 리더십, 그리고 커뮤니티로 사람을 잇습니다."
  },
  "Common": {
    "skipToContent": "본문으로 건너뛰기",
    "homeLabel": "ELCA 토론토 홈",
    "close": "닫기",
    "previous": "이전",
    "next": "다음",
    "loadMore": "더 보기",
    "sample": "샘플",
    "needsReview": "검수 필요",
    "demo": "데모",
    "opensInNewTab": "(새 탭에서 열림)",
    "backToTop": "맨 위로",
    "openContact": "문의 페이지로 이동",
    "breadcrumb": "현재 위치",
    "scrollerLabel": "{label} — 옆으로 스크롤하여 더 보기"
  },
  "Nav": {
    "primaryLabel": "주요 메뉴",
    "mobileTitle": "메뉴",
    "openMenu": "메뉴 열기",
    "home": "홈",
    "about": "ELCA 소개",
    "aboutOverview": "ELCA 소개",
    "reports": "보고서",
    "getInvolved": "참여하기",
    "mentorship": "멘토십",
    "mentors": "멘토",
    "donate": "후원하기",
    "eventsNews": "이벤트 & 소식",
    "contact": "문의하기",
    "languageLabel": "언어",
    "langEn": "English",
    "langKo": "한국어"
  },
  "Footer": {
    "explore": "둘러보기",
    "getInvolved": "참여하기",
    "stayConnected": "소식 받기",
    "social": "소셜 미디어",
    "facebook": "ELCA 페이스북",
    "linkedin": "ELCA 링크드인",
    "email": "이메일",
    "copyright": "© {year} ELCA. All rights reserved.",
    "privacy": "개인정보처리방침",
    "privacyNote": "(준비 중)"
  },
  "Newsletter": {
    "label": "이메일 주소",
    "placeholder": "you@example.com",
    "submit": "구독하기",
    "demoNotice": "데모 화면입니다. 실제로 구독되지 않았습니다."
  },
  "Forms": {
    "required": "필수",
    "optional": "선택",
    "submit": "제출하기 (데모)",
    "demoSuccess": "데모 — 아무것도 전송되지 않았습니다. 입력값 검증을 통과했습니다.",
    "errorSummary": "표시된 항목을 확인해 주세요.",
    "characterCount": "{count} / {max}",
    "selectPlaceholder": "선택해 주세요",
    "fields": {
      "name": "이름",
      "email": "이메일",
      "topic": "문의 주제",
      "message": "메시지",
      "school": "학교와 학년 (또는 소속)",
      "interests": "관심 분야",
      "motivation": "지원 동기",
      "cohort": "ELCA 기수 (해당 시)",
      "question": "운영진에게 묻고 싶은 점",
      "eventType": "행사 유형",
      "title": "행사 제목",
      "preferredDate": "희망 시기",
      "format": "진행 방식",
      "description": "행사 설명",
      "requestTopic": "원하는 주제",
      "details": "요청 내용 또는 질문"
    },
    "topics": {
      "general": "일반 문의",
      "mentorship": "멘토십",
      "mentor": "멘토 지원",
      "donation": "후원",
      "event": "행사",
      "partnership": "파트너십"
    },
    "interests": {
      "business": "비즈니스 · 창업",
      "technology": "테크",
      "healthcare": "헬스케어",
      "law": "법률",
      "finance": "금융 · 회계",
      "engineering": "엔지니어링",
      "arts": "예술 · 디자인",
      "other": "기타"
    },
    "eventTypes": {
      "workshop": "워크숍",
      "seminar": "세미나",
      "networking": "네트워킹",
      "other": "기타"
    },
    "formats": {
      "online": "온라인",
      "in-person": "대면",
      "hybrid": "하이브리드"
    }
  },
  "Errors": {
    "required": "필수 입력 항목입니다.",
    "email": "올바른 이메일 주소를 입력해 주세요.",
    "tooLong": "입력 내용이 너무 깁니다.",
    "min": "최소 후원 금액은 $5입니다.",
    "max": "최대 후원 금액은 $10,000입니다.",
    "integer": "달러 단위의 정수로 입력해 주세요.",
    "number": "숫자를 입력해 주세요."
  },
  "Carousel": {
    "label": "주요 소식",
    "slideLabel": "{total}개 중 {index}번째",
    "previous": "이전 슬라이드",
    "next": "다음 슬라이드",
    "pause": "슬라이드 일시정지",
    "play": "슬라이드 재생",
    "goTo": "{index}번째 슬라이드로 이동"
  },
  "Mentors": {
    "viewProfile": "프로필 보기",
    "location": "지역",
    "cohort": "ELCA 기수",
    "expertise": "전문 분야",
    "linkedin": "링크드인 프로필",
    "searchLabel": "멘토 이름으로 검색",
    "searchPlaceholder": "예: 김지원 또는 Jiwon Kim",
    "resultCount": "{count, plural, =0 {검색된 멘토가 없습니다} other {멘토 #명}}",
    "emptyTitle": "검색 결과가 없습니다",
    "emptyBody": "철자를 확인하거나 영문 또는 한글 이름으로 검색해 보세요.",
    "clearSearch": "검색어 지우기",
    "listLabel": "추천 멘토"
  },
  "Events": {
    "tabsLabel": "카테고리로 보기",
    "categories": {
      "all": "전체",
      "workshops": "워크숍",
      "events": "행사",
      "stories": "이야기",
      "news": "소식"
    },
    "location": {
      "online": "온라인",
      "in-person": "대면",
      "hybrid": "하이브리드"
    },
    "status": {
      "upcoming": "예정",
      "past": "지난 행사"
    },
    "timelineNow": "오늘",
    "detailsRegister": "자세히 보기 · 신청",
    "readMore": "더 읽기",
    "emptyTitle": "아직 등록된 항목이 없습니다",
    "emptyBody": "다른 카테고리를 선택해 보세요.",
    "openPhoto": "사진 크게 보기: {alt}",
    "viewEvent": "행사 보기",
    "byAuthor": "글 {author}",
    "when": "일시",
    "where": "장소",
    "audience": "대상",
    "capacity": "정원",
    "capacityValue": "{count}명",
    "agenda": "진행 순서",
    "register": "행사 참가 신청",
    "registerIntro": "데모 신청 양식입니다. 입력한 내용은 전송되지 않습니다.",
    "registerSubmit": "신청하기 (데모)",
    "recap": "행사 돌아보기",
    "related": "관련 글",
    "galleryLabel": "행사 사진",
    "hostTab": "행사 개설 제안",
    "requestTab": "행사 요청",
    "formsTabsLabel": "행사 양식",
    "questionsTitle": "행사 Q&A"
  },
  "Donate": {
    "frequency": "후원 방식",
    "oneTime": "일시 후원",
    "monthly": "월 정기",
    "amount": "금액",
    "other": "직접 입력",
    "otherAmount": "직접 입력 금액 (CAD)",
    "summary": "{frequency, select, monthly {매월 } other {}}{amount}을 후원합니다.",
    "summaryEmpty": "금액을 선택하면 후원의 효과를 볼 수 있어요.",
    "optionalDetails": "후원자 정보 (선택)",
    "continue": "다음 (데모)",
    "noPayment": "데모 — 실제 결제는 진행되지 않았습니다."
  },
  "Reports": {
    "tabsLabel": "보고서 종류",
    "financial": "재무제표",
    "annual": "연차 보고서",
    "download": "PDF 다운로드",
    "unavailable": "샘플 — 파일 없음",
    "emptyTitle": "등록된 보고서가 없습니다"
  },
  "Mentorship": {
    "applyNow": "지금 지원하기 (데모)",
    "applyTitle": "멘티 지원서 (데모)",
    "nextCohort": "다음 기수",
    "deadline": "마감"
  },
  "Contact": {
    "email": "이메일",
    "location": "위치",
    "social": "소셜 미디어",
    "mapPlaceholder": "지도 자리 — 이 시안에서는 외부 지도를 불러오지 않습니다.",
    "send": "메시지 보내기 (데모)"
  },
  "NotFound": {
    "title": "페이지를 찾을 수 없습니다",
    "body": "찾으시는 페이지가 없거나 주소가 바뀌었습니다.",
    "backHome": "홈으로 돌아가기"
  }
}
```

- [ ] **Step 3: Implement helpers**

`lib/i18n/locale.ts`:
```ts
import {hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing, type Locale} from './routing';

/** Narrows a route param to a supported locale, or renders the 404 page. */
export function assertLocale(value: string): Locale {
  if (!hasLocale(routing.locales, value)) notFound();
  return value;
}
```

`lib/i18n/paths.ts`:
```ts
/** Builds the public URL path for a locale-less app path. */
export function localizedPath(locale: string, path: string): string {
  return `/${locale}${path === '/' ? '' : path}`;
}
```

`lib/utils/site.ts`:
```ts
export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
}
```

`lib/i18n/metadata.ts`:
```ts
import type {Metadata} from 'next';
import {localizedPath} from './paths';
import {routing} from './routing';

type MetadataImage = {url: string; width: number; height: number; alt: string};

type PageMetadataInput = {
  locale: string;
  /** Locale-less app path, e.g. '/about' */
  path: string;
  title: string;
  description: string;
  image?: MetadataImage;
};

export function buildPageMetadata({locale, path, title, description, image}: PageMetadataInput): Metadata {
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [l, localizedPath(l, path)]),
  );
  languages['x-default'] = localizedPath(routing.defaultLocale, path);

  return {
    title,
    description,
    alternates: {canonical: localizedPath(locale, path), languages},
    openGraph: {
      type: 'website',
      siteName: 'ELCA Toronto',
      title,
      description,
      url: localizedPath(locale, path),
      locale: locale === 'ko' ? 'ko_KR' : 'en_CA',
      images: image ? [{url: image.url, width: image.width, height: image.height, alt: image.alt}] : undefined,
    },
  };
}
```

Run: `npm run test`
Expected: PASS (all unit tests).

- [ ] **Step 4: Add layout metadata, 404 page, and catch-all route**

In `app/[locale]/layout.tsx`, add these imports and the `generateMetadata` export above `generateStaticParams` (keep the rest of the file):
```tsx
import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {siteUrl} from '@/lib/utils/site';

export async function generateMetadata({params}: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({locale, namespace: 'Metadata'});
  return {
    metadataBase: new URL(siteUrl()),
    title: {default: t('defaultTitle'), template: t('titleTemplate')},
    description: t('defaultDescription'),
  };
}
```

`app/[locale]/not-found.tsx`:
```tsx
import {useTranslations} from 'next-intl';
import {Section} from '@/components/layout/Section';
import {Link} from '@/lib/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('NotFound');
  return (
    <Section>
      <div className="flex max-w-body flex-col gap-4">
        <h1 className="font-heading text-display font-extrabold text-text">{t('title')}</h1>
        <p className="text-lg text-muted">{t('body')}</p>
        <p>
          <Link href="/" className="font-semibold text-secondary underline underline-offset-4">
            {t('backHome')}
          </Link>
        </p>
      </div>
    </Section>
  );
}
```
(The link is upgraded to `Button` in Task 9.)

`app/[locale]/[...rest]/page.tsx`:
```tsx
import {notFound} from 'next/navigation';

// Unknown paths under a valid locale render the localized 404 page.
export default function CatchAllPage() {
  notFound();
}
```

- [ ] **Step 5: Extend the i18n E2E test**

Append to `tests/e2e/i18n.spec.ts`:
```ts
test('unknown paths render a localized 404 with status 404', async ({page}) => {
  const en = await page.goto('/en/this-page-does-not-exist');
  expect(en?.status()).toBe(404);
  await expect(page.getByRole('heading', {level: 1, name: 'Page not found'})).toBeVisible();

  const ko = await page.goto('/ko/no/such/page');
  expect(ko?.status()).toBe(404);
  await expect(page.getByRole('heading', {level: 1, name: '페이지를 찾을 수 없습니다'})).toBeVisible();
});

test('pages get the default localized title', async ({page}) => {
  await page.goto('/ko');
  await expect(page).toHaveTitle('ELCA 토론토 — 멘토십 · 리더십 · 커뮤니티');
});
```

Run: `npm run test:e2e -- tests/e2e/i18n.spec.ts tests/e2e/tokens.spec.ts`
Expected: PASS.

- [ ] **Step 6: Typecheck, lint, commit**

Run: `npm run typecheck && npm run lint && npm run test`
Expected: exit 0.

```bash
git add app lib messages tests
git commit -m "$(cat <<'EOF'
feat: add message catalogs, metadata helpers, and localized 404

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

# ELCA Toronto — Website (Phase 1 prototype)

Front-end prototype of the ELCA (Entrepreneurial Leadership Canada) website: Next.js 16 App Router,
EN/KO, mock data shaped for a future Sanity CMS. Design specs live in [`docs/`](docs/README.md).

> All people, numbers, sponsors, and reports are **samples** (marked "Sample"). Facts taken from the
> previous site are marked "Needs review". Forms are **demos** — nothing is sent anywhere.

## Requirements

- **Node 24** (pinned in `.nvmrc`). This repo does not change your global default; other repos keep
  whatever Node default you have (`nvm use` applies per shell):
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
| `npm run test` | Unit tests (Vitest, configured in `vitest.config.mts`) |
| `npm run test:e2e` | Builds, starts on :3100, runs Playwright (desktop 1280 + mobile 375) |

First E2E run: `npx playwright install chromium`.

E2E specs must import `{test, expect}` from `tests/e2e/fixtures.ts`, not from `@playwright/test`.
Its `page.goto` waits for `<html data-hydrated="true">`, which `components/layout/HydrationMarker.tsx`
sets after hydration, so tests never interact with a page before React is ready. `page.reload()` does
not wait; wait for `html[data-hydrated="true"]` yourself after a reload.

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
tests/unit, tests/e2e Vitest and Playwright (e2e fixtures in tests/e2e/fixtures.ts)
```

## Editing content

- Text editors would change in a CMS → `data/mock/**` (both `en` and `ko`; a missing `ko` falls back to `en`).
- Button labels, form labels, errors → `messages/*.json` (keep keys identical in both files).
- Images → `data/mock/images.ts` (Unsplash stand-ins; replace with real photos).
- Design tokens → `app/globals.css` (`@theme`). Designer updates should only touch this file and `components/ui/*`.

## Known limitations

- **Event status is computed when a page is rendered.** Mock events are dated 2026-11 → 2027-03 (upcoming)
  and 2024-11 → 2026-06 (past). Builds outside that window will show different upcoming/past splits.
- No CMS, deployment, auth, payments, email, or subscriptions (see `docs/specs/06-roadmap-sanity-vercel.md`).
- Social icons are lettermarks; the logo is a text wordmark.

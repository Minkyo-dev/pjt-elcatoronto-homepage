# Phase 1 · M5 About, Reports, Mentorship, Donate, Contact (Tasks 16–20)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Read [the index](2026-10-13-phase1-00-index.md) first — its **Global Constraints** apply to every task.

**Milestone goal:** Five content pages, each with its hero, sections, demo forms, and FAQ.

**Spec references:** [04-pages.md](../specs/04-pages.md) §2–§6 and §9, [03-layout-and-components.md](../specs/03-layout-and-components.md) §5 (form rules).

**Page pattern** (every page in this milestone follows it):
```tsx
export async function generateMetadata({params}: PageProps<'/[locale]/…'>): Promise<Metadata> {
  const locale = assertLocale((await params).locale);
  const page = await getXxxPage(locale);
  return buildPageMetadata({locale, path: '/…', title: page.seo.title, description: page.seo.description});
}
```
The page component awaits `params`, calls `assertLocale`, fetches with `Promise.all`, and renders `Hero` (which owns the page's only `h1`, id `page-title`) followed by `Section`s whose `h2` ids match their `labelledBy`.

---

### Task 16: Hero, CTA section, history timeline, team grid — About page

**Files:**
- Create: `components/sections/Hero.tsx`, `components/sections/CTASection.tsx`, `components/sections/HistoryTimeline.tsx`, `components/sections/TeamGrid.tsx`
- Create: `app/[locale]/about/page.tsx`
- Test: `tests/e2e/about.spec.ts`

**Interfaces:**
- Consumes: `getAboutPage`, `getCoreValues`, `getHistory`, `getStats`, `getTeamMembers`, `getFaqs` (Task 8); section components from M4.
- Produces:
  - `Hero({hero: PageHeroView; variant?: 'typography' | 'photo'})` — `h1#page-title`; first CTA `primary` (`inverse` on photo), second `secondary` (`on-dark` on photo).
  - `CTASection({id: string; block: CtaBlockView})` — a light (surface) band so it does not merge with the navy pre-footer.
  - `HistoryTimeline({entries: HistoryEntry[]})`, `TeamGrid({members: TeamMember[]})`.

- [ ] **Step 1: Write the failing E2E test**

`tests/e2e/about.spec.ts`:
```ts
import {expect, test} from '@playwright/test';

test.describe('about page', () => {
  test('introduces ELCA with a hero and CTA', async ({page}) => {
    await page.goto('/en/about');
    await expect(page).toHaveTitle('About ELCA | ELCA Toronto');
    await expect(page.getByRole('heading', {level: 1, name: 'A community built on mentorship'})).toBeVisible();
    await expect(page.locator('main').getByRole('link', {name: 'Get Involved'}).first()).toHaveAttribute(
      'href',
      '/en/get-involved/mentorship',
    );
  });

  test('shows purpose, values, mission and vision', async ({page}) => {
    await page.goto('/en/about');
    const purpose = page.getByRole('region', {name: 'Why we exist'});
    await expect(purpose.getByRole('heading', {level: 3})).toHaveCount(4);
    await expect(page.getByRole('heading', {level: 2, name: 'Mission'})).toBeVisible();
    await expect(page.getByRole('heading', {level: 2, name: 'Vision'})).toBeVisible();
  });

  test('lists the story, impact, and sample team', async ({page}) => {
    await page.goto('/en/about');
    const story = page.getByRole('region', {name: 'From a small circle to a growing community'});
    await expect(story.getByRole('listitem')).toHaveCount(6);
    await expect(story).toContainText('2019');

    const impact = page.getByRole('region', {name: 'Growth we can see'});
    await expect(impact.locator('dl > div')).toHaveCount(4);

    const team = page.getByRole('region', {name: 'The people behind ELCA'});
    await expect(team.getByRole('listitem')).toHaveCount(6);
    await expect(team.getByText('Sample', {exact: true}).first()).toBeVisible();
  });

  test('links to reports and ends with FAQ and CTA', async ({page}) => {
    await page.goto('/en/about');
    await expect(page.getByRole('link', {name: 'View Reports'})).toHaveAttribute('href', '/en/about/reports');
    await expect(page.getByRole('region', {name: 'Questions about ELCA'}).locator('details')).toHaveCount(4);
    const cta = page.getByRole('region', {name: 'Ready to get involved?'});
    await expect(cta.getByRole('link', {name: 'Donate'})).toHaveAttribute('href', '/en/get-involved/donate');
  });

  test('is localized', async ({page}) => {
    await page.goto('/ko/about');
    await expect(page.getByRole('heading', {level: 1, name: '멘토십으로 이어진 커뮤니티'})).toBeVisible();
  });
});
```

Run: `npm run test:e2e -- tests/e2e/about.spec.ts`
Expected: FAIL (404).

- [ ] **Step 2: Implement shared sections**

`components/sections/Hero.tsx`:
```tsx
import Image from 'next/image';
import {Container} from '@/components/layout/Container';
import {Button} from '@/components/ui/Button';
import {cn} from '@/lib/utils/cn';
import type {CtaView, PageHeroView} from '@/types/common';

type HeroProps = {hero: PageHeroView; variant?: 'typography' | 'photo'};

function HeroBody({hero, dark}: {hero: PageHeroView; dark: boolean}) {
  const ctas = [hero.cta, hero.secondaryCta].filter((cta): cta is CtaView => Boolean(cta));
  return (
    <>
      {hero.eyebrow ? (
        <p className={cn('text-eyebrow font-semibold uppercase', dark ? 'text-on-primary' : 'text-secondary')}>{hero.eyebrow}</p>
      ) : null}
      <h1 id="page-title" className={cn('max-w-heading font-heading text-display font-extrabold text-balance', dark ? 'text-on-primary' : 'text-text')}>
        {hero.title}
      </h1>
      <p className={cn('max-w-body text-lg', dark ? 'text-on-primary' : 'text-muted')}>{hero.body}</p>
      {ctas.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {ctas.map((cta, index) => (
            <Button
              key={cta.href}
              href={cta.href}
              size="lg"
              variant={index === 0 ? (dark ? 'inverse' : 'primary') : dark ? 'on-dark' : 'secondary'}
            >
              {cta.label}
            </Button>
          ))}
        </div>
      ) : null}
    </>
  );
}

/** Typography hero (default) or full-width photo hero with a dark overlay. Owns the page's only h1. */
export function Hero({hero, variant = 'typography'}: HeroProps) {
  if (variant === 'photo' && hero.image) {
    return (
      <section aria-labelledby="page-title" className="on-dark relative isolate overflow-hidden bg-primary">
        {/* Decorative background; the overlay keeps white text at ≥ 6:1 even over a white photo. */}
        <Image src={hero.image.url} alt="" fill sizes="100vw" loading="eager" fetchPriority="high" className="-z-10 object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-overlay" />
        <Container className="flex min-h-[28rem] flex-col items-start justify-end gap-6 py-16 lg:min-h-[34rem] lg:py-24">
          <HeroBody hero={hero} dark />
        </Container>
      </section>
    );
  }
  return (
    <section aria-labelledby="page-title" className="border-b border-border bg-background">
      <Container className="flex flex-col items-start gap-6 py-16 lg:py-24">
        <HeroBody hero={hero} dark={false} />
      </Container>
    </section>
  );
}
```

`components/sections/CTASection.tsx`:
```tsx
import {Section} from '@/components/layout/Section';
import {Button} from '@/components/ui/Button';
import type {CtaBlockView} from '@/types/common';

export function CTASection({id, block}: {id: string; block: CtaBlockView}) {
  const headingId = `${id}-title`;
  return (
    <Section id={id} labelledBy={headingId} tone="surface" className="border-t border-border">
      <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-heading flex-col gap-3">
          <h2 id={headingId} className="font-heading text-h2 font-bold text-balance text-text">
            {block.title}
          </h2>
          <p className="max-w-body text-lg text-muted">{block.body}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {block.ctas.map((cta, index) => (
            <Button key={cta.href} href={cta.href} size="lg" variant={index === 0 ? 'primary' : 'secondary'}>
              {cta.label}
            </Button>
          ))}
        </div>
      </div>
    </Section>
  );
}
```

`components/sections/HistoryTimeline.tsx`:
```tsx
import {FlagBadges} from '@/components/ui/FlagBadges';
import type {HistoryEntry} from '@/types/misc';

export function HistoryTimeline({entries}: {entries: HistoryEntry[]}) {
  return (
    <ol className="flex flex-col gap-8 border-s-2 border-border ps-8">
      {entries.map((entry) => (
        <li key={entry._id} className="relative">
          {/* Dot centred on the 2px rail: -(2rem padding + 0.125rem rail) - 0.3125rem */}
          <span aria-hidden="true" className="absolute -start-[2.4375rem] top-2 size-3 rounded-full bg-secondary ring-4 ring-background" />
          <p className="font-heading text-lg font-extrabold text-secondary">{entry.year}</p>
          <h3 className="font-heading text-h3 font-bold text-text">{entry.title}</h3>
          {entry.body ? <p className="mt-1 max-w-body text-muted">{entry.body}</p> : null}
          <FlagBadges flags={entry} className="mt-2" />
        </li>
      ))}
    </ol>
  );
}
```

`components/sections/TeamGrid.tsx`:
```tsx
import {Avatar} from '@/components/ui/Avatar';
import {FlagBadges} from '@/components/ui/FlagBadges';
import type {TeamMember} from '@/types/people';

export function TeamGrid({members}: {members: TeamMember[]}) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => (
        <li key={member._id} className="flex items-center gap-4 rounded-card border border-border bg-surface p-6">
          <Avatar name={member.name} seed={member._id} size="lg" photo={member.photo} />
          <div className="min-w-0">
            <h3 className="font-heading text-lg font-bold text-text">{member.name}</h3>
            <p className="text-muted">{member.title}</p>
            <FlagBadges flags={member} className="mt-2" />
          </div>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 3: Build the About page**

`app/[locale]/about/page.tsx`:
```tsx
import type {Metadata} from 'next';
import {Section} from '@/components/layout/Section';
import {CardGrid} from '@/components/sections/CardGrid';
import {CTASection} from '@/components/sections/CTASection';
import {FAQSection} from '@/components/sections/FAQSection';
import {Hero} from '@/components/sections/Hero';
import {HistoryTimeline} from '@/components/sections/HistoryTimeline';
import {SectionHeading} from '@/components/sections/SectionHeading';
import {StatGrid} from '@/components/sections/StatGrid';
import {TeamGrid} from '@/components/sections/TeamGrid';
import {Button} from '@/components/ui/Button';
import {FlagBadges} from '@/components/ui/FlagBadges';
import {getCoreValues} from '@/lib/content/core-values';
import {getFaqs} from '@/lib/content/faq';
import {getAboutPage} from '@/lib/content/pages';
import {getStats} from '@/lib/content/stats';
import {getTeamMembers} from '@/lib/content/team';
import {getHistory} from '@/lib/content/timeline';
import {assertLocale} from '@/lib/i18n/locale';
import {buildPageMetadata} from '@/lib/i18n/metadata';

export async function generateMetadata({params}: PageProps<'/[locale]/about'>): Promise<Metadata> {
  const locale = assertLocale((await params).locale);
  const page = await getAboutPage(locale);
  return buildPageMetadata({locale, path: '/about', title: page.seo.title, description: page.seo.description});
}

export default async function AboutPage({params}: PageProps<'/[locale]/about'>) {
  const locale = assertLocale((await params).locale);
  const [page, values, history, stats, team, faqs] = await Promise.all([
    getAboutPage(locale),
    getCoreValues(locale),
    getHistory(locale),
    getStats(locale, 'about'),
    getTeamMembers(locale),
    getFaqs(locale, 'about'),
  ]);
  const {mission, vision} = page.missionVision;

  return (
    <>
      <Hero hero={page.hero} />

      <Section id="purpose" labelledBy="purpose-title">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="flex flex-col gap-5 lg:col-span-5">
            <SectionHeading id="purpose-title" eyebrow={page.purpose.eyebrow} title={page.purpose.title} className="mb-0" />
            <p className="text-lg text-muted">{page.purpose.body}</p>
            <p className="text-eyebrow font-semibold uppercase text-secondary">{page.values.eyebrow}</p>
          </div>
          <CardGrid cards={values} columns={2} className="lg:col-span-7" />
        </div>
      </Section>

      <Section id="mission-vision" tone="surface">
        <div className="grid gap-6 lg:grid-cols-2">
          {[mission, vision].map((block) => (
            <div key={block.title} className="flex flex-col gap-3 rounded-card border border-border bg-background p-8">
              <h2 className="font-heading text-h2 font-bold text-text">{block.title}</h2>
              <p className="text-lg text-muted">{block.body}</p>
            </div>
          ))}
        </div>
        <FlagBadges flags={page.missionVision} className="mt-4" />
      </Section>

      <Section id="story" labelledBy="story-title">
        <SectionHeading id="story-title" eyebrow={page.story.eyebrow} title={page.story.title} />
        <HistoryTimeline entries={history} />
      </Section>

      <Section id="impact" labelledBy="impact-title" tone="surface">
        <SectionHeading id="impact-title" eyebrow={page.impact.eyebrow} title={page.impact.title} />
        <StatGrid stats={stats} />
        <CardGrid cards={page.impact.cases} columns={2} className="mt-6" />
        <FlagBadges flags={page.impact} className="mt-4" />
      </Section>

      <Section id="team" labelledBy="team-title">
        <SectionHeading id="team-title" eyebrow={page.team.eyebrow} title={page.team.title} intro={page.team.intro} />
        <TeamGrid members={team} />
      </Section>

      <Section id="reports" labelledBy="reports-title" tone="surface">
        <SectionHeading
          id="reports-title"
          eyebrow={page.reportsTeaser.eyebrow}
          title={page.reportsTeaser.title}
          intro={page.reportsTeaser.intro}
          className="mb-0"
          action={
            <Button href={page.reportsTeaser.cta.href} variant="secondary">
              {page.reportsTeaser.cta.label}
            </Button>
          }
        />
      </Section>

      <FAQSection intro={page.faq} faqs={faqs} />
      <CTASection id="about-cta" block={page.cta} />
    </>
  );
}
```

- [ ] **Step 4: Run tests, typecheck, lint, commit**

Run: `npm run test:e2e -- tests/e2e/about.spec.ts && npm run typecheck && npm run lint`
Expected: PASS.

```bash
git add components app tests
git commit -m "$(cat <<'EOF'
feat: add about page with hero, story timeline, team, and CTA sections

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 17: Reports page

**Files:**
- Create: `components/pages/reports/ReportsTabs.tsx`, `app/[locale]/about/reports/page.tsx`
- Test: `tests/e2e/about.spec.ts` (extend)

**Interfaces:**
- Consumes: `getReportsPage`, `getReports` (Task 8), `Tabs`, `Button`, `EmptyState`, `FlagBadges`, `Hero`.
- Produces: `ReportsTabs({reports: Report[]})`.

- [ ] **Step 1: Extend the E2E test (failing)**

Append to `tests/e2e/about.spec.ts`:
```ts
test.describe('reports page', () => {
  test('switches between financial statements and annual reports', async ({page}) => {
    await page.goto('/en/about/reports');
    await expect(page.getByRole('heading', {level: 1, name: 'Reports & transparency'})).toBeVisible();
    const panel = page.getByRole('tabpanel');
    await expect(panel.getByRole('heading', {level: 3})).toHaveText(['2025 Financial Statements', '2024 Financial Statements']);

    await page.getByRole('tab', {name: 'Financial Statements'}).focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tab', {name: 'Annual Reports'})).toHaveAttribute('aria-selected', 'true');
    await expect(panel.getByRole('heading', {level: 3})).toHaveText(['2025 Annual Report', '2024 Annual Report']);
  });

  test('marks sample files as unavailable', async ({page}) => {
    await page.goto('/en/about/reports');
    const buttons = page.getByRole('tabpanel').getByRole('button', {name: 'Sample — file not available'});
    await expect(buttons).toHaveCount(2);
    await expect(buttons.first()).toBeDisabled();
  });
});
```

Run: `npm run test:e2e -- tests/e2e/about.spec.ts`
Expected: new tests FAIL.

- [ ] **Step 2: Implement**

`components/pages/reports/ReportsTabs.tsx`:
```tsx
'use client';

import {Download, FileText} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useState} from 'react';
import {Button} from '@/components/ui/Button';
import {EmptyState} from '@/components/ui/EmptyState';
import {FlagBadges} from '@/components/ui/FlagBadges';
import {Tabs} from '@/components/ui/Tabs';
import type {Report, ReportKind} from '@/types/misc';

export function ReportsTabs({reports}: {reports: Report[]}) {
  const t = useTranslations('Reports');
  const [kind, setKind] = useState<ReportKind>('financial');
  const visible = reports.filter((report) => report.kind === kind);

  return (
    <Tabs
      label={t('tabsLabel')}
      items={[
        {id: 'financial', label: t('financial')},
        {id: 'annual', label: t('annual')},
      ]}
      value={kind}
      onValueChange={(id) => setKind(id as ReportKind)}
    >
      {visible.length === 0 ? (
        <EmptyState title={t('emptyTitle')} />
      ) : (
        <ul className="flex flex-col gap-4">
          {visible.map((report) => (
            <li
              key={report._id}
              className="flex flex-col gap-4 rounded-card border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-4">
                <span className="font-heading text-h3 font-extrabold text-secondary">{report.year}</span>
                <div>
                  <h3 className="font-heading text-lg font-bold text-text">{report.title}</h3>
                  {report.summary ? <p className="text-muted">{report.summary}</p> : null}
                  <FlagBadges flags={report} className="mt-2" />
                </div>
              </div>
              {report.file ? (
                <Button href={report.file.url} variant="secondary" icon={<Download aria-hidden="true" className="size-4" />}>
                  {t('download')}
                </Button>
              ) : (
                <Button variant="secondary" disabled icon={<FileText aria-hidden="true" className="size-4" />}>
                  {t('unavailable')}
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </Tabs>
  );
}
```

`app/[locale]/about/reports/page.tsx`:
```tsx
import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {Section} from '@/components/layout/Section';
import {ReportsTabs} from '@/components/pages/reports/ReportsTabs';
import {Hero} from '@/components/sections/Hero';
import {getReportsPage} from '@/lib/content/pages';
import {getReports} from '@/lib/content/reports';
import {assertLocale} from '@/lib/i18n/locale';
import {buildPageMetadata} from '@/lib/i18n/metadata';

export async function generateMetadata({params}: PageProps<'/[locale]/about/reports'>): Promise<Metadata> {
  const locale = assertLocale((await params).locale);
  const page = await getReportsPage(locale);
  return buildPageMetadata({locale, path: '/about/reports', title: page.seo.title, description: page.seo.description});
}

export default async function ReportsPage({params}: PageProps<'/[locale]/about/reports'>) {
  const locale = assertLocale((await params).locale);
  const [page, reports, t] = await Promise.all([getReportsPage(locale), getReports(locale), getTranslations('Reports')]);

  return (
    <>
      <Hero hero={page.hero} />
      <Section id="reports-list" labelledBy="reports-list-title">
        <h2 id="reports-list-title" className="sr-only">
          {t('tabsLabel')}
        </h2>
        <ReportsTabs reports={reports} />
      </Section>
    </>
  );
}
```

- [ ] **Step 3: Run tests and commit**

Run: `npm run test:e2e -- tests/e2e/about.spec.ts && npm run typecheck && npm run lint`

```bash
git add components app tests
git commit -m "$(cat <<'EOF'
feat: add reports page with financial and annual report tabs

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 18: Mentorship page with the mentee application dialog

**Files:**
- Create: `components/sections/StepList.tsx`, `components/pages/mentorship/MenteeApply.tsx`, `app/[locale]/get-involved/mentorship/page.tsx`
- Test: `tests/e2e/mentorship.spec.ts`

**Interfaces:**
- Consumes: `getMentorshipPage`, `getTestimonials`, `getFaqs`; `useDemoForm`, `menteeApplySchema`, `MENTEE_INTERESTS` (Task 12); `Dialog`, `FormField`, `ChoiceGroup`, `Input`, `Textarea`, `FormFeedback`.
- Produces: `StepList({steps: {title: string; body: string; duration?: string}[]})`, `MenteeApply()`.

- [ ] **Step 1: Write the failing E2E test**

`tests/e2e/mentorship.spec.ts`:
```ts
import {expect, test} from '@playwright/test';

test.describe('mentorship page', () => {
  test('uses a photo hero whose CTA jumps to #apply', async ({page}) => {
    await page.goto('/en/get-involved/mentorship');
    await expect(page.getByRole('heading', {level: 1, name: 'Mentorship that meets you where you are'})).toBeVisible();
    await page.getByRole('link', {name: 'Apply for Mentorship'}).click();
    await expect(page).toHaveURL(/#apply$/);
    await expect(page.getByRole('region', {name: 'Apply for the next cohort'})).toBeInViewport();
  });

  test('shows the offer, eligibility, six-step process, details, and outcomes', async ({page}) => {
    await page.goto('/en/get-involved/mentorship');
    await expect(page.getByRole('region', {name: 'More than advice — a relationship'}).getByRole('heading', {level: 3})).toHaveCount(4);
    await expect(page.getByRole('region', {name: 'Is this program for you?'}).getByRole('listitem')).toHaveCount(4);
    await expect(page.getByRole('region', {name: 'How it works'}).getByRole('listitem')).toHaveCount(6);
    await expect(page.getByRole('region', {name: 'At a glance'})).toContainText('Free for mentees');
    await expect(page.getByRole('region', {name: 'Where you could be in six months'}).getByRole('heading', {level: 3})).toHaveCount(4);
    await expect(page.getByRole('region', {name: 'Mentees who took the first step'}).locator('figure')).toHaveCount(3);
  });

  test('the application dialog validates and ends in a demo notice', async ({page}) => {
    await page.goto('/en/get-involved/mentorship');
    await page.getByRole('button', {name: 'Apply Now (Demo)'}).click();
    const dialog = page.getByRole('dialog', {name: 'Mentee application (Demo)'});
    await expect(dialog).toBeVisible();

    await dialog.getByRole('button', {name: 'Submit (Demo)'}).click();
    await expect(dialog.getByText('This field is required.')).toHaveCount(4);
    await expect(dialog.getByLabel(/Full name/)).toBeFocused();

    await dialog.getByLabel(/Full name/).fill('Jiwon Kim');
    await dialog.getByLabel(/^Email/).fill('jiwon@example.com');
    await dialog.getByLabel(/School and grade/).fill('Grade 11');
    await dialog.getByLabel('Technology').check();
    await dialog.getByRole('button', {name: 'Submit (Demo)'}).click();
    await expect(dialog.getByText('Demo — nothing was sent. Your input passed validation.')).toBeVisible();
  });

  test('FAQ has six questions', async ({page}) => {
    await page.goto('/en/get-involved/mentorship');
    await expect(page.getByRole('region', {name: 'Mentorship FAQ'}).locator('details')).toHaveCount(6);
  });
});
```

Run: `npm run test:e2e -- tests/e2e/mentorship.spec.ts`
Expected: FAIL.

- [ ] **Step 2: Implement**

`components/sections/StepList.tsx`:
```tsx
type Step = {title: string; body: string; duration?: string};

export function StepList({steps}: {steps: Step[]}) {
  return (
    <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {steps.map((step, index) => (
        <li key={step.title} className="flex flex-col gap-3 rounded-card border border-border bg-surface p-6">
          <span
            aria-hidden="true"
            className="inline-flex size-10 items-center justify-center rounded-full bg-primary font-heading font-bold text-on-primary"
          >
            {index + 1}
          </span>
          <h3 className="font-heading text-h3 font-bold text-text">{step.title}</h3>
          <p className="text-muted">{step.body}</p>
          {step.duration ? <p className="mt-auto text-sm font-semibold text-secondary">{step.duration}</p> : null}
        </li>
      ))}
    </ol>
  );
}
```

`components/pages/mentorship/MenteeApply.tsx`:
```tsx
'use client';

import {useTranslations} from 'next-intl';
import {useId, useState} from 'react';
import {Button} from '@/components/ui/Button';
import {Dialog} from '@/components/ui/Dialog';
import {FormFeedback} from '@/components/ui/FormFeedback';
import {ChoiceGroup, FormField} from '@/components/ui/FormField';
import {Input, Textarea} from '@/components/ui/Input';
import {useDemoForm} from '@/lib/forms/useDemoForm';
import {MENTEE_INTERESTS, menteeApplySchema} from '@/lib/validation/forms';

const MOTIVATION_MAX = 500;

export function MenteeApply() {
  const t = useTranslations('Mentorship');
  const tForms = useTranslations('Forms');
  const tErrors = useTranslations('Errors');
  const [open, setOpen] = useState(false);
  const id = useId();
  const form = useDemoForm(menteeApplySchema, {
    name: '',
    email: '',
    school: '',
    interests: [] as string[],
    motivation: '',
  });
  const errorFor = (field: keyof typeof form.values) => {
    const key = form.errors[field];
    return key ? tErrors(key) : undefined;
  };

  function toggleInterest(interest: string) {
    const current = form.values.interests;
    form.setValue('interests', current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest]);
  }

  return (
    <>
      <Button size="lg" aria-haspopup="dialog" onClick={() => setOpen(true)}>
        {t('applyNow')}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} title={t('applyTitle')} size="lg">
        <form ref={form.formRef} noValidate onSubmit={form.handleSubmit} className="flex flex-col gap-5">
          <FormField id={`${id}-name`} label={tForms('fields.name')} required error={errorFor('name')}>
            {(field) => (
              <Input
                {...field}
                name="name"
                autoComplete="name"
                value={form.values.name}
                onChange={(event) => form.setValue('name', event.target.value)}
                onBlur={() => form.handleBlur('name')}
              />
            )}
          </FormField>
          <FormField id={`${id}-email`} label={tForms('fields.email')} required error={errorFor('email')}>
            {(field) => (
              <Input
                {...field}
                name="email"
                type="email"
                autoComplete="email"
                value={form.values.email}
                onChange={(event) => form.setValue('email', event.target.value)}
                onBlur={() => form.handleBlur('email')}
              />
            )}
          </FormField>
          <FormField id={`${id}-school`} label={tForms('fields.school')} required error={errorFor('school')}>
            {(field) => (
              <Input
                {...field}
                name="school"
                value={form.values.school}
                onChange={(event) => form.setValue('school', event.target.value)}
                onBlur={() => form.handleBlur('school')}
              />
            )}
          </FormField>
          <ChoiceGroup legend={tForms('fields.interests')} required error={errorFor('interests')}>
            <div className="grid gap-2 sm:grid-cols-2">
              {MENTEE_INTERESTS.map((interest) => (
                <label
                  key={interest}
                  className="flex min-h-11 cursor-pointer items-center gap-3 rounded-button border border-border px-3 has-[:checked]:border-secondary has-[:checked]:bg-background"
                >
                  <input
                    type="checkbox"
                    name="interests"
                    value={interest}
                    checked={form.values.interests.includes(interest)}
                    onChange={() => toggleInterest(interest)}
                    className="size-4 accent-secondary"
                  />
                  {tForms(`interests.${interest}`)}
                </label>
              ))}
            </div>
          </ChoiceGroup>
          <FormField
            id={`${id}-motivation`}
            label={tForms('fields.motivation')}
            hint={tForms('characterCount', {count: form.values.motivation.length, max: MOTIVATION_MAX})}
            error={errorFor('motivation')}
          >
            {(field) => (
              <Textarea
                {...field}
                name="motivation"
                maxLength={MOTIVATION_MAX}
                value={form.values.motivation}
                onChange={(event) => form.setValue('motivation', event.target.value)}
                onBlur={() => form.handleBlur('motivation')}
              />
            )}
          </FormField>
          <FormFeedback status={form.status} demoMessage={tForms('demoSuccess')} />
          <Button type="submit" size="lg" className="self-start">
            {tForms('submit')}
          </Button>
        </form>
      </Dialog>
    </>
  );
}
```

`app/[locale]/get-involved/mentorship/page.tsx`:
```tsx
import {Check} from 'lucide-react';
import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {Container} from '@/components/layout/Container';
import {Section} from '@/components/layout/Section';
import {MenteeApply} from '@/components/pages/mentorship/MenteeApply';
import {CardGrid} from '@/components/sections/CardGrid';
import {FAQSection} from '@/components/sections/FAQSection';
import {Hero} from '@/components/sections/Hero';
import {SectionHeading} from '@/components/sections/SectionHeading';
import {StepList} from '@/components/sections/StepList';
import {TestimonialCard} from '@/components/sections/TestimonialCard';
import {Button} from '@/components/ui/Button';
import {FlagBadges} from '@/components/ui/FlagBadges';
import {getFaqs} from '@/lib/content/faq';
import {getMentorshipPage} from '@/lib/content/pages';
import {getTestimonials} from '@/lib/content/testimonials';
import {assertLocale} from '@/lib/i18n/locale';
import {buildPageMetadata} from '@/lib/i18n/metadata';

export async function generateMetadata({params}: PageProps<'/[locale]/get-involved/mentorship'>): Promise<Metadata> {
  const locale = assertLocale((await params).locale);
  const page = await getMentorshipPage(locale);
  return buildPageMetadata({
    locale,
    path: '/get-involved/mentorship',
    title: page.seo.title,
    description: page.seo.description,
    image: page.hero.image,
  });
}

export default async function MentorshipPage({params}: PageProps<'/[locale]/get-involved/mentorship'>) {
  const locale = assertLocale((await params).locale);
  const [page, stories, faqs, t] = await Promise.all([
    getMentorshipPage(locale),
    getTestimonials(locale, {authorType: 'mentee'}),
    getFaqs(locale, 'mentorship'),
    getTranslations('Mentorship'),
  ]);

  return (
    <>
      <Hero hero={page.hero} variant="photo" />

      <Section id="what-we-offer" labelledBy="offer-title">
        <SectionHeading id="offer-title" eyebrow={page.offer.eyebrow} title={page.offer.title} intro={page.offer.summary} />
        <FlagBadges flags={page.offer} className="mb-6" />
        <CardGrid cards={page.offer.benefits} columns={4} />
      </Section>

      <section aria-labelledby="inline-cta-title" className="border-y border-border bg-surface py-10">
        <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="inline-cta-title" className="font-heading text-h3 font-bold text-text">
            {page.inlineCta.title}
          </h2>
          <Button href={page.inlineCta.cta.href} size="lg">
            {page.inlineCta.cta.label}
          </Button>
        </Container>
      </section>

      <Section id="who-can-apply" labelledBy="eligibility-title">
        <SectionHeading id="eligibility-title" eyebrow={page.eligibility.eyebrow} title={page.eligibility.title} />
        <ul className="grid gap-4 sm:grid-cols-2">
          {page.eligibility.items.map((item) => (
            <li key={item} className="flex items-start gap-3 rounded-card border border-border bg-surface p-5">
              <Check aria-hidden="true" className="mt-1 size-5 shrink-0 text-secondary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <FlagBadges flags={page.eligibility} className="mt-4" />
      </Section>

      <Section id="application-phase" labelledBy="process-title" tone="surface">
        <SectionHeading id="process-title" eyebrow={page.process.eyebrow} title={page.process.title} />
        <StepList steps={page.process.steps} />
        <FlagBadges flags={page.process} className="mt-4" />
      </Section>

      <Section id="program-details" labelledBy="details-title">
        <SectionHeading id="details-title" eyebrow={page.details.eyebrow} title={page.details.title} />
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {page.details.items.map((item) => (
            <div key={item.label} className="flex flex-col gap-1 rounded-card border border-border bg-surface p-6">
              <dt className="text-sm font-medium text-muted">{item.label}</dt>
              <dd className="font-heading text-lg font-bold text-text">{item.value}</dd>
            </div>
          ))}
        </dl>
        <FlagBadges flags={page.details} className="mt-4" />
      </Section>

      <Section id="what-youll-achieve" labelledBy="outcomes-title" tone="surface">
        <SectionHeading id="outcomes-title" eyebrow={page.outcomes.eyebrow} title={page.outcomes.title} />
        <CardGrid cards={page.outcomes.items} columns={4} />
      </Section>

      <Section id="success-stories" labelledBy="stories-title">
        <SectionHeading id="stories-title" eyebrow={page.stories.eyebrow} title={page.stories.title} />
        <ul className="grid gap-6 lg:grid-cols-3">
          {stories.slice(0, 3).map((story) => (
            <li key={story._id}>
              <TestimonialCard testimonial={story} />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="apply" labelledBy="apply-title" tone="surface">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionHeading id="apply-title" eyebrow={page.apply.eyebrow} title={page.apply.title} intro={page.apply.body} className="mb-6" />
            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-card border border-border bg-background p-5">
                <dt className="text-sm text-muted">{t('nextCohort')}</dt>
                <dd className="font-semibold">{page.apply.nextCohort}</dd>
              </div>
              <div className="rounded-card border border-border bg-background p-5">
                <dt className="text-sm text-muted">{t('deadline')}</dt>
                <dd className="font-semibold">{page.apply.deadline}</dd>
              </div>
            </dl>
            <FlagBadges flags={page.apply} className="mt-4" />
          </div>
          <div className="lg:col-span-5 lg:justify-self-end">
            <MenteeApply />
          </div>
        </div>
      </Section>

      <FAQSection intro={page.faq} faqs={faqs} />
    </>
  );
}
```

- [ ] **Step 3: Run tests and commit**

Run: `npm run test:e2e -- tests/e2e/mentorship.spec.ts && npm run typecheck && npm run lint`
Expected: PASS.

```bash
git add components app tests
git commit -m "$(cat <<'EOF'
feat: add mentorship page with process steps and demo application dialog

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 19: Donate page with the donation selector

**Files:**
- Create: `components/pages/donate/FundUsage.tsx`, `components/pages/donate/DonationSelector.tsx`, `app/[locale]/get-involved/donate/page.tsx`
- Test: `tests/e2e/donate.spec.ts`

**Interfaces:**
- Consumes: `getDonatePage`, `getDonationTiers`, `getFaqs`; `donationSchema`, `useDemoForm`; form components.
- Produces: `FundUsage({items: {label: string; percent: number}[]; flags: Flags})`, `DonationSelector({tiers: DonationTier[]})`.

- [ ] **Step 1: Write the failing E2E test**

`tests/e2e/donate.spec.ts`:
```ts
import {expect, test} from '@playwright/test';

test.describe('donate page', () => {
  test('photo hero CTA jumps to the donation options', async ({page}) => {
    await page.goto('/en/get-involved/donate');
    await expect(page.getByRole('heading', {level: 1, name: 'Invest in the next generation of leaders'})).toBeVisible();
    await expect(page.getByRole('link', {name: 'Make a Donation'})).toHaveAttribute('href', '#donation-options');
  });

  test('explains impact tiers and fund usage', async ({page}) => {
    await page.goto('/en/get-involved/donate');
    await expect(page.getByRole('region', {name: 'What your gift can do'}).getByRole('listitem')).toHaveCount(4);
    const usage = page.getByRole('region', {name: 'Where your donation goes'});
    await expect(usage.getByRole('listitem')).toHaveCount(4);
    await expect(usage).toContainText('40%');
  });

  test('preset amounts and frequency update the summary', async ({page}) => {
    await page.goto('/en/get-involved/donate');
    const options = page.getByRole('region', {name: 'Choose your gift'});
    await options.getByText('CA$100', {exact: true}).click();
    await expect(options.getByText(/You are giving CA\$100\.$/)).toBeVisible();
    await expect(options.getByText('Supports one month of program operations for a mentoring group.')).toBeVisible();
    await options.getByText('Monthly', {exact: true}).click();
    await expect(options.getByText('You are giving CA$100 every month.')).toBeVisible();
  });

  test('custom amounts are validated before the demo notice', async ({page}) => {
    await page.goto('/en/get-involved/donate');
    const options = page.getByRole('region', {name: 'Choose your gift'});
    await options.getByText('Other', {exact: true}).click();
    const other = options.getByLabel(/Other amount/);
    await other.fill('3');
    await options.getByRole('button', {name: 'Continue (Demo)'}).click();
    await expect(options.getByText('The minimum amount is $5.')).toBeVisible();
    await expect(other).toBeFocused();
    await other.fill('3.5');
    await expect(options.getByText('Enter a whole-dollar amount.')).toBeVisible();
    await other.fill('50');
    await options.getByRole('button', {name: 'Continue (Demo)'}).click();
    await expect(options.getByText('Demo — no payment was processed.')).toBeVisible();
  });

  test('FAQ flags the tax receipt answer for review', async ({page}) => {
    await page.goto('/en/get-involved/donate');
    const faq = page.getByRole('region', {name: 'Donation FAQ'});
    await faq.getByText('Will I receive a tax receipt?').click();
    await expect(faq.getByText('Needs review', {exact: true}).first()).toBeVisible();
  });
});
```

Run: `npm run test:e2e -- tests/e2e/donate.spec.ts`
Expected: FAIL.

- [ ] **Step 2: Implement**

`components/pages/donate/FundUsage.tsx`:
```tsx
import {FlagBadges} from '@/components/ui/FlagBadges';
import type {Flags} from '@/types/common';

export function FundUsage({items, flags}: {items: {label: string; percent: number}[]; flags: Flags}) {
  return (
    <div className="flex max-w-heading flex-col gap-6">
      <ul className="flex flex-col gap-5">
        {items.map((item) => (
          <li key={item.label} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-semibold text-text">{item.label}</span>
              <span className="font-heading text-lg font-bold text-primary">{item.percent}%</span>
            </div>
            <div aria-hidden="true" className="h-2.5 overflow-hidden rounded-full bg-border">
              {/* Width is data, not a design token. */}
              <div className="h-full rounded-full bg-secondary" style={{width: `${item.percent}%`}} />
            </div>
          </li>
        ))}
      </ul>
      <FlagBadges flags={flags} />
    </div>
  );
}
```

`components/pages/donate/DonationSelector.tsx`:
```tsx
'use client';

import {useFormatter, useTranslations} from 'next-intl';
import {useId, useState} from 'react';
import {Button} from '@/components/ui/Button';
import {FormFeedback} from '@/components/ui/FormFeedback';
import {ChoiceGroup, FormField} from '@/components/ui/FormField';
import {Input} from '@/components/ui/Input';
import {useDemoForm} from '@/lib/forms/useDemoForm';
import {DONATION_FREQUENCIES, donationSchema} from '@/lib/validation/forms';
import type {DonationTier} from '@/types/misc';

const optionClass =
  'flex min-h-12 cursor-pointer items-center justify-center rounded-button border border-border-strong bg-surface px-3 text-center font-semibold text-text transition-colors duration-150 hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-on-primary has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-secondary has-[:focus-visible]:outline';

export function DonationSelector({tiers}: {tiers: DonationTier[]}) {
  const t = useTranslations('Donate');
  const tForms = useTranslations('Forms');
  const tErrors = useTranslations('Errors');
  const format = useFormatter();
  const id = useId();
  const [custom, setCustom] = useState(false);
  const form = useDemoForm(donationSchema, {
    frequency: 'one-time',
    amount: String(tiers[1]?.amount ?? 50),
    name: '',
    email: '',
  });

  const money = (value: number) => format.number(value, {style: 'currency', currency: 'CAD', maximumFractionDigits: 0});
  const amount = Number(form.values.amount.trim());
  const validAmount = form.values.amount.trim() !== '' && Number.isInteger(amount) && amount >= 5 && amount <= 10000;
  const tier = tiers.find((item) => item.amount === amount);
  const amountError = form.errors.amount ? tErrors(form.errors.amount) : undefined;

  return (
    <form ref={form.formRef} noValidate onSubmit={form.handleSubmit} className="grid gap-8 lg:grid-cols-12">
      <div className="flex flex-col gap-8 lg:col-span-7">
        <ChoiceGroup legend={t('frequency')} required>
          <div className="grid grid-cols-2 gap-3">
            {DONATION_FREQUENCIES.map((frequency) => (
              <label key={frequency} className={optionClass}>
                <input
                  type="radio"
                  name="frequency"
                  value={frequency}
                  checked={form.values.frequency === frequency}
                  onChange={() => form.setValue('frequency', frequency)}
                  className="sr-only"
                />
                {frequency === 'monthly' ? t('monthly') : t('oneTime')}
              </label>
            ))}
          </div>
        </ChoiceGroup>

        <ChoiceGroup legend={t('amount')} required error={custom ? undefined : amountError}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {tiers.map((item) => (
              <label key={item._id} className={optionClass}>
                <input
                  type="radio"
                  name="amountChoice"
                  value={item.amount}
                  checked={!custom && form.values.amount === String(item.amount)}
                  onChange={() => {
                    setCustom(false);
                    form.setValue('amount', String(item.amount));
                  }}
                  className="sr-only"
                />
                {money(item.amount)}
              </label>
            ))}
            <label className={optionClass}>
              <input
                type="radio"
                name="amountChoice"
                value="other"
                checked={custom}
                onChange={() => {
                  setCustom(true);
                  form.setValue('amount', '');
                }}
                className="sr-only"
              />
              {t('other')}
            </label>
          </div>
          {custom ? (
            <FormField id={`${id}-other`} label={t('otherAmount')} required error={amountError} className="mt-3">
              {(field) => (
                <Input
                  {...field}
                  name="amount"
                  inputMode="numeric"
                  value={form.values.amount}
                  onChange={(event) => form.setValue('amount', event.target.value)}
                  onBlur={() => form.handleBlur('amount')}
                />
              )}
            </FormField>
          ) : null}
        </ChoiceGroup>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-1 text-sm font-semibold text-text">{t('optionalDetails')}</legend>
          <FormField id={`${id}-name`} label={tForms('fields.name')}>
            {(field) => (
              <Input {...field} name="name" autoComplete="name" value={form.values.name} onChange={(event) => form.setValue('name', event.target.value)} />
            )}
          </FormField>
          <FormField id={`${id}-email`} label={tForms('fields.email')} error={form.errors.email ? tErrors(form.errors.email) : undefined}>
            {(field) => (
              <Input
                {...field}
                name="email"
                type="email"
                autoComplete="email"
                value={form.values.email}
                onChange={(event) => form.setValue('email', event.target.value)}
                onBlur={() => form.handleBlur('email')}
              />
            )}
          </FormField>
        </fieldset>
      </div>

      <aside className="flex flex-col gap-4 self-start rounded-card border border-border bg-surface p-6 lg:col-span-5">
        <div aria-live="polite" className="flex flex-col gap-2">
          <p className="font-heading text-h3 font-bold text-text">
            {validAmount ? t('summary', {amount: money(amount), frequency: form.values.frequency}) : t('summaryEmpty')}
          </p>
          {validAmount && tier ? <p className="text-muted">{tier.impact}</p> : null}
        </div>
        <FormFeedback status={form.status} demoMessage={t('noPayment')} />
        <Button type="submit" variant="accent" size="lg">
          {t('continue')}
        </Button>
      </aside>
    </form>
  );
}
```

`app/[locale]/get-involved/donate/page.tsx`:
```tsx
import type {Metadata} from 'next';
import {getFormatter} from 'next-intl/server';
import {Section} from '@/components/layout/Section';
import {DonationSelector} from '@/components/pages/donate/DonationSelector';
import {FundUsage} from '@/components/pages/donate/FundUsage';
import {CardGrid} from '@/components/sections/CardGrid';
import {FAQSection} from '@/components/sections/FAQSection';
import {Hero} from '@/components/sections/Hero';
import {SectionHeading} from '@/components/sections/SectionHeading';
import {FlagBadges} from '@/components/ui/FlagBadges';
import {getDonationTiers} from '@/lib/content/donation';
import {getFaqs} from '@/lib/content/faq';
import {getDonatePage} from '@/lib/content/pages';
import {assertLocale} from '@/lib/i18n/locale';
import {buildPageMetadata} from '@/lib/i18n/metadata';

export async function generateMetadata({params}: PageProps<'/[locale]/get-involved/donate'>): Promise<Metadata> {
  const locale = assertLocale((await params).locale);
  const page = await getDonatePage(locale);
  return buildPageMetadata({
    locale,
    path: '/get-involved/donate',
    title: page.seo.title,
    description: page.seo.description,
    image: page.hero.image,
  });
}

export default async function DonatePage({params}: PageProps<'/[locale]/get-involved/donate'>) {
  const locale = assertLocale((await params).locale);
  const [page, tiers, faqs, format] = await Promise.all([
    getDonatePage(locale),
    getDonationTiers(locale),
    getFaqs(locale, 'donate'),
    getFormatter(),
  ]);

  return (
    <>
      <Hero hero={page.hero} variant="photo" />

      <Section id="why-donate" labelledBy="why-title">
        <SectionHeading id="why-title" eyebrow={page.why.eyebrow} title={page.why.title} intro={page.why.body} />
        <FlagBadges flags={page.why} className="mb-6" />
        <CardGrid cards={page.why.points} columns={3} />
      </Section>

      <Section id="donation-impact" labelledBy="impact-title" tone="surface">
        <SectionHeading id="impact-title" eyebrow={page.impact.eyebrow} title={page.impact.title} intro={page.impact.intro} />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier) => (
            <li key={tier._id} className="flex flex-col gap-3 rounded-card border border-border bg-background p-6">
              <p className="font-heading text-h2 font-extrabold text-accent-strong">
                {format.number(tier.amount, {style: 'currency', currency: 'CAD', maximumFractionDigits: 0})}
              </p>
              <p className="text-text">{tier.impact}</p>
              <FlagBadges flags={tier} className="mt-auto" />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="how-funds-are-used" labelledBy="usage-title">
        <SectionHeading id="usage-title" eyebrow={page.fundUsage.eyebrow} title={page.fundUsage.title} />
        <FundUsage items={page.fundUsage.items} flags={page.fundUsage} />
      </Section>

      <Section id="donation-options" labelledBy="options-title" tone="surface">
        <SectionHeading id="options-title" eyebrow={page.options.eyebrow} title={page.options.title} intro={page.options.intro} />
        <DonationSelector tiers={tiers} />
      </Section>

      <FAQSection intro={page.faq} faqs={faqs} />
    </>
  );
}
```

- [ ] **Step 3: Run tests and commit**

Run: `npm run test:e2e -- tests/e2e/donate.spec.ts && npm run typecheck && npm run lint`
Expected: PASS.

```bash
git add components app tests
git commit -m "$(cat <<'EOF'
feat: add donate page with fund usage and demo donation selector

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 20: Contact page with topic pre-selection

**Files:**
- Create: `components/pages/contact/ContactForm.tsx`, `app/[locale]/contact/page.tsx`
- Test: `tests/e2e/contact.spec.ts`

**Interfaces:**
- Consumes: `getContactPage`, `getSiteSettings`, `getFaqs`; `useQueryParam` (Task 12), `contactSchema`, `CONTACT_TOPICS`; form components; `SocialMark`.
- Produces: `ContactForm()` — reads `?topic=` after hydration and remounts its fields with that topic pre-selected.

- [ ] **Step 1: Write the failing E2E test**

`tests/e2e/contact.spec.ts`:
```ts
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
```

Run: `npm run test:e2e -- tests/e2e/contact.spec.ts`
Expected: FAIL.

- [ ] **Step 2: Implement**

`components/pages/contact/ContactForm.tsx`:
```tsx
'use client';

import {useTranslations} from 'next-intl';
import {useId} from 'react';
import {Button} from '@/components/ui/Button';
import {FormFeedback} from '@/components/ui/FormFeedback';
import {FormField} from '@/components/ui/FormField';
import {Input, Select, Textarea} from '@/components/ui/Input';
import {useDemoForm} from '@/lib/forms/useDemoForm';
import {useQueryParam} from '@/lib/hooks/useQueryParam';
import {CONTACT_TOPICS, contactSchema, type ContactTopic} from '@/lib/validation/forms';

const MESSAGE_MAX = 2000;

/** Reads ?topic= after hydration; the key remounts the fields so the topic becomes the initial value. */
export function ContactForm() {
  const [topic] = useQueryParam('topic', CONTACT_TOPICS);
  return <ContactFormFields key={topic ?? 'none'} initialTopic={topic ?? ''} />;
}

function ContactFormFields({initialTopic}: {initialTopic: ContactTopic | ''}) {
  const t = useTranslations('Contact');
  const tForms = useTranslations('Forms');
  const tErrors = useTranslations('Errors');
  const id = useId();
  const form = useDemoForm(contactSchema, {name: '', email: '', topic: initialTopic as string, message: ''});
  const errorFor = (field: keyof typeof form.values) => {
    const key = form.errors[field];
    return key ? tErrors(key) : undefined;
  };

  return (
    <form ref={form.formRef} noValidate onSubmit={form.handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id={`${id}-name`} label={tForms('fields.name')} required error={errorFor('name')}>
          {(field) => (
            <Input
              {...field}
              name="name"
              autoComplete="name"
              value={form.values.name}
              onChange={(event) => form.setValue('name', event.target.value)}
              onBlur={() => form.handleBlur('name')}
            />
          )}
        </FormField>
        <FormField id={`${id}-email`} label={tForms('fields.email')} required error={errorFor('email')}>
          {(field) => (
            <Input
              {...field}
              name="email"
              type="email"
              autoComplete="email"
              value={form.values.email}
              onChange={(event) => form.setValue('email', event.target.value)}
              onBlur={() => form.handleBlur('email')}
            />
          )}
        </FormField>
      </div>
      <FormField id={`${id}-topic`} label={tForms('fields.topic')} required error={errorFor('topic')}>
        {(field) => (
          <Select
            {...field}
            name="topic"
            value={form.values.topic}
            onChange={(event) => form.setValue('topic', event.target.value)}
            onBlur={() => form.handleBlur('topic')}
          >
            <option value="">{tForms('selectPlaceholder')}</option>
            {CONTACT_TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {tForms(`topics.${topic}`)}
              </option>
            ))}
          </Select>
        )}
      </FormField>
      <FormField
        id={`${id}-message`}
        label={tForms('fields.message')}
        required
        hint={tForms('characterCount', {count: form.values.message.length, max: MESSAGE_MAX})}
        error={errorFor('message')}
      >
        {(field) => (
          <Textarea
            {...field}
            name="message"
            rows={6}
            maxLength={MESSAGE_MAX}
            value={form.values.message}
            onChange={(event) => form.setValue('message', event.target.value)}
            onBlur={() => form.handleBlur('message')}
          />
        )}
      </FormField>
      <FormFeedback status={form.status} demoMessage={tForms('demoSuccess')} />
      <Button type="submit" size="lg" className="self-start">
        {t('send')}
      </Button>
    </form>
  );
}
```

`app/[locale]/contact/page.tsx`:
```tsx
import {Mail, MapPin, Share2} from 'lucide-react';
import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {Section} from '@/components/layout/Section';
import {ContactForm} from '@/components/pages/contact/ContactForm';
import {FAQSection} from '@/components/sections/FAQSection';
import {Hero} from '@/components/sections/Hero';
import {SectionHeading} from '@/components/sections/SectionHeading';
import {FlagBadges} from '@/components/ui/FlagBadges';
import {SocialMark} from '@/components/ui/SocialMark';
import {getFaqs} from '@/lib/content/faq';
import {getContactPage} from '@/lib/content/pages';
import {getSiteSettings} from '@/lib/content/site';
import {assertLocale} from '@/lib/i18n/locale';
import {buildPageMetadata} from '@/lib/i18n/metadata';

export async function generateMetadata({params}: PageProps<'/[locale]/contact'>): Promise<Metadata> {
  const locale = assertLocale((await params).locale);
  const page = await getContactPage(locale);
  return buildPageMetadata({locale, path: '/contact', title: page.seo.title, description: page.seo.description});
}

const cardClass = 'flex flex-col gap-3 rounded-card border border-border bg-background p-6';

export default async function ContactPage({params}: PageProps<'/[locale]/contact'>) {
  const locale = assertLocale((await params).locale);
  const [page, settings, faqs, t, tFooter, tCommon] = await Promise.all([
    getContactPage(locale),
    getSiteSettings(locale),
    getFaqs(locale, 'contact'),
    getTranslations('Contact'),
    getTranslations('Footer'),
    getTranslations('Common'),
  ]);
  const socials = [
    {network: 'facebook' as const, href: settings.social.facebook, label: tFooter('facebook')},
    {network: 'linkedin' as const, href: settings.social.linkedin, label: tFooter('linkedin')},
  ].filter((social): social is {network: 'facebook' | 'linkedin'; href: string; label: string} => Boolean(social.href));

  return (
    <>
      <Hero hero={page.hero} />

      <Section id="contact-info" labelledBy="contact-info-title" tone="surface">
        <SectionHeading id="contact-info-title" title={page.info.title} />
        <ul className="grid gap-6 lg:grid-cols-3">
          <li className={cardClass}>
            <Mail aria-hidden="true" className="size-6 text-secondary" />
            <h3 className="font-heading text-lg font-bold">{t('email')}</h3>
            <a href={`mailto:${settings.contact.email}`} className="font-semibold text-primary underline-offset-4 hover:underline">
              {settings.contact.email}
            </a>
            <FlagBadges flags={settings.contact} />
          </li>
          <li className={cardClass}>
            <MapPin aria-hidden="true" className="size-6 text-secondary" />
            <h3 className="font-heading text-lg font-bold">{t('location')}</h3>
            <p>{settings.contact.location}</p>
          </li>
          <li className={cardClass}>
            <Share2 aria-hidden="true" className="size-6 text-secondary" />
            <h3 className="font-heading text-lg font-bold">{t('social')}</h3>
            <ul className="flex flex-col gap-1">
              {socials.map((social) => (
                <li key={social.network}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-3 font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    <SocialMark network={social.network} className="size-8" />
                    {social.label}
                    <span className="sr-only"> {tCommon('opensInNewTab')}</span>
                  </a>
                </li>
              ))}
            </ul>
            <FlagBadges flags={settings.social} />
          </li>
        </ul>
      </Section>

      <Section id="contact-form" labelledBy="contact-form-title">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading id="contact-form-title" eyebrow={page.form.eyebrow} title={page.form.title} intro={page.form.intro} className="mb-0" />
          </div>
          <div className="lg:col-span-8">
            <ContactForm />
          </div>
        </div>
      </Section>

      <Section id="location" labelledBy="location-title" tone="surface">
        <SectionHeading id="location-title" eyebrow={page.location.eyebrow} title={page.location.title} intro={page.location.intro} />
        <div className="flex aspect-video flex-col items-center justify-center gap-3 rounded-card border border-dashed border-border-strong bg-background p-6 text-center lg:aspect-[3/1]">
          <MapPin aria-hidden="true" className="size-8 text-muted" />
          <p className="font-semibold text-text">{settings.contact.location}</p>
          <p className="max-w-body text-sm text-muted">{t('mapPlaceholder')}</p>
        </div>
      </Section>

      <FAQSection intro={page.faq} faqs={faqs} />
    </>
  );
}
```

- [ ] **Step 3: Run the milestone suite**

Run: `npm run typecheck && npm run lint && npm run test && npm run test:e2e`
Expected: all PASS.

- [ ] **Step 4: Commit**

```bash
git add components app tests
git commit -m "$(cat <<'EOF'
feat: add contact page with query-driven topic and demo form

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

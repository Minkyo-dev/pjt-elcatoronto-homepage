# Phase 1 · M6 Mentors Directory, Events & News, Detail Pages (Tasks 21–23)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Read [the index](2026-10-13-phase1-00-index.md) first — its **Global Constraints** apply to every task.

**Milestone goal:** The searchable mentor directory, the Events & News explorer (category tabs synced to `?category=`, timeline, recap gallery, host/request forms), and the event/post detail route.

**Spec references:** [04-pages.md](../specs/04-pages.md) §5, §7, §8; [05-data-model.md](../specs/05-data-model.md) §5 (repository contracts).

---

### Task 21: Mentors page — featured mentors, searchable directory, Become a Mentor

**Files:**
- Create: `components/pages/mentors/MentorDirectory.tsx`, `app/[locale]/get-involved/mentors/page.tsx`
- Test: `tests/e2e/mentors.spec.ts`

**Interfaces:**
- Consumes: `getMentorsPage`, `getMentors`, `getFeaturedMentors` (Task 8); `filterMentors` (Task 5); `MentorShowcase` (Task 15); `Hero`, `CTASection` (Task 16); `Input`, `EmptyState`, `Button`.
- Produces: `MentorDirectory({mentors: Mentor[]; label: string})` — search by name (EN or KO), result count in a `role="status"` region, 12-per-page "Load more", empty state with "Clear search". No industry/role/location filters (spec D5).

- [ ] **Step 1: Write the failing E2E test**

`tests/e2e/mentors.spec.ts`:
```ts
import {expect, test} from '@playwright/test';

test.describe('mentors page', () => {
  test('hero and closing CTA both send mentors to the contact form with the topic set', async ({page}) => {
    await page.goto('/en/get-involved/mentors');
    await expect(page.getByRole('heading', {level: 1, name: 'Mentors who were once in your shoes'})).toBeVisible();
    await expect(page.getByRole('link', {name: 'Become a Mentor'}).first()).toHaveAttribute('href', '/en/contact?topic=mentor');
    const cta = page.locator('#become-a-mentor');
    await expect(cta.getByRole('link', {name: 'Become a Mentor'})).toHaveAttribute('href', '/en/contact?topic=mentor');
  });

  test('shows four featured mentors without photos or ratings', async ({page}) => {
    await page.goto('/en/get-involved/mentors');
    const featured = page.getByRole('region', {name: 'Featured mentors'});
    await expect(featured.getByRole('article')).toHaveCount(4);
    await expect(featured.getByRole('img')).toHaveCount(0);
  });

  test('directory pages through 18 mentors 12 at a time', async ({page}) => {
    await page.goto('/en/get-involved/mentors');
    const directory = page.getByRole('region', {name: 'All mentors'});
    await expect(directory.getByRole('status')).toHaveText('18 mentors');
    await expect(directory.getByRole('article')).toHaveCount(12);
    await directory.getByRole('button', {name: 'Load more'}).click();
    await expect(directory.getByRole('article')).toHaveCount(18);
    await expect(directory.getByRole('button', {name: 'Load more'})).toHaveCount(0);
  });

  test('search matches English and Korean names and handles no results', async ({page}) => {
    await page.goto('/en/get-involved/mentors');
    const directory = page.getByRole('region', {name: 'All mentors'});
    const search = directory.getByRole('searchbox', {name: 'Search mentors by name'});

    await search.fill('kim');
    await expect(directory.getByRole('status')).toHaveText('1 mentor');
    await expect(directory.getByRole('heading', {level: 3, name: 'Jiwon Kim'})).toBeVisible();

    await search.fill('김 지원');
    await expect(directory.getByRole('status')).toHaveText('1 mentor');

    await search.fill('zzz');
    await expect(directory.getByText('No mentors match your search')).toBeVisible();
    await directory.getByRole('button', {name: 'Clear search'}).click();
    await expect(search).toHaveValue('');
    await expect(search).toBeFocused();
    await expect(directory.getByRole('status')).toHaveText('18 mentors');
  });

  test('profile dialog shows details including long company names', async ({page}) => {
    await page.goto('/en/get-involved/mentors');
    const directory = page.getByRole('region', {name: 'All mentors'});
    await directory.getByRole('searchbox').fill('Taeyoung');
    await directory.getByRole('button', {name: 'View profile: Taeyoung Moon'}).click();
    const dialog = page.getByRole('dialog', {name: 'Taeyoung Moon'});
    await expect(dialog).toContainText('Department of Mechanical and Industrial Engineering');
    await expect(dialog).toContainText('Cohort 9 Mentee → Junior Mentor');
  });

  test('Korean page finds mentors by their English name', async ({page}) => {
    await page.goto('/ko/get-involved/mentors');
    const directory = page.getByRole('region', {name: '전체 멘토'});
    await directory.getByRole('searchbox').fill('Jiwon');
    await expect(directory.getByRole('heading', {level: 3, name: '김지원'})).toBeVisible();
    await expect(directory.getByRole('status')).toHaveText('멘토 1명');
  });
});
```

Run: `npm run test:e2e -- tests/e2e/mentors.spec.ts`
Expected: FAIL.

- [ ] **Step 2: Implement**

`components/pages/mentors/MentorDirectory.tsx`:
```tsx
'use client';

import {Search, SearchX} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useDeferredValue, useId, useMemo, useRef, useState} from 'react';
import {MentorShowcase} from '@/components/sections/MentorShowcase';
import {Button} from '@/components/ui/Button';
import {EmptyState} from '@/components/ui/EmptyState';
import {Input} from '@/components/ui/Input';
import {filterMentors} from '@/lib/content/helpers/mentors';
import type {Mentor} from '@/types/mentor';

const PAGE_SIZE = 12;

export function MentorDirectory({mentors, label}: {mentors: Mentor[]; label: string}) {
  const t = useTranslations('Mentors');
  const tCommon = useTranslations('Common');
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const deferredQuery = useDeferredValue(query);
  const results = useMemo(() => filterMentors(mentors, deferredQuery), [mentors, deferredQuery]);

  function updateQuery(value: string) {
    setQuery(value);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:max-w-md">
        <label htmlFor={`${id}-search`} className="text-sm font-semibold text-text">
          {t('searchLabel')}
        </label>
        <div className="relative">
          <Search aria-hidden="true" className="pointer-events-none absolute start-3 top-1/2 size-5 -translate-y-1/2 text-muted" />
          <Input
            ref={inputRef}
            id={`${id}-search`}
            type="search"
            autoComplete="off"
            value={query}
            placeholder={t('searchPlaceholder')}
            onChange={(event) => updateQuery(event.target.value)}
            className="ps-10"
          />
        </div>
      </div>

      <p role="status" className="text-sm font-medium text-muted">
        {t('resultCount', {count: results.length})}
      </p>

      {results.length === 0 ? (
        <EmptyState
          icon={<SearchX aria-hidden="true" className="size-8 text-muted" />}
          title={t('emptyTitle')}
          body={t('emptyBody')}
          action={
            <Button
              variant="secondary"
              onClick={() => {
                updateQuery('');
                inputRef.current?.focus();
              }}
            >
              {t('clearSearch')}
            </Button>
          }
        />
      ) : (
        <MentorShowcase mentors={results.slice(0, visibleCount)} layout="grid" label={label} />
      )}

      {visibleCount < results.length ? (
        <Button variant="secondary" className="self-center" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
          {tCommon('loadMore')}
        </Button>
      ) : null}
    </div>
  );
}
```

`app/[locale]/get-involved/mentors/page.tsx`:
```tsx
import type {Metadata} from 'next';
import {Section} from '@/components/layout/Section';
import {MentorDirectory} from '@/components/pages/mentors/MentorDirectory';
import {CTASection} from '@/components/sections/CTASection';
import {Hero} from '@/components/sections/Hero';
import {MentorShowcase} from '@/components/sections/MentorShowcase';
import {SectionHeading} from '@/components/sections/SectionHeading';
import {getFeaturedMentors, getMentors} from '@/lib/content/mentors';
import {getMentorsPage} from '@/lib/content/pages';
import {assertLocale} from '@/lib/i18n/locale';
import {buildPageMetadata} from '@/lib/i18n/metadata';

export async function generateMetadata({params}: PageProps<'/[locale]/get-involved/mentors'>): Promise<Metadata> {
  const locale = assertLocale((await params).locale);
  const page = await getMentorsPage(locale);
  return buildPageMetadata({locale, path: '/get-involved/mentors', title: page.seo.title, description: page.seo.description});
}

export default async function MentorsPage({params}: PageProps<'/[locale]/get-involved/mentors'>) {
  const locale = assertLocale((await params).locale);
  const [page, mentors, featured] = await Promise.all([getMentorsPage(locale), getMentors(locale), getFeaturedMentors(locale)]);

  return (
    <>
      <Hero hero={page.hero} />

      <Section id="featured" labelledBy="featured-title" tone="surface">
        <SectionHeading id="featured-title" eyebrow={page.featured.eyebrow} title={page.featured.title} />
        <MentorShowcase mentors={featured} layout="grid" label={page.featured.title} />
      </Section>

      <Section id="directory" labelledBy="directory-title">
        <SectionHeading id="directory-title" eyebrow={page.directory.eyebrow} title={page.directory.title} intro={page.directory.intro} />
        <MentorDirectory mentors={mentors} label={page.directory.title} />
      </Section>

      <CTASection id="become-a-mentor" block={page.cta} />
    </>
  );
}
```

- [ ] **Step 3: Run tests and commit**

Run: `npm run test:e2e -- tests/e2e/mentors.spec.ts && npm run typecheck && npm run lint`
Expected: PASS.

```bash
git add components app tests
git commit -m "$(cat <<'EOF'
feat: add mentors page with searchable directory and profile dialog

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 22: Events & News page — explorer, timeline, recap gallery, host/request forms

**Files:**
- Create: `components/sections/FeaturedContentCard.tsx`, `components/sections/EventTimeline.tsx`, `components/sections/Gallery.tsx`
- Create: `components/pages/events-news/EventsExplorer.tsx`, `components/pages/events-news/EventForms.tsx`
- Create: `app/[locale]/events-news/page.tsx`
- Test: `tests/e2e/events.spec.ts`

**Interfaces:**
- Consumes: `getEventsPage`, `getFeaturedContent`, `getEvents`, `getPosts`, `getEventTimeline`, `getFaqs` (Task 8); `CONTENT_CATEGORIES`, `categoryOf`, `matchesCategory` (Task 5); `useQueryParam` (Task 12); `EventCard`, `NewsCard`, `cardClass`, `cardLinkClass` (Task 15); `Tabs`, `Dialog`, form components.
- Produces:
  - `FeaturedContentCard({item: ContentItem})`.
  - `EventTimeline({years: TimelineYear[]})` — year groups with status badges and a "Today" divider before the first upcoming item.
  - `Gallery({items: {key: string; image: ImageView; caption: string; href?: string}[]; label: string; pageSize?: number})` — square thumbnails, "Load more", lightbox `Dialog`.
  - `EventsExplorer({upcoming: EventItem[]; past: EventItem[]; posts: Post[]; timeline: TimelineYear[]; intros: {upcoming; timeline; latest; recap: SectionIntroView}})` — tabs `all | workshops | events | stories | news` synced to `?category=` (invalid values ignored).
  - `EventForms({hostIntro: string; requestIntro: string})` — tabs with the Host an Event and Request an Event demo forms.

Visibility rules: **All** → every block. **Workshops/Events** → Upcoming, Timeline, Recap filtered by kind; News & stories hidden. **Stories/News** → only News & stories, filtered by kind.

- [ ] **Step 1: Write the failing E2E test**

`tests/e2e/events.spec.ts`:
```ts
import {expect, test} from '@playwright/test';

test.describe('events & news page', () => {
  test('hero CTA, featured item, and default "All" view', async ({page}) => {
    await page.goto('/en/events-news');
    await expect(page.getByRole('heading', {level: 1, name: 'Learn, connect, and celebrate together'})).toBeVisible();
    await expect(page.getByRole('link', {name: 'View Upcoming Events'})).toHaveAttribute('href', '#events');
    await expect(page.getByRole('region', {name: 'Featured'}).getByRole('link', {name: 'Winter Networking Night'})).toBeVisible();
    await expect(page.getByRole('tab', {name: 'All'})).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('region', {name: 'Upcoming events & workshops'}).getByRole('article')).toHaveCount(4);
  });

  test('timeline spans 2024–2027 with a Today marker', async ({page}) => {
    await page.goto('/en/events-news');
    const timeline = page.getByRole('region', {name: 'Our events over the years'});
    await expect(timeline.getByRole('heading', {level: 3})).toHaveText(['2024', '2025', '2026', '2027']);
    await expect(timeline.getByText('Today', {exact: true})).toBeVisible();
  });

  test('news & stories load six at a time', async ({page}) => {
    await page.goto('/en/events-news');
    const latest = page.getByRole('region', {name: 'News & stories'});
    await expect(latest.getByRole('article')).toHaveCount(6);
    await latest.getByRole('button', {name: 'Load more'}).click();
    await expect(latest.getByRole('article')).toHaveCount(8);
  });

  test('category tabs filter blocks and sync with the URL', async ({page}) => {
    await page.goto('/en/events-news');
    await page.getByRole('tab', {name: 'Workshops'}).click();
    await expect(page).toHaveURL(/\?category=workshops$/);
    await expect(page.getByRole('region', {name: 'Upcoming events & workshops'}).getByRole('article')).toHaveCount(2);
    await expect(page.getByRole('region', {name: 'News & stories'})).toHaveCount(0);

    await page.reload();
    await expect(page.getByRole('tab', {name: 'Workshops'})).toHaveAttribute('aria-selected', 'true');

    await page.getByRole('tab', {name: 'Stories'}).click();
    await expect(page.getByRole('region', {name: 'Upcoming events & workshops'})).toHaveCount(0);
    await expect(page.getByRole('region', {name: 'News & stories'}).getByRole('article')).toHaveCount(4);

    await page.getByRole('tab', {name: 'All'}).click();
    await expect(page).toHaveURL(/\/en\/events-news$/);
  });

  test('ignores hand-edited category values', async ({page}) => {
    for (const value of ['WORKSHOPS', '%3Cscript%3E', 'unknown']) {
      await page.goto(`/en/events-news?category=${value}`);
      await expect(page.getByRole('tab', {name: 'All'})).toHaveAttribute('aria-selected', 'true');
    }
  });

  test('recap gallery pages and opens a lightbox', async ({page}) => {
    await page.goto('/en/events-news');
    const recap = page.getByRole('region', {name: 'Past events recap'});
    const photos = recap.getByRole('button', {name: /^Open photo/});
    await expect(photos).toHaveCount(6);
    await recap.getByRole('button', {name: 'Load more'}).click();
    await expect(photos).toHaveCount(12);
    await photos.first().click();
    const lightbox = page.getByRole('dialog');
    await expect(lightbox.getByRole('link', {name: 'View event'})).toHaveAttribute('href', /\/en\/events-news\/.+/);
    await page.keyboard.press('Escape');
    await expect(lightbox).toBeHidden();
  });

  test('host and request forms validate', async ({page}) => {
    await page.goto('/en/events-news');
    const forms = page.getByRole('region', {name: 'Host or request an event'});
    await forms.getByRole('button', {name: 'Submit (Demo)'}).click();
    await expect(forms.getByText('This field is required.')).toHaveCount(7);

    await forms.getByRole('tab', {name: 'Request an Event'}).click();
    await expect(forms.getByLabel(/Topic you would like/)).toBeVisible();
    await forms.getByLabel(/^Full name/).fill('Minseo');
    await forms.getByLabel(/^Email/).fill('minseo@example.com');
    await forms.getByLabel(/Topic you would like/).fill('Law school');
    await forms.getByLabel(/Your request or question/).fill('A session on law school admissions, please.');
    await forms.getByRole('button', {name: 'Submit (Demo)'}).click();
    await expect(forms.getByText('Demo — nothing was sent. Your input passed validation.')).toBeVisible();
  });

  test('event Q&A is an accordion', async ({page}) => {
    await page.goto('/en/events-news');
    await expect(page.getByRole('region', {name: 'Event Q&A'}).locator('details')).toHaveCount(4);
  });
});
```

Run: `npm run test:e2e -- tests/e2e/events.spec.ts`
Expected: FAIL.

- [ ] **Step 2: Implement shared pieces**

`components/sections/FeaturedContentCard.tsx`:
```tsx
import {useFormatter, useTranslations} from 'next-intl';
import {Badge} from '@/components/ui/Badge';
import {FlagBadges} from '@/components/ui/FlagBadges';
import {ImageFrame} from '@/components/ui/ImageFrame';
import {categoryOf} from '@/lib/content/helpers/content';
import {Link} from '@/lib/i18n/navigation';
import {cn} from '@/lib/utils/cn';
import type {ContentItem} from '@/types/event';
import {cardClass, cardLinkClass} from './EventCard';

export function FeaturedContentCard({item}: {item: ContentItem}) {
  const t = useTranslations('Events');
  const format = useFormatter();
  const date = item.type === 'event' ? item.startsAt : item.publishedAt;
  const summary = item.type === 'event' ? item.summary : item.excerpt;

  return (
    <article className={cn(cardClass, 'lg:flex-row')}>
      <ImageFrame image={item.coverImage} ratio="16/9" sizes="(min-width: 1024px) 60vw, 100vw" rounded={false} className="lg:w-3/5" />
      <div className="flex flex-1 flex-col justify-center gap-4 p-6 lg:p-10">
        <div className="flex flex-wrap gap-2">
          <Badge variant="category">{t(`categories.${categoryOf(item)}`)}</Badge>
          <FlagBadges flags={item} />
        </div>
        <p className="text-sm font-medium text-secondary">
          <time dateTime={date}>{format.dateTime(new Date(date), {dateStyle: 'long'})}</time>
        </p>
        <h3 className="font-heading text-h2 font-bold text-text">
          <Link href={`/events-news/${item.slug}`} className={cardLinkClass}>
            {item.title}
          </Link>
        </h3>
        <p className="text-lg text-muted">{summary}</p>
      </div>
    </article>
  );
}
```

`components/sections/EventTimeline.tsx`:
```tsx
import {useFormatter, useTranslations} from 'next-intl';
import {Fragment} from 'react';
import {Badge} from '@/components/ui/Badge';
import {Link} from '@/lib/i18n/navigation';
import type {TimelineYear} from '@/types/event';

export function EventTimeline({years}: {years: TimelineYear[]}) {
  const t = useTranslations('Events');
  const format = useFormatter();
  const firstUpcoming = years.flatMap((year) => year.items).find((item) => item.status === 'upcoming')?.slug;

  return (
    <ol className="flex flex-col gap-10">
      {years.map((year) => (
        <li key={year.year} className="grid gap-4 lg:grid-cols-12">
          <h3 className="font-heading text-h3 font-extrabold text-secondary lg:col-span-2">{year.year}</h3>
          <ul className="flex flex-col gap-3 lg:col-span-10">
            {year.items.map((item) => (
              <Fragment key={item.slug}>
                {item.slug === firstUpcoming ? (
                  <li className="flex items-center gap-3 text-sm font-semibold text-accent-strong">
                    <span aria-hidden="true" className="h-px flex-1 bg-accent" />
                    {t('timelineNow')}
                    <span aria-hidden="true" className="h-px flex-1 bg-accent" />
                  </li>
                ) : null}
                <li className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-card border border-border bg-surface px-4 py-3">
                  <time dateTime={item.startsAt} className="w-32 shrink-0 text-sm text-muted">
                    {format.dateTime(new Date(item.startsAt), {dateStyle: 'medium'})}
                  </time>
                  <Link href={`/events-news/${item.slug}`} className="min-w-0 flex-1 font-semibold text-text underline-offset-4 hover:underline">
                    {item.title}
                  </Link>
                  <Badge variant={item.status === 'upcoming' ? 'category' : 'neutral'}>{t(`status.${item.status}`)}</Badge>
                </li>
              </Fragment>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
```

`components/sections/Gallery.tsx`:
```tsx
'use client';

import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {useState} from 'react';
import {Button} from '@/components/ui/Button';
import {Dialog} from '@/components/ui/Dialog';
import {ImageFrame} from '@/components/ui/ImageFrame';
import {Link} from '@/lib/i18n/navigation';
import type {ImageView} from '@/types/common';

export type GalleryItem = {key: string; image: ImageView; caption: string; href?: string};

export function Gallery({items, label, pageSize = 6}: {items: GalleryItem[]; label: string; pageSize?: number}) {
  const t = useTranslations('Events');
  const tCommon = useTranslations('Common');
  const [visible, setVisible] = useState(pageSize);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const current = openIndex === null ? null : items[openIndex];

  return (
    <>
      <ul aria-label={label} className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {items.slice(0, visible).map((item, index) => (
          <li key={item.key}>
            <button
              type="button"
              aria-haspopup="dialog"
              aria-label={t('openPhoto', {alt: item.image.alt})}
              onClick={() => setOpenIndex(index)}
              className="block w-full overflow-hidden rounded-card"
            >
              <ImageFrame image={item.image} ratio="1/1" sizes="(min-width: 640px) 33vw, 50vw" rounded={false} />
            </button>
          </li>
        ))}
      </ul>
      {visible < items.length ? (
        <div className="mt-8 flex justify-center">
          <Button variant="secondary" onClick={() => setVisible((count) => count + pageSize)}>
            {tCommon('loadMore')}
          </Button>
        </div>
      ) : null}
      <Dialog open={current !== null} onClose={() => setOpenIndex(null)} title={current?.caption ?? ''} variant="lightbox">
        {current ? (
          <figure className="flex flex-col gap-3">
            <Image
              src={current.image.url}
              alt={current.image.alt}
              width={current.image.width}
              height={current.image.height}
              sizes="(min-width: 1024px) 64rem, 100vw"
              className="h-auto w-full rounded-card"
            />
            <figcaption className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
              <span>
                {current.image.alt}
                {current.image.credit ? ` · ${current.image.credit}` : ''}
              </span>
              {current.href ? (
                <Link href={current.href} className="font-semibold text-primary underline-offset-4 hover:underline">
                  {t('viewEvent')}
                </Link>
              ) : null}
            </figcaption>
          </figure>
        ) : null}
      </Dialog>
    </>
  );
}
```

- [ ] **Step 3: Implement the explorer and forms**

`components/pages/events-news/EventsExplorer.tsx`:
```tsx
'use client';

import {useTranslations} from 'next-intl';
import {useState, type ReactNode} from 'react';
import {Section} from '@/components/layout/Section';
import {EventCard} from '@/components/sections/EventCard';
import {EventTimeline} from '@/components/sections/EventTimeline';
import {Gallery} from '@/components/sections/Gallery';
import {NewsCard} from '@/components/sections/NewsCard';
import {SectionHeading} from '@/components/sections/SectionHeading';
import {Button} from '@/components/ui/Button';
import {EmptyState} from '@/components/ui/EmptyState';
import {Tabs} from '@/components/ui/Tabs';
import {CONTENT_CATEGORIES, matchesCategory} from '@/lib/content/helpers/content';
import {useQueryParam} from '@/lib/hooks/useQueryParam';
import type {SectionIntroView} from '@/types/common';
import type {ContentCategory, EventItem, Post, TimelineYear} from '@/types/event';

const PAGE_SIZE = 6;
type TabId = ContentCategory | 'all';

type EventsExplorerProps = {
  upcoming: EventItem[];
  past: EventItem[];
  posts: Post[];
  timeline: TimelineYear[];
  intros: {upcoming: SectionIntroView; timeline: SectionIntroView; latest: SectionIntroView; recap: SectionIntroView};
};

function CardList({id, intro, items}: {id: string; intro: SectionIntroView; items: {key: string; node: ReactNode}[]}) {
  const t = useTranslations('Events');
  const tCommon = useTranslations('Common');
  const [visible, setVisible] = useState(PAGE_SIZE);
  return (
    <section id={id} aria-labelledby={`${id}-title`}>
      <SectionHeading id={`${id}-title`} eyebrow={intro.eyebrow} title={intro.title} intro={intro.intro} />
      {items.length === 0 ? (
        <EmptyState title={t('emptyTitle')} body={t('emptyBody')} />
      ) : (
        <>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.slice(0, visible).map((item) => (
              <li key={item.key}>{item.node}</li>
            ))}
          </ul>
          {visible < items.length ? (
            <div className="mt-8 flex justify-center">
              <Button variant="secondary" onClick={() => setVisible((count) => count + PAGE_SIZE)}>
                {tCommon('loadMore')}
              </Button>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}

export function EventsExplorer({upcoming, past, posts, timeline, intros}: EventsExplorerProps) {
  const t = useTranslations('Events');
  const [param, setParam] = useQueryParam('category', CONTENT_CATEGORIES);
  const category: TabId = param ?? 'all';

  const showEvents = category === 'all' || category === 'workshops' || category === 'events';
  const showPosts = category === 'all' || category === 'stories' || category === 'news';
  const eventMatches = (event: {kind: EventItem['kind']}) => matchesCategory({type: 'event', kind: event.kind}, category);

  const filteredUpcoming = upcoming.filter(eventMatches);
  const filteredPast = past.filter(eventMatches);
  const filteredPosts = posts.filter((post) => matchesCategory({type: 'post', kind: post.kind}, category));
  const filteredTimeline = timeline
    .map((year) => ({...year, items: year.items.filter(eventMatches)}))
    .filter((year) => year.items.length > 0);
  const recapPhotos = filteredPast.flatMap((event) =>
    (event.gallery ?? []).map((image, index) => ({
      key: `${event.slug}-${index}`,
      image,
      caption: event.title,
      href: `/events-news/${event.slug}`,
    })),
  );

  const tabs = (['all', ...CONTENT_CATEGORIES] as TabId[]).map((id) => ({id, label: t(`categories.${id}`)}));

  return (
    <Section id="explore" labelledBy="explore-title">
      <h2 id="explore-title" className="sr-only">
        {t('tabsLabel')}
      </h2>
      <Tabs
        label={t('tabsLabel')}
        items={tabs}
        value={category}
        onValueChange={(id) => setParam(id === 'all' ? null : (id as ContentCategory))}
      >
        <div className="flex flex-col gap-20">
          {showEvents ? (
            <CardList
              key={`events-${category}`}
              id="events"
              intro={intros.upcoming}
              items={filteredUpcoming.map((event) => ({key: event.slug, node: <EventCard event={event} />}))}
            />
          ) : null}

          {showEvents && filteredTimeline.length > 0 ? (
            <section id="timeline" aria-labelledby="timeline-title">
              <SectionHeading id="timeline-title" eyebrow={intros.timeline.eyebrow} title={intros.timeline.title} />
              <EventTimeline years={filteredTimeline} />
            </section>
          ) : null}

          {showPosts ? (
            <CardList
              key={`latest-${category}`}
              id="latest"
              intro={intros.latest}
              items={filteredPosts.map((post) => ({key: post.slug, node: <NewsCard post={post} />}))}
            />
          ) : null}

          {showEvents ? (
            <section id="recap" aria-labelledby="recap-title">
              <SectionHeading id="recap-title" eyebrow={intros.recap.eyebrow} title={intros.recap.title} />
              {recapPhotos.length > 0 ? (
                <Gallery key={`recap-${category}`} items={recapPhotos} label={t('galleryLabel')} />
              ) : (
                <EmptyState title={t('emptyTitle')} body={t('emptyBody')} />
              )}
            </section>
          ) : null}
        </div>
      </Tabs>
    </Section>
  );
}
```

`components/pages/events-news/EventForms.tsx`:
```tsx
'use client';

import {useTranslations} from 'next-intl';
import {useId, useState} from 'react';
import {Button} from '@/components/ui/Button';
import {FormFeedback} from '@/components/ui/FormFeedback';
import {ChoiceGroup, FormField} from '@/components/ui/FormField';
import {Input, Select, Textarea} from '@/components/ui/Input';
import {Tabs} from '@/components/ui/Tabs';
import {useDemoForm} from '@/lib/forms/useDemoForm';
import {EVENT_FORMATS, EVENT_TYPES, hostEventSchema, requestEventSchema} from '@/lib/validation/forms';

function useErrorText<V extends Record<string, string | string[]>>(errors: Partial<Record<keyof V & string, string>>) {
  const tErrors = useTranslations('Errors');
  return (field: keyof V & string) => {
    const key = errors[field];
    return key ? tErrors(key) : undefined;
  };
}

function HostEventForm({intro}: {intro: string}) {
  const tForms = useTranslations('Forms');
  const id = useId();
  const form = useDemoForm(hostEventSchema, {
    name: '',
    email: '',
    cohort: '',
    eventType: '',
    title: '',
    preferredDate: '',
    format: '',
    description: '',
  });
  const errorFor = useErrorText<typeof form.values>(form.errors);
  const text = (field: 'name' | 'email' | 'cohort' | 'title' | 'preferredDate', required: boolean, type = 'text') => (
    <FormField id={`${id}-${field}`} label={tForms(`fields.${field}`)} required={required} error={errorFor(field)}>
      {(a11y) => (
        <Input
          {...a11y}
          name={field}
          type={type}
          value={form.values[field]}
          onChange={(event) => form.setValue(field, event.target.value)}
          onBlur={() => form.handleBlur(field)}
        />
      )}
    </FormField>
  );

  return (
    <form ref={form.formRef} noValidate onSubmit={form.handleSubmit} className="flex flex-col gap-5">
      <p className="max-w-body text-muted">{intro}</p>
      <div className="grid gap-5 sm:grid-cols-2">
        {text('name', true)}
        {text('email', true, 'email')}
        {text('cohort', false)}
        <FormField id={`${id}-eventType`} label={tForms('fields.eventType')} required error={errorFor('eventType')}>
          {(a11y) => (
            <Select
              {...a11y}
              name="eventType"
              value={form.values.eventType}
              onChange={(event) => form.setValue('eventType', event.target.value)}
              onBlur={() => form.handleBlur('eventType')}
            >
              <option value="">{tForms('selectPlaceholder')}</option>
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {tForms(`eventTypes.${type}`)}
                </option>
              ))}
            </Select>
          )}
        </FormField>
        {text('title', true)}
        {text('preferredDate', true)}
      </div>
      <ChoiceGroup legend={tForms('fields.format')} required error={errorFor('format')}>
        <div className="flex flex-wrap gap-3">
          {EVENT_FORMATS.map((format) => (
            <label
              key={format}
              className="flex min-h-11 cursor-pointer items-center gap-2 rounded-button border border-border px-3 has-[:checked]:border-secondary has-[:checked]:bg-background"
            >
              <input
                type="radio"
                name="format"
                value={format}
                checked={form.values.format === format}
                onChange={() => form.setValue('format', format)}
                className="size-4 accent-secondary"
              />
              {tForms(`formats.${format}`)}
            </label>
          ))}
        </div>
      </ChoiceGroup>
      <FormField id={`${id}-description`} label={tForms('fields.description')} required error={errorFor('description')}>
        {(a11y) => (
          <Textarea
            {...a11y}
            name="description"
            maxLength={1000}
            value={form.values.description}
            onChange={(event) => form.setValue('description', event.target.value)}
            onBlur={() => form.handleBlur('description')}
          />
        )}
      </FormField>
      <FormFeedback status={form.status} demoMessage={tForms('demoSuccess')} />
      <Button type="submit" size="lg" className="self-start">
        {tForms('submit')}
      </Button>
    </form>
  );
}

function RequestEventForm({intro}: {intro: string}) {
  const tForms = useTranslations('Forms');
  const id = useId();
  const form = useDemoForm(requestEventSchema, {name: '', email: '', topic: '', details: ''});
  const errorFor = useErrorText<typeof form.values>(form.errors);

  return (
    <form ref={form.formRef} noValidate onSubmit={form.handleSubmit} className="flex flex-col gap-5">
      <p className="max-w-body text-muted">{intro}</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id={`${id}-name`} label={tForms('fields.name')} required error={errorFor('name')}>
          {(a11y) => (
            <Input {...a11y} name="name" value={form.values.name} onChange={(event) => form.setValue('name', event.target.value)} onBlur={() => form.handleBlur('name')} />
          )}
        </FormField>
        <FormField id={`${id}-email`} label={tForms('fields.email')} required error={errorFor('email')}>
          {(a11y) => (
            <Input
              {...a11y}
              name="email"
              type="email"
              value={form.values.email}
              onChange={(event) => form.setValue('email', event.target.value)}
              onBlur={() => form.handleBlur('email')}
            />
          )}
        </FormField>
      </div>
      <FormField id={`${id}-topic`} label={tForms('fields.requestTopic')} required error={errorFor('topic')}>
        {(a11y) => (
          <Input {...a11y} name="topic" value={form.values.topic} onChange={(event) => form.setValue('topic', event.target.value)} onBlur={() => form.handleBlur('topic')} />
        )}
      </FormField>
      <FormField id={`${id}-details`} label={tForms('fields.details')} required error={errorFor('details')}>
        {(a11y) => (
          <Textarea
            {...a11y}
            name="details"
            maxLength={1000}
            value={form.values.details}
            onChange={(event) => form.setValue('details', event.target.value)}
            onBlur={() => form.handleBlur('details')}
          />
        )}
      </FormField>
      <FormFeedback status={form.status} demoMessage={tForms('demoSuccess')} />
      <Button type="submit" size="lg" className="self-start">
        {tForms('submit')}
      </Button>
    </form>
  );
}

export function EventForms({hostIntro, requestIntro}: {hostIntro: string; requestIntro: string}) {
  const t = useTranslations('Events');
  const [tab, setTab] = useState<'host' | 'request'>('host');
  return (
    <Tabs
      label={t('formsTabsLabel')}
      items={[
        {id: 'host', label: t('hostTab')},
        {id: 'request', label: t('requestTab')},
      ]}
      value={tab}
      onValueChange={(id) => setTab(id as 'host' | 'request')}
    >
      {tab === 'host' ? <HostEventForm intro={hostIntro} /> : <RequestEventForm intro={requestIntro} />}
    </Tabs>
  );
}
```

`app/[locale]/events-news/page.tsx`:
```tsx
import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {Section} from '@/components/layout/Section';
import {EventForms} from '@/components/pages/events-news/EventForms';
import {EventsExplorer} from '@/components/pages/events-news/EventsExplorer';
import {FAQSection} from '@/components/sections/FAQSection';
import {FeaturedContentCard} from '@/components/sections/FeaturedContentCard';
import {Hero} from '@/components/sections/Hero';
import {SectionHeading} from '@/components/sections/SectionHeading';
import {getFeaturedContent} from '@/lib/content/content';
import {getEventTimeline, getEvents} from '@/lib/content/events';
import {getFaqs} from '@/lib/content/faq';
import {getEventsPage} from '@/lib/content/pages';
import {getPosts} from '@/lib/content/posts';
import {assertLocale} from '@/lib/i18n/locale';
import {buildPageMetadata} from '@/lib/i18n/metadata';

export async function generateMetadata({params}: PageProps<'/[locale]/events-news'>): Promise<Metadata> {
  const locale = assertLocale((await params).locale);
  const page = await getEventsPage(locale);
  return buildPageMetadata({locale, path: '/events-news', title: page.seo.title, description: page.seo.description});
}

export default async function EventsNewsPage({params}: PageProps<'/[locale]/events-news'>) {
  const locale = assertLocale((await params).locale);
  const [page, featured, upcoming, past, posts, timeline, faqs, t] = await Promise.all([
    getEventsPage(locale),
    getFeaturedContent(locale),
    getEvents({locale, status: 'upcoming'}),
    getEvents({locale, status: 'past'}),
    getPosts({locale}),
    getEventTimeline(locale),
    getFaqs(locale, 'events'),
    getTranslations('Events'),
  ]);

  return (
    <>
      <Hero hero={page.hero} />

      {featured ? (
        <Section id="featured" labelledBy="featured-title" tone="surface">
          <SectionHeading id="featured-title" eyebrow={page.featured.eyebrow} title={page.featured.title} />
          <FeaturedContentCard item={featured} />
        </Section>
      ) : null}

      <EventsExplorer
        upcoming={upcoming}
        past={past}
        posts={posts}
        timeline={timeline}
        intros={{upcoming: page.upcoming, timeline: page.timeline, latest: page.latest, recap: page.recap}}
      />

      <Section id="host-or-request" labelledBy="forms-title" tone="surface">
        <SectionHeading id="forms-title" eyebrow={page.forms.eyebrow} title={page.forms.title} />
        <EventForms hostIntro={page.forms.hostIntro} requestIntro={page.forms.requestIntro} />
      </Section>

      <FAQSection id="event-qa" intro={{title: t('questionsTitle')}} faqs={faqs} />
    </>
  );
}
```

- [ ] **Step 4: Run tests and commit**

Run: `npm run test:e2e -- tests/e2e/events.spec.ts && npm run typecheck && npm run lint`
Expected: PASS.

```bash
git add components app tests
git commit -m "$(cat <<'EOF'
feat: add events and news explorer with timeline, recap gallery, and event forms

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 23: Event and post detail route

**Files:**
- Create: `components/sections/Breadcrumb.tsx`, `components/pages/events-news/EventRegisterForm.tsx`, `components/pages/events-news/EventDetail.tsx`, `components/pages/events-news/PostDetail.tsx`, `components/pages/events-news/RelatedContent.tsx`
- Create: `app/[locale]/events-news/[slug]/page.tsx`
- Test: `tests/e2e/event-detail.spec.ts`

**Interfaces:**
- Consumes: `getContentBySlug`, `getRelated`, `getAllContentSlugs` (Task 8); `Gallery` (Task 22); `ContentCard` (Task 15); `RichText`, `ImageFrame`, `Badge`, `FlagBadges`; `eventRegisterSchema`.
- Produces: `Breadcrumb({items: {label: string; href: string}[]; current: string})`, `EventRegisterForm()`, `EventDetail({event: EventItem; related: ContentItem[]})` (async server), `PostDetail({post: Post; related: ContentItem[]})` (async server), `RelatedContent({items: ContentItem[]; title: string})`.

- [ ] **Step 1: Write the failing E2E test**

`tests/e2e/event-detail.spec.ts`:
```ts
import {expect, test} from '@playwright/test';

test.describe('event detail — upcoming', () => {
  test('shows details, agenda, and a demo registration form', async ({page}) => {
    await page.goto('/en/events-news/winter-networking-night-2026');
    await expect(page).toHaveTitle('Winter Networking Night | ELCA Toronto');
    await expect(page.getByRole('heading', {level: 1, name: 'Winter Networking Night'})).toBeVisible();
    await expect(page.getByRole('navigation', {name: 'Breadcrumb'}).getByRole('link', {name: 'Events & News'})).toHaveAttribute(
      'href',
      '/en/events-news',
    );
    await expect(page.getByText('Friday, November 20, 2026')).toBeVisible();
    await expect(page.getByText('80 people')).toBeVisible();
    await expect(page.getByRole('region', {name: 'Agenda'}).getByRole('listitem')).toHaveCount(4);

    const register = page.getByRole('region', {name: 'Register for this event'});
    await register.getByRole('button', {name: 'Register (Demo)'}).click();
    await expect(register.getByText('This field is required.')).toHaveCount(2);
    await register.getByLabel(/^Full name/).fill('Seoyeon');
    await register.getByLabel(/^Email/).fill('seoyeon@example.com');
    await register.getByRole('button', {name: 'Register (Demo)'}).click();
    await expect(register.getByText('Demo — nothing was sent. Your input passed validation.')).toBeVisible();
  });

  test('lists related events', async ({page}) => {
    await page.goto('/en/events-news/winter-networking-night-2026');
    await expect(page.getByRole('region', {name: 'Related'}).getByRole('article')).toHaveCount(3);
  });

  test('is localized', async ({page}) => {
    await page.goto('/ko/events-news/winter-networking-night-2026');
    await expect(page.getByRole('heading', {level: 1, name: '윈터 네트워킹 나이트'})).toBeVisible();
    await expect(page.getByText('80명')).toBeVisible();
  });
});

test.describe('event detail — past', () => {
  test('replaces registration with a recap gallery', async ({page}) => {
    await page.goto('/en/events-news/annual-mentorship-conference-2024');
    await expect(page.getByRole('region', {name: 'Register for this event'})).toHaveCount(0);
    const recap = page.getByRole('region', {name: 'Event recap'});
    await expect(recap.getByRole('button', {name: /^Open photo/})).toHaveCount(3);
    await recap.getByRole('button', {name: /^Open photo/}).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
  });
});

test.describe('post detail', () => {
  test('renders a story with author, body, and breadcrumb', async ({page}) => {
    await page.goto('/en/events-news/from-mentee-to-mentor');
    await expect(page.getByRole('heading', {level: 1, name: 'From Mentee to Mentor: Jiwon’s Story'})).toBeVisible();
    await expect(page.getByText('By ELCA Communications')).toBeVisible();
    await expect(page.getByRole('heading', {level: 2, name: 'Coming back'})).toBeVisible();
    await expect(page.getByRole('region', {name: 'Related'}).getByRole('article')).toHaveCount(3);
  });
});

test('unknown slugs return 404', async ({page}) => {
  const response = await page.goto('/en/events-news/does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', {level: 1, name: 'Page not found'})).toBeVisible();
});
```

Run: `npm run test:e2e -- tests/e2e/event-detail.spec.ts`
Expected: FAIL.

- [ ] **Step 2: Implement**

`components/sections/Breadcrumb.tsx`:
```tsx
import {ChevronRight} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {Link} from '@/lib/i18n/navigation';

export function Breadcrumb({items, current}: {items: {label: string; href: string}[]; current: string}) {
  const t = useTranslations('Common');
  return (
    <nav aria-label={t('breadcrumb')}>
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
        {items.map((item) => (
          <li key={item.href} className="flex items-center gap-2">
            <Link href={item.href} className="inline-flex min-h-11 items-center font-medium text-primary underline-offset-4 hover:underline">
              {item.label}
            </Link>
            <ChevronRight aria-hidden="true" className="size-4" />
          </li>
        ))}
        <li aria-current="page" className="min-w-0 break-words">
          {current}
        </li>
      </ol>
    </nav>
  );
}
```

`components/pages/events-news/EventRegisterForm.tsx`:
```tsx
'use client';

import {useTranslations} from 'next-intl';
import {useId} from 'react';
import {Button} from '@/components/ui/Button';
import {FormFeedback} from '@/components/ui/FormFeedback';
import {FormField} from '@/components/ui/FormField';
import {Input, Textarea} from '@/components/ui/Input';
import {useDemoForm} from '@/lib/forms/useDemoForm';
import {eventRegisterSchema} from '@/lib/validation/forms';

export function EventRegisterForm() {
  const t = useTranslations('Events');
  const tForms = useTranslations('Forms');
  const tErrors = useTranslations('Errors');
  const id = useId();
  const form = useDemoForm(eventRegisterSchema, {name: '', email: '', cohort: '', question: ''});
  const errorFor = (field: keyof typeof form.values) => {
    const key = form.errors[field];
    return key ? tErrors(key) : undefined;
  };

  return (
    <form ref={form.formRef} noValidate onSubmit={form.handleSubmit} className="flex flex-col gap-4">
      <FormField id={`${id}-name`} label={tForms('fields.name')} required error={errorFor('name')}>
        {(a11y) => (
          <Input {...a11y} name="name" autoComplete="name" value={form.values.name} onChange={(event) => form.setValue('name', event.target.value)} onBlur={() => form.handleBlur('name')} />
        )}
      </FormField>
      <FormField id={`${id}-email`} label={tForms('fields.email')} required error={errorFor('email')}>
        {(a11y) => (
          <Input
            {...a11y}
            name="email"
            type="email"
            autoComplete="email"
            value={form.values.email}
            onChange={(event) => form.setValue('email', event.target.value)}
            onBlur={() => form.handleBlur('email')}
          />
        )}
      </FormField>
      <FormField id={`${id}-cohort`} label={tForms('fields.cohort')} error={errorFor('cohort')}>
        {(a11y) => <Input {...a11y} name="cohort" value={form.values.cohort} onChange={(event) => form.setValue('cohort', event.target.value)} />}
      </FormField>
      <FormField id={`${id}-question`} label={tForms('fields.question')} error={errorFor('question')}>
        {(a11y) => (
          <Textarea {...a11y} name="question" rows={3} maxLength={500} value={form.values.question} onChange={(event) => form.setValue('question', event.target.value)} />
        )}
      </FormField>
      <FormFeedback status={form.status} demoMessage={tForms('demoSuccess')} />
      <Button type="submit" className="self-start">
        {t('registerSubmit')}
      </Button>
    </form>
  );
}
```

`components/pages/events-news/RelatedContent.tsx`:
```tsx
import {Section} from '@/components/layout/Section';
import {ContentCard} from '@/components/sections/ContentCard';
import {SectionHeading} from '@/components/sections/SectionHeading';
import type {ContentItem} from '@/types/event';

export function RelatedContent({items, title}: {items: ContentItem[]; title: string}) {
  if (items.length === 0) return null;
  return (
    <Section id="related" labelledBy="related-title" tone="surface">
      <SectionHeading id="related-title" title={title} />
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.slug}>
            <ContentCard item={item} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
```

`components/pages/events-news/EventDetail.tsx`:
```tsx
import {getFormatter, getTranslations} from 'next-intl/server';
import type {ReactNode} from 'react';
import {Container} from '@/components/layout/Container';
import {Section} from '@/components/layout/Section';
import {Breadcrumb} from '@/components/sections/Breadcrumb';
import {Gallery} from '@/components/sections/Gallery';
import {SectionHeading} from '@/components/sections/SectionHeading';
import {Badge} from '@/components/ui/Badge';
import {Button} from '@/components/ui/Button';
import {FlagBadges} from '@/components/ui/FlagBadges';
import {ImageFrame} from '@/components/ui/ImageFrame';
import {RichText} from '@/components/ui/RichText';
import type {ContentItem, EventItem} from '@/types/event';
import {EventRegisterForm} from './EventRegisterForm';
import {RelatedContent} from './RelatedContent';

function DetailItem({label, children}: {label: string; children: ReactNode}) {
  return (
    <div className="flex flex-col gap-1 rounded-card border border-border bg-surface p-4">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="font-semibold text-text">{children}</dd>
    </div>
  );
}

export async function EventDetail({event, related}: {event: EventItem; related: ContentItem[]}) {
  const [t, tNav, format] = await Promise.all([getTranslations('Events'), getTranslations('Nav'), getFormatter()]);
  const when = format.dateTimeRange(new Date(event.startsAt), new Date(event.endsAt), {dateStyle: 'full', timeStyle: 'short'});
  const upcoming = event.status === 'upcoming';

  return (
    <>
      <section aria-labelledby="page-title" className="border-b border-border bg-background">
        <Container className="flex flex-col items-start gap-6 py-12 lg:py-16">
          <Breadcrumb items={[{label: tNav('eventsNews'), href: '/events-news'}]} current={event.title} />
          <div className="flex flex-wrap gap-2">
            <Badge variant="category">{t(`categories.${event.kind === 'workshop' ? 'workshops' : 'events'}`)}</Badge>
            <Badge>{t(`status.${event.status}`)}</Badge>
            <FlagBadges flags={event} />
          </div>
          <h1 id="page-title" className="max-w-heading font-heading text-display font-extrabold text-balance text-text">
            {event.title}
          </h1>
          <p className="max-w-body text-lg text-muted">{event.summary}</p>
          <dl className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DetailItem label={t('when')}>
              <time dateTime={event.startsAt}>{when}</time>
            </DetailItem>
            <DetailItem label={t('where')}>
              {t(`location.${event.location.mode}`)} · {event.location.label}
            </DetailItem>
            {event.audience ? <DetailItem label={t('audience')}>{event.audience}</DetailItem> : null}
            {event.capacity ? <DetailItem label={t('capacity')}>{t('capacityValue', {count: event.capacity})}</DetailItem> : null}
          </dl>
          {upcoming ? (
            <Button href="#register" size="lg">
              {t('register')}
            </Button>
          ) : null}
        </Container>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-8 lg:col-span-8">
            <ImageFrame image={event.coverImage} ratio="16/9" sizes="(min-width: 1024px) 66vw, 100vw" eager />
            <RichText value={event.body} />
            {event.agenda?.length ? (
              <section aria-labelledby="agenda-title">
                <h2 id="agenda-title" className="mb-4 font-heading text-h3 font-bold text-text">
                  {t('agenda')}
                </h2>
                <ol className="divide-y divide-border rounded-card border border-border bg-surface">
                  {event.agenda.map((entry) => (
                    <li key={entry.time} className="flex gap-4 px-5 py-3">
                      <span className="w-14 shrink-0 font-semibold text-secondary">{entry.time}</span>
                      <span>{entry.item}</span>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}
          </div>
          {upcoming ? (
            <section
              id="register"
              aria-labelledby="register-title"
              className="flex flex-col gap-4 self-start rounded-card border border-border bg-surface p-6 lg:col-span-4"
            >
              <h2 id="register-title" className="font-heading text-h3 font-bold text-text">
                {t('register')}
              </h2>
              <p className="text-sm text-muted">{t('registerIntro')}</p>
              <EventRegisterForm />
            </section>
          ) : null}
        </div>
      </Section>

      {!upcoming && event.gallery?.length ? (
        <Section id="recap" labelledBy="recap-title" tone="surface">
          <SectionHeading id="recap-title" title={t('recap')} />
          <Gallery
            items={event.gallery.map((image, index) => ({key: `${event.slug}-${index}`, image, caption: event.title}))}
            label={t('galleryLabel')}
          />
        </Section>
      ) : null}

      <RelatedContent items={related} title={t('related')} />
    </>
  );
}
```

`components/pages/events-news/PostDetail.tsx`:
```tsx
import {getFormatter, getTranslations} from 'next-intl/server';
import {Container} from '@/components/layout/Container';
import {Section} from '@/components/layout/Section';
import {Breadcrumb} from '@/components/sections/Breadcrumb';
import {Badge} from '@/components/ui/Badge';
import {FlagBadges} from '@/components/ui/FlagBadges';
import {ImageFrame} from '@/components/ui/ImageFrame';
import {RichText} from '@/components/ui/RichText';
import type {ContentItem, Post} from '@/types/event';
import {RelatedContent} from './RelatedContent';

export async function PostDetail({post, related}: {post: Post; related: ContentItem[]}) {
  const [t, tNav, format] = await Promise.all([getTranslations('Events'), getTranslations('Nav'), getFormatter()]);
  return (
    <>
      <section aria-labelledby="page-title" className="border-b border-border bg-background">
        <Container className="flex flex-col items-start gap-6 py-12 lg:py-16">
          <Breadcrumb items={[{label: tNav('eventsNews'), href: '/events-news'}]} current={post.title} />
          <div className="flex flex-wrap gap-2">
            <Badge variant="category">{t(`categories.${post.kind === 'story' ? 'stories' : 'news'}`)}</Badge>
            <FlagBadges flags={post} />
          </div>
          <h1 id="page-title" className="max-w-heading font-heading text-display font-extrabold text-balance text-text">
            {post.title}
          </h1>
          <p className="flex flex-wrap gap-x-3 text-muted">
            <time dateTime={post.publishedAt}>{format.dateTime(new Date(post.publishedAt), {dateStyle: 'long'})}</time>
            {post.author ? <span>{t('byAuthor', {author: post.author})}</span> : null}
          </p>
        </Container>
      </section>
      <Section>
        <div className="mx-auto flex max-w-heading flex-col gap-8">
          <ImageFrame image={post.coverImage} ratio="16/9" sizes="(min-width: 1024px) 56rem, 100vw" eager />
          <RichText value={post.body} className="text-lg" />
        </div>
      </Section>
      <RelatedContent items={related} title={t('related')} />
    </>
  );
}
```

`app/[locale]/events-news/[slug]/page.tsx`:
```tsx
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {EventDetail} from '@/components/pages/events-news/EventDetail';
import {PostDetail} from '@/components/pages/events-news/PostDetail';
import {getAllContentSlugs, getContentBySlug, getRelated} from '@/lib/content/content';
import {assertLocale} from '@/lib/i18n/locale';
import {buildPageMetadata} from '@/lib/i18n/metadata';

// Every slug × locale is prerendered. Unknown slugs render on request and call notFound() (HTTP 404).
export async function generateStaticParams() {
  return (await getAllContentSlugs()).map((slug) => ({slug}));
}

export async function generateMetadata({params}: PageProps<'/[locale]/events-news/[slug]'>): Promise<Metadata> {
  const {locale: rawLocale, slug} = await params;
  const locale = assertLocale(rawLocale);
  const item = await getContentBySlug(locale, slug);
  if (!item) return {};
  return buildPageMetadata({
    locale,
    path: `/events-news/${slug}`,
    title: item.title,
    description: item.type === 'event' ? item.summary : item.excerpt,
    image: item.coverImage,
  });
}

export default async function ContentDetailPage({params}: PageProps<'/[locale]/events-news/[slug]'>) {
  const {locale: rawLocale, slug} = await params;
  const locale = assertLocale(rawLocale);
  const item = await getContentBySlug(locale, slug);
  if (!item) notFound();
  const related = await getRelated(locale, slug);

  return item.type === 'event' ? <EventDetail event={item} related={related} /> : <PostDetail post={item} related={related} />;
}
```

- [ ] **Step 3: Run the milestone suite**

Run: `npm run typecheck && npm run lint && npm run test && npm run test:e2e`
Expected: all PASS. The build output lists 18 slugs × 2 locales under `/[locale]/events-news/[slug]`.

- [ ] **Step 4: Commit**

```bash
git add components app tests
git commit -m "$(cat <<'EOF'
feat: add event and post detail pages with demo registration and recap

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

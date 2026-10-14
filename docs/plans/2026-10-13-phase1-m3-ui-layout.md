# Phase 1 · M3 UI Primitives & Global Layout (Tasks 9–13)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Read [the index](2026-10-13-phase1-00-index.md) first — its **Global Constraints** apply to every task.

**Milestone goal:** Accessible UI primitives (shown on a dev-only UI Lab page that doubles as a designer showcase), the global Header/Footer/Floating UI, and the demo-form infrastructure.

**Spec references:** [03-layout-and-components.md](../specs/03-layout-and-components.md) (all), [02-design-system.md](../specs/02-design-system.md) §6–§7.

**UI Lab:** `app/[locale]/ui-lab` renders every primitive. It returns 404 unless `NEXT_PUBLIC_ENABLE_UI_LAB=1` at build time (Playwright sets it), is `noindex`, and is disallowed in `robots.txt` (Task 24). It is the only place allowed to hardcode demo copy.

---

### Task 9: Static UI primitives and the UI Lab page

**Files:**
- Create: `lib/utils/avatar.ts`, `lib/utils/motion.ts`
- Create: `components/ui/Button.tsx`, `components/ui/Badge.tsx`, `components/ui/FlagBadges.tsx`, `components/ui/Icon.tsx`, `components/ui/SocialMark.tsx`, `components/ui/Avatar.tsx`, `components/ui/ImageFrame.tsx`, `components/ui/RichText.tsx`, `components/ui/EmptyState.tsx`
- Create: `app/[locale]/ui-lab/page.tsx`
- Modify: `app/[locale]/not-found.tsx` (use `Button`)
- Test: `tests/unit/utils/avatar.test.ts`, `tests/e2e/ui-lab.spec.ts`

**Interfaces:**
- Consumes: tokens + `cn` (Task 2), `Link` (Task 1), types (Task 4), messages `Common.*` (Task 3).
- Produces:
  - `getInitials(name: string): string`, `AVATAR_TONES`, `avatarTone(seed: string)`; `prefersReducedMotion(): boolean`.
  - `Button` props: `{variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'inverse' | 'on-dark'; size?: 'md' | 'lg'; icon?: ReactNode; iconPosition?: 'start' | 'end'; className?; children}` plus either native `<button>` props, or `href: string` (+ anchor props). `buttonClasses(options)` returns the class string. `isExternalHref(href)`.
  - `Badge({variant?: 'neutral' | 'category' | 'sample' | 'review' | 'demo'; className?; children})`.
  - `FlagBadges({flags: Flags; className?})` — renders nothing when no flag is set.
  - `Icon({name: IconName; className?})`, `SocialMark({network: 'facebook' | 'linkedin'; className?})`.
  - `Avatar({name: string; seed?: string; size?: 'md' | 'lg'; photo?: ImageView})`.
  - `ImageFrame({image: ImageView; ratio?: '3/2' | '16/9' | '1/1' | '4/3'; sizes: string; eager?: boolean; rounded?: boolean; className?})`.
  - `RichText({value: RichText; className?})`.
  - `EmptyState({title: string; body?: string; icon?: ReactNode; action?: ReactNode})`.

- [ ] **Step 1: Write the failing avatar unit test**

`tests/unit/utils/avatar.test.ts`:
```ts
import {describe, expect, it} from 'vitest';
import {AVATAR_TONES, avatarTone, getInitials} from '@/lib/utils/avatar';

describe('getInitials', () => {
  it('uses first and last initials for Latin names', () => {
    expect(getInitials('Jiwon Kim')).toBe('JK');
    expect(getInitials('Seoyeon K.')).toBe('SK');
    expect(getInitials('  taeyoung   moon ')).toBe('TM');
    expect(getInitials('Madonna')).toBe('M');
  });

  it('uses the family name syllable for Korean names', () => {
    expect(getInitials('김지원')).toBe('김');
    expect(getInitials('서연 K.')).toBe('서');
  });

  it('returns a placeholder for blank names', () => {
    expect(getInitials('   ')).toBe('?');
  });
});

describe('avatarTone', () => {
  it('is deterministic and picks from the token palette', () => {
    expect(avatarTone('jiwon-kim')).toBe(avatarTone('jiwon-kim'));
    expect(AVATAR_TONES).toContain(avatarTone('anything'));
  });
});
```

Run: `npm run test -- tests/unit/utils/avatar.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 2: Implement utilities**

`lib/utils/avatar.ts`:
```ts
const HANGUL_START = /^[ᄀ-ᇿ㄰-㆏가-힯]/;

export function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  if (HANGUL_START.test(trimmed)) return trimmed[0];
  const parts = trimmed.split(/\s+/);
  const first = parts[0][0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : '';
  return `${first}${last}`.toUpperCase();
}

/** Background tokens that all pass AA with white text. */
export const AVATAR_TONES = ['bg-primary', 'bg-secondary', 'bg-accent-strong', 'bg-text'] as const;

export function avatarTone(seed: string): (typeof AVATAR_TONES)[number] {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + (char.codePointAt(0) ?? 0)) >>> 0;
  return AVATAR_TONES[hash % AVATAR_TONES.length];
}
```

`lib/utils/motion.ts`:
```ts
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
```

Run: `npm run test -- tests/unit/utils/avatar.test.ts`
Expected: PASS.

- [ ] **Step 3: Implement the static primitives**

`components/ui/Button.tsx`:
```tsx
import type {ComponentProps, ReactNode} from 'react';
import {Link} from '@/lib/i18n/navigation';
import {cn} from '@/lib/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'inverse' | 'on-dark';
export type ButtonSize = 'md' | 'lg';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary hover:bg-primary-hover',
  secondary: 'border border-primary bg-surface text-primary hover:bg-background',
  accent: 'bg-accent text-on-primary hover:bg-accent-strong',
  ghost: 'text-primary hover:bg-border/60',
  inverse: 'bg-on-primary text-primary hover:bg-background',
  'on-dark': 'border border-on-primary text-on-primary hover:bg-on-primary hover:text-primary',
};

const sizeClasses: Record<ButtonSize, string> = {
  md: 'min-h-11 px-4 text-sm',
  lg: 'min-h-12 px-6 text-base',
};

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  className,
}: {variant?: ButtonVariant; size?: ButtonSize; className?: string} = {}): string {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-button text-center font-semibold transition-colors duration-150',
    'disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

export function isExternalHref(href: string): boolean {
  return /^https?:\/\//.test(href);
}

type BaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: 'start' | 'end';
  className?: string;
  children: ReactNode;
};

type NativeButtonProps = BaseProps & Omit<ComponentProps<'button'>, keyof BaseProps> & {href?: undefined};
type LinkButtonProps = BaseProps & Omit<ComponentProps<'a'>, keyof BaseProps | 'href'> & {href: string};

/** Renders a locale-aware Link for internal paths, <a> for anchors/mailto/external URLs, otherwise <button>. */
export function Button(props: NativeButtonProps | LinkButtonProps) {
  const {variant, size, icon, iconPosition = 'end', className, children, ...rest} = props;
  const classes = buttonClasses({variant, size, className});
  const content = (
    <>
      {icon && iconPosition === 'start' ? icon : null}
      <span>{children}</span>
      {icon && iconPosition === 'end' ? icon : null}
    </>
  );

  if (typeof rest.href === 'string') {
    const {href, ...anchorProps} = rest as Omit<LinkButtonProps, keyof BaseProps>;
    if (isExternalHref(href)) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...anchorProps}>
          {content}
        </a>
      );
    }
    if (href.startsWith('#') || href.startsWith('mailto:')) {
      return (
        <a href={href} className={classes} {...anchorProps}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {content}
      </Link>
    );
  }

  const {type = 'button', ...buttonProps} = rest as Omit<NativeButtonProps, keyof BaseProps>;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {content}
    </button>
  );
}
```

`components/ui/Badge.tsx`:
```tsx
import type {ReactNode} from 'react';
import {cn} from '@/lib/utils/cn';

export type BadgeVariant = 'neutral' | 'category' | 'sample' | 'review' | 'demo';

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'border border-border bg-background text-text',
  category: 'bg-secondary text-on-primary',
  sample: 'border border-dashed border-border-strong bg-surface text-muted',
  review: 'border border-accent-strong bg-surface text-accent-strong',
  demo: 'bg-text text-on-primary',
};

export function Badge({variant = 'neutral', className, children}: {variant?: BadgeVariant; className?: string; children: ReactNode}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
```

`components/ui/FlagBadges.tsx`:
```tsx
import {useTranslations} from 'next-intl';
import {cn} from '@/lib/utils/cn';
import type {Flags} from '@/types/common';
import {Badge} from './Badge';

export function FlagBadges({flags, className}: {flags: Flags; className?: string}) {
  const t = useTranslations('Common');
  if (!flags.isSample && !flags.needsReview) return null;
  return (
    <span className={cn('inline-flex flex-wrap gap-1.5', className)}>
      {flags.isSample ? <Badge variant="sample">{t('sample')}</Badge> : null}
      {flags.needsReview ? <Badge variant="review">{t('needsReview')}</Badge> : null}
    </span>
  );
}
```

`components/ui/Icon.tsx`:
```tsx
import {
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  Compass,
  GraduationCap,
  Handshake,
  Heart,
  Lightbulb,
  MessageCircle,
  Rocket,
  Sparkles,
  Sprout,
  Target,
  TrendingUp,
  Users,
  type LucideIcon,
} from 'lucide-react';
import {cn} from '@/lib/utils/cn';
import type {IconName} from '@/types/common';

const ICONS: Record<IconName, LucideIcon> = {
  award: Award,
  bookOpen: BookOpen,
  briefcase: Briefcase,
  calendar: Calendar,
  compass: Compass,
  graduationCap: GraduationCap,
  handshake: Handshake,
  heart: Heart,
  lightbulb: Lightbulb,
  messageCircle: MessageCircle,
  rocket: Rocket,
  sparkles: Sparkles,
  sprout: Sprout,
  target: Target,
  trendingUp: TrendingUp,
  users: Users,
};

export function Icon({name, className}: {name: IconName; className?: string}) {
  const Component = ICONS[name];
  return <Component aria-hidden="true" focusable="false" className={cn('size-6', className)} />;
}
```

`components/ui/SocialMark.tsx`:
```tsx
import {cn} from '@/lib/utils/cn';

// lucide-react 1.x ships no brand icons; lettermarks stand in until the designer supplies official marks.
const MARKS = {facebook: 'f', linkedin: 'in'} as const;

export function SocialMark({network, className}: {network: keyof typeof MARKS; className?: string}) {
  return (
    <span
      aria-hidden="true"
      className={cn('inline-flex size-9 items-center justify-center rounded-full border border-current font-heading text-sm font-bold', className)}
    >
      {MARKS[network]}
    </span>
  );
}
```

`components/ui/Avatar.tsx`:
```tsx
import Image from 'next/image';
import {avatarTone, getInitials} from '@/lib/utils/avatar';
import {cn} from '@/lib/utils/cn';
import type {ImageView} from '@/types/common';

const SIZES = {md: 'size-12 text-base', lg: 'size-16 text-xl'} as const;

/** Decorative: the person's name is always rendered as text next to it. */
export function Avatar({name, seed, size = 'md', photo}: {name: string; seed?: string; size?: keyof typeof SIZES; photo?: ImageView}) {
  if (photo) {
    return (
      <span className={cn('relative inline-block shrink-0 overflow-hidden rounded-full', SIZES[size])}>
        <Image src={photo.url} alt="" fill sizes="4rem" className="object-cover" />
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-heading font-bold text-on-primary',
        avatarTone(seed ?? name),
        SIZES[size],
      )}
    >
      {getInitials(name)}
    </span>
  );
}
```

`components/ui/ImageFrame.tsx`:
```tsx
import Image from 'next/image';
import {cn} from '@/lib/utils/cn';
import type {ImageView} from '@/types/common';

const RATIOS = {
  '3/2': 'aspect-3/2',
  '16/9': 'aspect-video',
  '1/1': 'aspect-square',
  '4/3': 'aspect-4/3',
} as const;

type ImageFrameProps = {
  image: ImageView;
  ratio?: keyof typeof RATIOS;
  sizes: string;
  /** Load immediately with high priority (above-the-fold images only). */
  eager?: boolean;
  rounded?: boolean;
  className?: string;
};

/** Fixed aspect-ratio box so images never shift layout. */
export function ImageFrame({image, ratio = '3/2', sizes, eager, rounded = true, className}: ImageFrameProps) {
  return (
    <div className={cn('relative overflow-hidden bg-border', RATIOS[ratio], rounded && 'rounded-card', className)}>
      <Image
        src={image.url}
        alt={image.alt}
        fill
        sizes={sizes}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
        className="object-cover"
      />
    </div>
  );
}
```

`components/ui/RichText.tsx`:
```tsx
import {PortableText, type PortableTextComponents} from '@portabletext/react';
import {cn} from '@/lib/utils/cn';
import type {RichText as RichTextValue} from '@/types/common';

const components: PortableTextComponents = {
  block: {
    normal: ({children}) => <p>{children}</p>,
    h2: ({children}) => <h2 className="mt-4 font-heading text-h3 font-bold text-text">{children}</h2>,
    h3: ({children}) => <h3 className="mt-2 font-heading text-lg font-semibold text-text">{children}</h3>,
  },
  list: {
    bullet: ({children}) => <ul className="list-disc space-y-1 ps-6">{children}</ul>,
    number: ({children}) => <ol className="list-decimal space-y-1 ps-6">{children}</ol>,
  },
  marks: {
    link: ({value, children}) => {
      const href = (value as {href?: string} | undefined)?.href ?? '#';
      const external = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          className="font-medium text-secondary underline underline-offset-4"
          {...(external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
        >
          {children}
        </a>
      );
    },
  },
};

export function RichText({value, className}: {value: RichTextValue; className?: string}) {
  return (
    <div className={cn('flex max-w-body flex-col gap-4 text-base text-text', className)}>
      <PortableText value={value} components={components} />
    </div>
  );
}
```

`components/ui/EmptyState.tsx`:
```tsx
import type {ReactNode} from 'react';

export function EmptyState({title, body, icon, action}: {title: string; body?: string; icon?: ReactNode; action?: ReactNode}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-border-strong bg-surface px-6 py-12 text-center">
      {icon}
      <p className="font-heading text-lg font-semibold text-text">{title}</p>
      {body ? <p className="max-w-body text-muted">{body}</p> : null}
      {action}
    </div>
  );
}
```

`app/[locale]/not-found.tsx` (replace the link with a button):
```tsx
import {useTranslations} from 'next-intl';
import {Section} from '@/components/layout/Section';
import {Button} from '@/components/ui/Button';

export default function NotFound() {
  const t = useTranslations('NotFound');
  return (
    <Section>
      <div className="flex max-w-body flex-col items-start gap-4">
        <h1 className="font-heading text-display font-extrabold text-text">{t('title')}</h1>
        <p className="text-lg text-muted">{t('body')}</p>
        <Button href="/">{t('backHome')}</Button>
      </div>
    </Section>
  );
}
```

- [ ] **Step 4: Create the UI Lab page**

`app/[locale]/ui-lab/page.tsx`:
```tsx
import type {Metadata} from 'next';
import {ArrowRight, SearchX} from 'lucide-react';
import {notFound} from 'next/navigation';
import {Section} from '@/components/layout/Section';
import {Avatar} from '@/components/ui/Avatar';
import {Badge} from '@/components/ui/Badge';
import {Button} from '@/components/ui/Button';
import {EmptyState} from '@/components/ui/EmptyState';
import {FlagBadges} from '@/components/ui/FlagBadges';
import {Icon} from '@/components/ui/Icon';
import {ImageFrame} from '@/components/ui/ImageFrame';
import {RichText} from '@/components/ui/RichText';
import {SocialMark} from '@/components/ui/SocialMark';
import {pt} from '@/lib/utils/pt';

export const metadata: Metadata = {title: 'UI Lab', robots: {index: false, follow: false}};

const demoImage = {
  url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&h=800&q=80',
  alt: 'Three young adults talking around a café table with laptops',
  width: 1200,
  height: 800,
};

// Developer/designer showcase. Hardcoded copy is allowed only on this page.
export default function UiLabPage() {
  if (process.env.NEXT_PUBLIC_ENABLE_UI_LAB !== '1') notFound();

  return (
    <>
      <Section>
        <h1 className="font-heading text-display font-extrabold text-text">UI Lab</h1>
      </Section>

      <Section id="buttons" labelledBy="buttons-title" tone="surface">
        <h2 id="buttons-title" className="mb-6 font-heading text-h2 font-bold">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="ghost">Ghost</Button>
          <Button href="/about" icon={<ArrowRight aria-hidden="true" className="size-4" />}>
            Internal link
          </Button>
          <Button href="#buttons" variant="secondary">
            Anchor link
          </Button>
          <Button href="https://example.com" variant="secondary">
            External link
          </Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="on-dark mt-6 flex flex-wrap gap-3 rounded-card bg-primary p-6">
          <Button variant="inverse">Inverse</Button>
          <Button variant="on-dark">On dark</Button>
        </div>
      </Section>

      <Section id="badges" labelledBy="badges-title">
        <h2 id="badges-title" className="mb-6 font-heading text-h2 font-bold">Badges, avatars, icons</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Neutral</Badge>
          <Badge variant="category">Workshop</Badge>
          <Badge variant="demo">Demo</Badge>
          <FlagBadges flags={{isSample: true, needsReview: true}} />
          <Avatar name="Jiwon Kim" seed="jiwon-kim" />
          <Avatar name="김지원" seed="jiwon-kim" size="lg" />
          <Icon name="compass" className="text-secondary" />
          <SocialMark network="facebook" className="text-primary" />
          <SocialMark network="linkedin" className="text-primary" />
        </div>
      </Section>

      <Section id="media" labelledBy="media-title" tone="surface">
        <h2 id="media-title" className="mb-6 font-heading text-h2 font-bold">Media and text</h2>
        <div className="grid gap-8 lg:grid-cols-2">
          <ImageFrame image={demoImage} ratio="3/2" sizes="(min-width: 1024px) 50vw, 100vw" />
          <RichText value={pt('A paragraph of rich text.\n\n## A heading\n\n- First item\n- Second item')} />
        </div>
        <div className="mt-8">
          <EmptyState
            icon={<SearchX aria-hidden="true" className="size-8 text-muted" />}
            title="Nothing here yet"
            body="Empty states explain what happened and what to do next."
            action={<Button variant="secondary">Reset</Button>}
          />
        </div>
      </Section>
    </>
  );
}
```

- [ ] **Step 5: Write the UI Lab E2E test**

`tests/e2e/ui-lab.spec.ts`:
```ts
import {expect, test} from '@playwright/test';

test.describe('UI Lab — static primitives', () => {
  test('renders buttons with the right link behaviour', async ({page}) => {
    await page.goto('/en/ui-lab');
    await expect(page.getByRole('heading', {level: 1, name: 'UI Lab'})).toBeVisible();
    await expect(page.getByRole('link', {name: 'Internal link'})).toHaveAttribute('href', '/en/about');
    await expect(page.getByRole('link', {name: 'Anchor link'})).toHaveAttribute('href', '#buttons');
    const external = page.getByRole('link', {name: 'External link'});
    await expect(external).toHaveAttribute('target', '_blank');
    await expect(external).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(page.getByRole('button', {name: 'Disabled'})).toBeDisabled();
  });

  test('shows localized flag badges and initials', async ({page}) => {
    await page.goto('/ko/ui-lab');
    await expect(page.getByText('샘플', {exact: true})).toBeVisible();
    await expect(page.getByText('검수 필요', {exact: true})).toBeVisible();
    await expect(page.getByText('JK', {exact: true})).toBeVisible();
    await expect(page.getByText('김', {exact: true})).toBeVisible();
  });

  test('keeps images in a fixed 3:2 frame', async ({page}) => {
    await page.goto('/en/ui-lab');
    const image = page.getByRole('img', {name: 'Three young adults talking around a café table with laptops'});
    await expect(image).toBeVisible();
    const box = await image.locator('xpath=..').boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width / box!.height).toBeCloseTo(1.5, 1);
  });

  test('the 404 page offers a way home', async ({page}) => {
    await page.goto('/en/nope');
    await expect(page.getByRole('link', {name: 'Back to home'})).toHaveAttribute('href', '/en');
  });
});
```

Run: `npm run test:e2e -- tests/e2e/ui-lab.spec.ts`
Expected: PASS.

- [ ] **Step 6: Typecheck, lint, commit**

Run: `npm run typecheck && npm run lint && npm run test`

```bash
git add lib/utils components/ui app tests
git commit -m "$(cat <<'EOF'
feat: add static UI primitives and dev-only UI Lab

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 10: Interactive primitives (overlay registry, Dialog, Accordion, Tabs, Scroller)

**Files:**
- Create: `components/layout/OverlayProvider.tsx`, `components/ui/Dialog.tsx`, `components/ui/Accordion.tsx`, `components/ui/Tabs.tsx`, `components/ui/Scroller.tsx`, `components/pages/ui-lab/UiLabDemos.tsx`
- Modify: `app/[locale]/layout.tsx` (wrap in `OverlayProvider`), `app/[locale]/ui-lab/page.tsx` (add demos)
- Test: `tests/e2e/ui-lab.spec.ts` (extend)

**Interfaces:**
- Consumes: `cn`, `Button`, messages `Common.close|previous|next|scrollerLabel`.
- Produces:
  - `OverlayProvider({children})`, `useOverlayCount(): number`, `useRegisterOverlay(active: boolean): void`.
  - `Dialog({open: boolean; onClose: () => void; title: string; titleHidden?: boolean; description?: string; variant?: 'modal' | 'drawer' | 'lightbox'; size?: 'md' | 'lg'; children})` — native `<dialog>`; Esc, close button, and backdrop click call `onClose`; Tab wraps inside; restores focus; locks page scroll; registers as an overlay.
  - `Accordion({items: {id: string; title: string; content: ReactNode}[]; className?})` — server-compatible `<details>`.
  - `Tabs({label: string; items: {id: string; label: string}[]; value: string; onValueChange: (id: string) => void; children; className?})` — WAI-ARIA tabs with one shared tabpanel.
  - `Scroller({label: string; items: {key: string; node: ReactNode}[]; itemClassName?: string})` — horizontal scroll-snap list with previous/next buttons and a focusable scroll region.

- [ ] **Step 1: Write the failing E2E tests**

Append to `tests/e2e/ui-lab.spec.ts`:
```ts
test.describe('UI Lab — interactive primitives', () => {
  test('dialog opens, traps the page, and closes with Escape', async ({page}) => {
    await page.goto('/en/ui-lab');
    const opener = page.getByRole('button', {name: 'Open dialog'});
    await opener.click();
    const dialog = page.getByRole('dialog', {name: 'Demo dialog'});
    await expect(dialog).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('hidden');
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('');
  });

  test('dialog closes from the close button and the backdrop', async ({page}) => {
    await page.goto('/en/ui-lab');
    await page.getByRole('button', {name: 'Open dialog'}).click();
    await page.getByRole('dialog').getByRole('button', {name: 'Close'}).click();
    await expect(page.getByRole('dialog')).toBeHidden();

    await page.getByRole('button', {name: 'Open dialog'}).click();
    await page.mouse.click(5, 5);
    await expect(page.getByRole('dialog')).toBeHidden();
  });

  test('tabs follow the WAI-ARIA keyboard pattern', async ({page}) => {
    await page.goto('/en/ui-lab');
    const first = page.getByRole('tab', {name: 'First'});
    await first.focus();
    await page.keyboard.press('ArrowRight');
    const second = page.getByRole('tab', {name: 'Second'});
    await expect(second).toBeFocused();
    await expect(second).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel')).toContainText('Second panel');
    await page.keyboard.press('End');
    await expect(page.getByRole('tab', {name: 'Third'})).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('ArrowRight');
    await expect(first).toHaveAttribute('aria-selected', 'true');
  });

  test('accordion items expand and collapse', async ({page}) => {
    await page.goto('/en/ui-lab');
    const item = page.locator('details', {hasText: 'What is an accordion?'});
    await expect(item).not.toHaveAttribute('open', '');
    await item.locator('summary').click();
    await expect(item).toHaveAttribute('open', '');
    await expect(item.getByText('It shows and hides content.')).toBeVisible();
  });

  test('scroller moves with the next button', async ({page}) => {
    await page.goto('/en/ui-lab');
    const list = page.getByRole('list', {name: /Scroller demo/});
    const before = await list.evaluate((el) => el.scrollLeft);
    await page.getByRole('button', {name: 'Next'}).first().click();
    await expect.poll(() => list.evaluate((el) => el.scrollLeft)).toBeGreaterThan(before);
  });
});
```

Run: `npm run test:e2e -- tests/e2e/ui-lab.spec.ts`
Expected: the new tests FAIL (no demos yet).

- [ ] **Step 2: Implement the overlay registry and primitives**

`components/layout/OverlayProvider.tsx`:
```tsx
'use client';

import {createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode} from 'react';

type OverlayContextValue = {count: number; register: () => void; unregister: () => void};

const OverlayContext = createContext<OverlayContextValue | null>(null);

/** Counts open overlays (dialogs, drawers, menus) so floating UI can hide while any is open. */
export function OverlayProvider({children}: {children: ReactNode}) {
  const [count, setCount] = useState(0);
  const register = useCallback(() => setCount((current) => current + 1), []);
  const unregister = useCallback(() => setCount((current) => Math.max(0, current - 1)), []);
  const value = useMemo(() => ({count, register, unregister}), [count, register, unregister]);
  return <OverlayContext value={value}>{children}</OverlayContext>;
}

function useOverlayContext(): OverlayContextValue {
  const context = useContext(OverlayContext);
  if (!context) throw new Error('OverlayProvider is missing from the layout.');
  return context;
}

export function useOverlayCount(): number {
  return useOverlayContext().count;
}

/** Registers an open overlay; unregisters when it closes or unmounts (e.g. on navigation). */
export function useRegisterOverlay(active: boolean): void {
  const {register, unregister} = useOverlayContext();
  useEffect(() => {
    if (!active) return;
    register();
    return unregister;
  }, [active, register, unregister]);
}
```

`components/ui/Dialog.tsx`:
```tsx
'use client';

import {X} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useEffect, useId, useRef, type ReactNode} from 'react';
import {useRegisterOverlay} from '@/components/layout/OverlayProvider';
import {cn} from '@/lib/utils/cn';

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  titleHidden?: boolean;
  description?: string;
  variant?: 'modal' | 'drawer' | 'lightbox';
  size?: 'md' | 'lg';
  children: ReactNode;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

const variantClasses = {
  modal: 'm-auto max-h-[90dvh] w-[calc(100%-2rem)] rounded-card',
  drawer: 'my-0 me-0 ms-auto h-dvh max-h-dvh w-full max-w-sm',
  lightbox: 'm-auto max-h-[92dvh] w-[calc(100%-2rem)] max-w-5xl rounded-card',
} as const;

export function Dialog({open, onClose, title, titleHidden, description, variant = 'modal', size = 'md', children}: DialogProps) {
  const t = useTranslations('Common');
  const ref = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useRegisterOverlay(open);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
      document.documentElement.style.overflow = 'hidden';
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleClose = () => {
      document.documentElement.style.overflow = '';
      returnFocusRef.current?.focus();
      onClose();
    };
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  // If the dialog unmounts while open (e.g. browser Back), release the scroll lock.
  useEffect(() => () => {
    document.documentElement.style.overflow = '';
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className={cn(
        'bg-surface p-0 text-text shadow-float backdrop:bg-overlay',
        variantClasses[variant],
        variant === 'modal' && (size === 'lg' ? 'max-w-3xl' : 'max-w-2xl'),
      )}
      onClick={(event) => {
        // Clicks on the <dialog> element itself (not its content) are backdrop clicks.
        if (event.target === event.currentTarget) ref.current?.close();
      }}
      onKeyDown={(event) => {
        // Keep Tab inside the dialog (browsers may otherwise move focus to their own UI).
        if (event.key !== 'Tab' || !ref.current) return;
        const focusable = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
          (element) => element.getClientRects().length > 0,
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
    >
      <div className="flex h-full max-h-[inherit] flex-col">
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <h2 id={titleId} className={cn('font-heading text-xl font-bold text-text', titleHidden && 'sr-only')}>
            {title}
          </h2>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label={t('close')}
            className="-me-2 ms-auto inline-flex size-11 shrink-0 items-center justify-center rounded-button text-text transition-colors duration-150 hover:bg-background"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
        {description ? (
          <p id={descriptionId} className="px-6 pt-4 text-muted">
            {description}
          </p>
        ) : null}
        <div className="overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </dialog>
  );
}
```

`components/ui/Accordion.tsx`:
```tsx
import {ChevronDown} from 'lucide-react';
import type {ReactNode} from 'react';
import {cn} from '@/lib/utils/cn';

export type AccordionItem = {id: string; title: string; content: ReactNode};

/** Native <details>: keyboard and screen-reader support come from the browser. */
export function Accordion({items, className}: {items: AccordionItem[]; className?: string}) {
  return (
    <div className={cn('divide-y divide-border rounded-card border border-border bg-surface', className)}>
      {items.map((item) => (
        <details key={item.id} id={item.id} className="group">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-heading text-base font-semibold text-text [&::-webkit-details-marker]:hidden">
            <span>{item.title}</span>
            <ChevronDown
              aria-hidden="true"
              className="size-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
            />
          </summary>
          <div className="px-5 pb-5 text-text">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
```

`components/ui/Tabs.tsx`:
```tsx
'use client';

import {useId, useRef, type KeyboardEvent, type ReactNode} from 'react';
import {cn} from '@/lib/utils/cn';

export type TabItem = {id: string; label: string};

type TabsProps = {
  label: string;
  items: TabItem[];
  value: string;
  onValueChange: (id: string) => void;
  children: ReactNode;
  className?: string;
};

/** WAI-ARIA tabs (automatic activation). The parent renders the active panel's content as children. */
export function Tabs({label, items, value, onValueChange, children, className}: TabsProps) {
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = Math.max(0, items.findIndex((item) => item.id === value));
  const activeItem = items[activeIndex];

  function activate(index: number) {
    const next = (index + items.length) % items.length;
    onValueChange(items[next].id);
    tabRefs.current[next]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const targets: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: items.length - 1,
    };
    if (event.key in targets) {
      event.preventDefault();
      activate(targets[event.key]);
    }
  }

  return (
    <div className={className}>
      <div role="tablist" aria-label={label} className="flex gap-1 overflow-x-auto border-b border-border">
        {items.map((item, index) => {
          const selected = index === activeIndex;
          return (
            <button
              key={item.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onValueChange(item.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                '-mb-px min-h-11 shrink-0 whitespace-nowrap border-b-2 px-4 text-sm font-semibold transition-colors duration-150',
                selected ? 'border-secondary text-text' : 'border-transparent text-muted hover:text-text',
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={activeItem ? `${baseId}-tab-${activeItem.id}` : undefined}
        tabIndex={0}
        className="pt-8"
      >
        {children}
      </div>
    </div>
  );
}
```

`components/ui/Scroller.tsx`:
```tsx
'use client';

import {ChevronLeft, ChevronRight} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useRef, type ReactNode} from 'react';
import {cn} from '@/lib/utils/cn';
import {prefersReducedMotion} from '@/lib/utils/motion';

type ScrollerProps = {
  label: string;
  items: {key: string; node: ReactNode}[];
  /** Width classes for each item, e.g. 'w-[85%] sm:w-[45%] lg:w-[calc((100%-3rem)/3)]'. */
  itemClassName?: string;
};

const controlClass =
  'inline-flex size-11 items-center justify-center rounded-full border border-border bg-surface text-primary transition-colors duration-150 hover:bg-background';

/** Horizontal, snap-scrolling list. The list itself is focusable so arrow keys scroll it. */
export function Scroller({label, items, itemClassName = 'w-[85%] sm:w-[45%] lg:w-[calc((100%-3rem)/3)]'}: ScrollerProps) {
  const t = useTranslations('Common');
  const listRef = useRef<HTMLUListElement>(null);

  function scrollByItem(direction: 1 | -1) {
    const list = listRef.current;
    if (!list) return;
    const first = list.querySelector('li');
    const step = first ? first.getBoundingClientRect().width + 24 : list.clientWidth;
    list.scrollBy({left: direction * step, behavior: prefersReducedMotion() ? 'auto' : 'smooth'});
  }

  return (
    <div>
      <div className="mb-4 flex justify-end gap-2">
        <button type="button" onClick={() => scrollByItem(-1)} aria-label={t('previous')} className={controlClass}>
          <ChevronLeft aria-hidden="true" className="size-5" />
        </button>
        <button type="button" onClick={() => scrollByItem(1)} aria-label={t('next')} className={controlClass}>
          <ChevronRight aria-hidden="true" className="size-5" />
        </button>
      </div>
      <ul
        ref={listRef}
        tabIndex={0}
        aria-label={t('scrollerLabel', {label})}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4"
      >
        {items.map((item) => (
          <li key={item.key} className={cn('shrink-0 snap-start', itemClassName)}>
            {item.node}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 3: Add the demos to the UI Lab and the provider to the layout**

`components/pages/ui-lab/UiLabDemos.tsx`:
```tsx
'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/Button';
import {Dialog} from '@/components/ui/Dialog';
import {Scroller} from '@/components/ui/Scroller';
import {Tabs} from '@/components/ui/Tabs';

const TAB_ITEMS = [
  {id: 'first', label: 'First'},
  {id: 'second', label: 'Second'},
  {id: 'third', label: 'Third'},
];

// Dev-only demos for the UI Lab page.
export function UiLabDemos() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('first');

  return (
    <div className="flex flex-col gap-12">
      <div>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <Dialog open={open} onClose={() => setOpen(false)} title="Demo dialog" description="Press Escape to close.">
          <label className="flex flex-col gap-2">
            Your name
            <input className="rounded-button border border-border-strong px-3 py-2" />
          </label>
        </Dialog>
      </div>

      <Tabs label="Demo tabs" items={TAB_ITEMS} value={tab} onValueChange={setTab}>
        <p>{TAB_ITEMS.find((item) => item.id === tab)?.label} panel</p>
      </Tabs>

      <Scroller
        label="Scroller demo"
        items={Array.from({length: 6}, (_, i) => ({
          key: `card-${i}`,
          node: <div className="flex h-32 items-center justify-center rounded-card border border-border bg-surface">Card {i + 1}</div>,
        }))}
      />
    </div>
  );
}
```

In `app/[locale]/ui-lab/page.tsx`, add imports and two sections before the closing `</>`:
```tsx
import {Accordion} from '@/components/ui/Accordion';
import {UiLabDemos} from '@/components/pages/ui-lab/UiLabDemos';
```
```tsx
      <Section id="interactive" labelledBy="interactive-title">
        <h2 id="interactive-title" className="mb-6 font-heading text-h2 font-bold">Interactive</h2>
        <UiLabDemos />
        <Accordion
          className="mt-12"
          items={[
            {id: 'acc-1', title: 'What is an accordion?', content: <p>It shows and hides content.</p>},
            {id: 'acc-2', title: 'Can several be open?', content: <p>Yes, each item is independent.</p>},
          ]}
        />
      </Section>

      {/* Tall area so floating UI scroll behaviour can be tested (Task 13). */}
      <Section id="scroll-area" labelledBy="scroll-title" tone="surface">
        <h2 id="scroll-title" className="font-heading text-h2 font-bold">Scroll area</h2>
        <div className="h-[150vh]" aria-hidden="true" />
      </Section>
```

In `app/[locale]/layout.tsx`, wrap `main` with the provider:
```tsx
import {OverlayProvider} from '@/components/layout/OverlayProvider';
```
```tsx
        <NextIntlClientProvider>
          <OverlayProvider>
            <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
              {children}
            </main>
          </OverlayProvider>
        </NextIntlClientProvider>
```

- [ ] **Step 4: Run tests**

Run: `npm run test:e2e -- tests/e2e/ui-lab.spec.ts`
Expected: PASS.

- [ ] **Step 5: Typecheck, lint, commit**

Run: `npm run typecheck && npm run lint`

```bash
git add components app tests
git commit -m "$(cat <<'EOF'
feat: add overlay registry, dialog, accordion, tabs, and scroller

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 11: Header — navigation, mobile drawer, language switcher

**Files:**
- Create: `lib/navigation/site-nav.ts`, `components/layout/Logo.tsx`, `components/layout/DesktopNav.tsx`, `components/layout/MobileNav.tsx`, `components/layout/LanguageSwitcher.tsx`, `components/layout/Header.tsx`
- Modify: `app/[locale]/layout.tsx` (render `Header` inside `OverlayProvider`, before `main`)
- Test: `tests/unit/navigation/site-nav.test.ts`, `tests/e2e/header.spec.ts`

**Interfaces:**
- Consumes: `Dialog`, `useRegisterOverlay`, `Button`, `Container`, `Link`/`usePathname`/`useRouter` (next-intl), messages `Nav.*`, `Common.skipToContent|homeLabel`.
- Produces:
  - `PRIMARY_NAV`, `FOOTER_EXPLORE`, `FOOTER_GET_INVOLVED` (definitions with message keys), `resolveNav(defs, t)`, `isNavGroup(item)`, `isCurrent(pathname, href)`, `isWithin(pathname, href)`; types `NavLabelKey`, `NavLink = {key; label; href}`, `NavGroup = {key; label; children: NavLink[]}`, `NavItem`.
  - `Logo({label: string; tone?: 'default' | 'dark'})`, `Header()` (async server component), `LanguageSwitcher({className?})`.

- [ ] **Step 1: Write failing tests**

`tests/unit/navigation/site-nav.test.ts`:
```ts
import {describe, expect, it} from 'vitest';
import {isCurrent, isNavGroup, isWithin, PRIMARY_NAV, resolveNav} from '@/lib/navigation/site-nav';

describe('site navigation', () => {
  it('has the five top-level items from the spec, with two dropdowns', () => {
    const items = resolveNav(PRIMARY_NAV, (key) => key.toUpperCase());
    expect(items.map((item) => item.label)).toEqual(['HOME', 'ABOUT', 'GETINVOLVED', 'EVENTSNEWS', 'CONTACT']);
    const groups = items.filter(isNavGroup);
    expect(groups.map((g) => g.children.map((c) => c.href))).toEqual([
      ['/about', '/about/reports'],
      ['/get-involved/mentorship', '/get-involved/mentors', '/get-involved/donate'],
    ]);
  });

  it('marks only the exact path as current', () => {
    expect(isCurrent('/about', '/about')).toBe(true);
    expect(isCurrent('/about/reports', '/about')).toBe(false);
    expect(isCurrent('/contact', '/contact?topic=mentor')).toBe(true);
  });

  it('treats nested paths as within a section, but home only matches itself', () => {
    expect(isWithin('/events-news/winter-networking-night-2026', '/events-news')).toBe(true);
    expect(isWithin('/about', '/')).toBe(false);
    expect(isWithin('/', '/')).toBe(true);
    expect(isWithin('/aboutx', '/about')).toBe(false);
  });
});
```

`tests/e2e/header.spec.ts`:
```ts
import {expect, test} from '@playwright/test';

test.describe('header — desktop', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'desktop navigation');
  });

  test('skip link moves focus to the main content', async ({page}) => {
    await page.goto('/en/ui-lab');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', {name: 'Skip to content'});
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('main#main')).toBeFocused();
  });

  test('Get Involved dropdown works with mouse and keyboard', async ({page}) => {
    await page.goto('/en/ui-lab');
    const nav = page.getByRole('navigation', {name: 'Main'});
    const trigger = nav.getByRole('button', {name: 'Get Involved'});
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(nav.getByRole('link', {name: 'Mentors'})).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(nav.getByRole('link', {name: 'Mentorship'})).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(nav.getByRole('link', {name: 'Mentors'})).toBeFocused();

    await page.mouse.click(10, 600);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('current page is marked inside its dropdown', async ({page}) => {
    await page.goto('/en/ui-lab');
    const nav = page.getByRole('navigation', {name: 'Main'});
    await nav.getByRole('button', {name: 'Get Involved'}).click();
    await nav.getByRole('link', {name: 'Donate'}).click();
    await expect(page).toHaveURL(/\/en\/get-involved\/donate$/);
    await nav.getByRole('button', {name: 'Get Involved'}).click();
    await expect(nav.getByRole('link', {name: 'Donate'})).toHaveAttribute('aria-current', 'page');
  });

  test('language switcher keeps the path and query', async ({page}) => {
    await page.goto('/en/ui-lab?tab=second');
    await page.getByRole('group', {name: 'Language'}).getByRole('link', {name: /KO/}).click();
    await expect(page).toHaveURL(/\/ko\/ui-lab\?tab=second$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
  });
});

test.describe('header — mobile', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'mobile navigation');
  });

  test('menu drawer opens, traps focus, and closes with Escape', async ({page}) => {
    await page.goto('/en/ui-lab');
    await expect(page.getByRole('navigation', {name: 'Main'})).toBeHidden();
    const open = page.getByRole('button', {name: 'Open menu'});
    await open.click();
    const drawer = page.getByRole('dialog', {name: 'Menu'});
    await expect(drawer).toBeVisible();
    for (let i = 0; i < 15; i++) await page.keyboard.press('Tab');
    expect(await drawer.evaluate((el) => el.contains(document.activeElement))).toBe(true);
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await expect(open).toBeFocused();
  });

  test('tapping a link inside a section navigates and closes the drawer', async ({page}) => {
    await page.goto('/en/ui-lab');
    await page.getByRole('button', {name: 'Open menu'}).click();
    const drawer = page.getByRole('dialog', {name: 'Menu'});
    await drawer.getByText('Get Involved').click();
    await drawer.getByRole('link', {name: 'Mentors'}).click();
    await expect(page).toHaveURL(/\/en\/get-involved\/mentors$/);
    await expect(drawer).toBeHidden();
  });
});
```

Run: `npm run test -- tests/unit/navigation && npm run test:e2e -- tests/e2e/header.spec.ts`
Expected: FAIL.

- [ ] **Step 2: Implement the navigation model**

`lib/navigation/site-nav.ts`:
```ts
export type NavLabelKey =
  | 'home'
  | 'about'
  | 'aboutOverview'
  | 'reports'
  | 'getInvolved'
  | 'mentorship'
  | 'mentors'
  | 'donate'
  | 'eventsNews'
  | 'contact';

type NavLinkDef = {key: NavLabelKey; href: string};
type NavGroupDef = {key: NavLabelKey; children: NavLinkDef[]};
type NavItemDef = NavLinkDef | NavGroupDef;

export type NavLink = {key: string; label: string; href: string};
export type NavGroup = {key: string; label: string; children: NavLink[]};
export type NavItem = NavLink | NavGroup;

const links = {
  home: {key: 'home', href: '/'},
  aboutOverview: {key: 'aboutOverview', href: '/about'},
  reports: {key: 'reports', href: '/about/reports'},
  mentorship: {key: 'mentorship', href: '/get-involved/mentorship'},
  mentors: {key: 'mentors', href: '/get-involved/mentors'},
  donate: {key: 'donate', href: '/get-involved/donate'},
  eventsNews: {key: 'eventsNews', href: '/events-news'},
  contact: {key: 'contact', href: '/contact'},
} satisfies Record<string, NavLinkDef>;

export const PRIMARY_NAV: NavItemDef[] = [
  links.home,
  {key: 'about', children: [links.aboutOverview, links.reports]},
  {key: 'getInvolved', children: [links.mentorship, links.mentors, links.donate]},
  links.eventsNews,
  links.contact,
];

export const FOOTER_EXPLORE: NavLinkDef[] = [links.home, links.aboutOverview, links.reports, links.eventsNews, links.contact];
export const FOOTER_GET_INVOLVED: NavLinkDef[] = [links.mentorship, links.mentors, links.donate];

export function resolveNav(defs: NavLinkDef[], t: (key: NavLabelKey) => string): NavLink[];
export function resolveNav(defs: NavItemDef[], t: (key: NavLabelKey) => string): NavItem[];
export function resolveNav(defs: NavItemDef[], t: (key: NavLabelKey) => string): NavItem[] {
  return defs.map((def) =>
    'children' in def
      ? {key: def.key, label: t(def.key), children: def.children.map((child) => ({key: child.key, label: t(child.key), href: child.href}))}
      : {key: def.key, label: t(def.key), href: def.href},
  );
}

export function isNavGroup(item: NavItem): item is NavGroup {
  return 'children' in item;
}

const pathOf = (href: string) => href.split(/[?#]/)[0];

/** Exact match → aria-current="page". `pathname` is locale-less (from next-intl usePathname). */
export function isCurrent(pathname: string, href: string): boolean {
  return pathOf(href) === pathname;
}

/** Section match for visual highlighting (e.g. an article under /events-news). */
export function isWithin(pathname: string, href: string): boolean {
  const path = pathOf(href);
  if (path === '/') return pathname === '/';
  return pathname === path || pathname.startsWith(`${path}/`);
}
```

- [ ] **Step 3: Implement header components**

`components/layout/Logo.tsx`:
```tsx
import {Link} from '@/lib/i18n/navigation';
import {cn} from '@/lib/utils/cn';

/** Text wordmark placeholder until the official logo file is provided. */
export function Logo({label, tone = 'default'}: {label: string; tone?: 'default' | 'dark'}) {
  return (
    <Link
      href="/"
      aria-label={label}
      className={cn(
        'inline-flex min-h-11 items-center font-heading text-2xl font-extrabold tracking-tight',
        tone === 'dark' ? 'text-on-primary' : 'text-primary',
      )}
    >
      ELCA<span className="text-accent">.</span>
    </Link>
  );
}
```

`components/layout/LanguageSwitcher.tsx`:
```tsx
'use client';

import {useLocale, useTranslations} from 'next-intl';
import {Fragment, type MouseEvent} from 'react';
import {Link, usePathname, useRouter} from '@/lib/i18n/navigation';
import {routing, type Locale} from '@/lib/i18n/routing';
import {cn} from '@/lib/utils/cn';

const SHORT_LABEL: Record<Locale, string> = {en: 'EN', ko: 'KO'};

export function LanguageSwitcher({className}: {className?: string}) {
  const t = useTranslations('Nav');
  const current = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function keepQuery(event: MouseEvent<HTMLAnchorElement>, locale: Locale) {
    const search = window.location.search;
    if (!search) return; // the Link already points at the right path
    event.preventDefault();
    router.replace({pathname, query: Object.fromEntries(new URLSearchParams(search))}, {locale});
  }

  return (
    <div role="group" aria-label={t('languageLabel')} className={cn('flex items-center gap-1 text-sm font-semibold', className)}>
      {routing.locales.map((locale, index) => (
        <Fragment key={locale}>
          {index > 0 ? (
            <span aria-hidden="true" className="text-border-strong">
              |
            </span>
          ) : null}
          <Link
            href={pathname}
            locale={locale}
            lang={locale}
            hrefLang={locale}
            aria-current={locale === current ? 'true' : undefined}
            onClick={(event) => keepQuery(event, locale)}
            className="inline-flex min-h-11 items-center rounded-button px-2 text-muted transition-colors duration-150 hover:text-text aria-[current=true]:text-text aria-[current=true]:underline aria-[current=true]:decoration-2 aria-[current=true]:underline-offset-4"
          >
            {SHORT_LABEL[locale]}
            <span className="sr-only"> — {t(locale === 'en' ? 'langEn' : 'langKo')}</span>
          </Link>
        </Fragment>
      ))}
    </div>
  );
}
```

`components/layout/DesktopNav.tsx`:
```tsx
'use client';

import {ChevronDown} from 'lucide-react';
import {useEffect, useRef, useState, type KeyboardEvent} from 'react';
import {useRegisterOverlay} from '@/components/layout/OverlayProvider';
import {Link, usePathname} from '@/lib/i18n/navigation';
import {isCurrent, isNavGroup, isWithin, type NavItem} from '@/lib/navigation/site-nav';
import {cn} from '@/lib/utils/cn';

const topLinkClass =
  'inline-flex min-h-11 items-center gap-1 rounded-button px-3 text-sm font-semibold text-text transition-colors duration-150 hover:text-secondary';
const activeClass = 'underline decoration-secondary decoration-2 underline-offset-8';

function panelLinks(key: string): HTMLAnchorElement[] {
  return Array.from(document.querySelectorAll<HTMLAnchorElement>(`#nav-panel-${key} a`));
}

export function DesktopNav({items, label}: {items: NavItem[]; label: string}) {
  const pathname = usePathname();
  const [openKey, setOpenKey] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useRegisterOverlay(openKey !== null);

  useEffect(() => {
    if (!openKey) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpenKey(null);
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpenKey(null);
      document.getElementById(`nav-trigger-${openKey}`)?.focus();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [openKey]);

  function openAndFocus(key: string, index: number) {
    setOpenKey(key);
    requestAnimationFrame(() => panelLinks(key).at(index)?.focus());
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>, key: string) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      openAndFocus(key, 0);
    }
  }

  function onPanelKeyDown(event: KeyboardEvent<HTMLUListElement>, key: string) {
    const links = panelLinks(key);
    const index = links.indexOf(document.activeElement as HTMLAnchorElement);
    const targets: Record<string, number> = {ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: links.length - 1};
    if (event.key in targets) {
      event.preventDefault();
      links[(targets[event.key] + links.length) % links.length]?.focus();
    }
  }

  return (
    <nav ref={navRef} aria-label={label} className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {items.map((item) => {
          if (!isNavGroup(item)) {
            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-current={isCurrent(pathname, item.href) ? 'page' : undefined}
                  className={cn(topLinkClass, isWithin(pathname, item.href) && activeClass)}
                >
                  {item.label}
                </Link>
              </li>
            );
          }
          const open = openKey === item.key;
          const active = item.children.some((child) => isWithin(pathname, child.href));
          return (
            <li
              key={item.key}
              className="relative"
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setOpenKey((current) => (current === item.key ? null : current));
                }
              }}
            >
              <button
                id={`nav-trigger-${item.key}`}
                type="button"
                aria-expanded={open}
                aria-controls={`nav-panel-${item.key}`}
                onClick={() => setOpenKey(open ? null : item.key)}
                onKeyDown={(event) => onTriggerKeyDown(event, item.key)}
                className={cn(topLinkClass, active && activeClass)}
              >
                {item.label}
                <ChevronDown aria-hidden="true" className={cn('size-4 transition-transform duration-150', open && 'rotate-180')} />
              </button>
              <ul
                id={`nav-panel-${item.key}`}
                hidden={!open}
                onKeyDown={(event) => onPanelKeyDown(event, item.key)}
                className="absolute start-0 top-full z-40 mt-2 min-w-56 rounded-card border border-border bg-surface p-2 shadow-float"
              >
                {item.children.map((child) => (
                  <li key={child.key}>
                    <Link
                      href={child.href}
                      aria-current={isCurrent(pathname, child.href) ? 'page' : undefined}
                      onClick={() => setOpenKey(null)}
                      className="flex min-h-11 items-center rounded-button px-3 text-sm font-medium text-text transition-colors duration-150 hover:bg-background aria-[current=page]:text-secondary"
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
```

`components/layout/MobileNav.tsx`:
```tsx
'use client';

import {ChevronDown, Menu} from 'lucide-react';
import {useState} from 'react';
import {Button} from '@/components/ui/Button';
import {Dialog} from '@/components/ui/Dialog';
import {Link, usePathname} from '@/lib/i18n/navigation';
import {isCurrent, isNavGroup, isWithin, type NavItem} from '@/lib/navigation/site-nav';
import {LanguageSwitcher} from './LanguageSwitcher';

type MobileNavProps = {items: NavItem[]; title: string; openLabel: string; donateLabel: string};

const linkClass =
  'flex min-h-12 items-center rounded-button px-3 font-semibold text-text transition-colors duration-150 hover:bg-background aria-[current=page]:text-secondary';

export function MobileNav({items, title, openLabel, donateLabel}: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={openLabel}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen(true)}
        className="inline-flex size-11 items-center justify-center rounded-button text-primary transition-colors duration-150 hover:bg-background"
      >
        <Menu aria-hidden="true" className="size-6" />
      </button>
      <Dialog open={open} onClose={close} title={title} variant="drawer">
        <nav id="mobile-nav" aria-label={title}>
          <ul className="flex flex-col gap-1">
            {items.map((item) =>
              isNavGroup(item) ? (
                <li key={item.key}>
                  <details className="group" open={item.children.some((child) => isWithin(pathname, child.href))}>
                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between rounded-button px-3 font-semibold text-text hover:bg-background [&::-webkit-details-marker]:hidden">
                      {item.label}
                      <ChevronDown aria-hidden="true" className="size-5 transition-transform duration-200 group-open:rotate-180" />
                    </summary>
                    <ul className="ms-3 flex flex-col gap-1 border-s border-border ps-3">
                      {item.children.map((child) => (
                        <li key={child.key}>
                          <Link
                            href={child.href}
                            onClick={close}
                            aria-current={isCurrent(pathname, child.href) ? 'page' : undefined}
                            className={linkClass}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ) : (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={isCurrent(pathname, item.href) ? 'page' : undefined}
                    className={linkClass}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>
        <div className="mt-6 flex flex-col gap-4 border-t border-border pt-6">
          <LanguageSwitcher />
          <Button href="/get-involved/donate" variant="accent" onClick={close}>
            {donateLabel}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
```

`components/layout/Header.tsx`:
```tsx
import {getTranslations} from 'next-intl/server';
import {Button} from '@/components/ui/Button';
import {PRIMARY_NAV, resolveNav} from '@/lib/navigation/site-nav';
import {Container} from './Container';
import {DesktopNav} from './DesktopNav';
import {LanguageSwitcher} from './LanguageSwitcher';
import {Logo} from './Logo';
import {MobileNav} from './MobileNav';

export async function Header() {
  const [tCommon, tNav] = await Promise.all([getTranslations('Common'), getTranslations('Nav')]);
  const items = resolveNav(PRIMARY_NAV, (key) => tNav(key));

  return (
    <header className="relative z-40 border-b border-border bg-surface">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-50 focus:rounded-button focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary"
      >
        {tCommon('skipToContent')}
      </a>
      <Container className="flex h-18 items-center justify-between gap-6">
        <Logo label={tCommon('homeLabel')} />
        <DesktopNav items={items} label={tNav('primaryLabel')} />
        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <Button href="/get-involved/donate" variant="accent">
            {tNav('donate')}
          </Button>
        </div>
        <MobileNav items={items} title={tNav('mobileTitle')} openLabel={tNav('openMenu')} donateLabel={tNav('donate')} />
      </Container>
    </header>
  );
}
```

In `app/[locale]/layout.tsx`:
```tsx
import {Header} from '@/components/layout/Header';
```
```tsx
          <OverlayProvider>
            <Header />
            <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
              {children}
            </main>
          </OverlayProvider>
```

- [ ] **Step 4: Run tests**

Run: `npm run test && npm run test:e2e -- tests/e2e/header.spec.ts tests/e2e/ui-lab.spec.ts tests/e2e/i18n.spec.ts`
Expected: PASS. (Nav targets other than `/ui-lab` show the 404 page until M4–M6; the tests only assert URLs.)

- [ ] **Step 5: Typecheck, lint, commit**

Run: `npm run typecheck && npm run lint`

```bash
git add lib/navigation components/layout app tests
git commit -m "$(cat <<'EOF'
feat: add header with dropdown navigation, mobile drawer, and language switcher

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 12: Demo-form infrastructure and Footer

**Files:**
- Create: `lib/validation/forms.ts`, `lib/validation/query.ts`, `lib/forms/useDemoForm.ts`, `lib/hooks/useQueryParam.ts`
- Create: `components/ui/Input.tsx`, `components/ui/FormField.tsx`, `components/ui/FormFeedback.tsx`
- Create: `components/layout/NewsletterForm.tsx`, `components/layout/Footer.tsx`
- Modify: `app/[locale]/layout.tsx` (fetch site settings, render `Footer`)
- Test: `tests/unit/validation/forms.test.ts`, `tests/unit/validation/query.test.ts`, `tests/e2e/footer.spec.ts`

**Interfaces:**
- Consumes: `getSiteSettings` (Task 8), `Button`, `Badge`, `FlagBadges`, `SocialMark`, `Logo`, nav model (Task 11), messages `Forms.*`, `Errors.*`, `Newsletter.*`, `Footer.*`.
- Produces:
  - `FORM_ERROR_KEYS`, `FormErrorKey`, `toFieldErrors(error: z.ZodError): Record<string, FormErrorKey>`.
  - Constants `CONTACT_TOPICS`, `ContactTopic`, `MENTEE_INTERESTS`, `EVENT_TYPES`, `EVENT_FORMATS`, `DONATION_FREQUENCIES`, `DonationFrequency`.
  - Schemas `newsletterSchema`, `contactSchema`, `menteeApplySchema`, `eventRegisterSchema`, `hostEventSchema`, `requestEventSchema`, `donationSchema`.
  - `parseEnum<T extends string>(value: string | null | undefined, allowed: readonly T[]): T | null`.
  - `useDemoForm<V extends Record<string, string | string[]>>(schema: z.ZodType, initialValues: V)` → `{values, errors: Partial<Record<keyof V & string, FormErrorKey>>, status: DemoFormStatus, setValue(name, value), handleBlur(name), handleSubmit(event), formRef}`; `DemoFormStatus = 'idle' | 'invalid' | 'demo'`.
  - `useQueryParam<T extends string>(key: string, allowed: readonly T[]): [T | null, (value: T | null) => void]` — reads after hydration (server snapshot is `null`, keeping pages static), writes with `history.replaceState`.
  - `Input`, `Textarea`, `Select` (styled native controls); `FormField({id; label; required?; hint?; error?; tone?: 'default' | 'dark'; className?; children: (field) => ReactNode})`; `ChoiceGroup({legend; required?; error?; hint?; children; className?})` (fieldset); `FormFeedback({status; demoMessage; tone?})`.
  - `Footer({settings: SiteSettings})` (async server component), `NewsletterForm()`.

- [ ] **Step 1: Write failing unit tests**

`tests/unit/validation/forms.test.ts`:
```ts
import {describe, expect, it} from 'vitest';
import {
  contactSchema,
  donationSchema,
  hostEventSchema,
  menteeApplySchema,
  newsletterSchema,
  requestEventSchema,
  toFieldErrors,
} from '@/lib/validation/forms';

function errorsOf(result: {success: boolean; error?: Parameters<typeof toFieldErrors>[0]}) {
  return result.success ? {} : toFieldErrors(result.error!);
}

describe('contactSchema', () => {
  it('rejects whitespace-only input as required', () => {
    expect(errorsOf(contactSchema.safeParse({name: '   ', email: ' ', topic: '', message: '\n\t'}))).toEqual({
      name: 'required',
      email: 'required',
      topic: 'required',
      message: 'required',
    });
  });

  it('rejects malformed emails and over-long messages', () => {
    expect(errorsOf(contactSchema.safeParse({name: 'A', email: 'nope', topic: 'general', message: 'x'.repeat(2001)}))).toEqual({
      email: 'email',
      message: 'tooLong',
    });
  });

  it('trims accepted values', () => {
    const result = contactSchema.safeParse({name: '  Jiwon ', email: ' a@b.co ', topic: 'mentor', message: ' Hi '});
    expect(result.success && result.data).toEqual({name: 'Jiwon', email: 'a@b.co', topic: 'mentor', message: 'Hi'});
  });
});

describe('donationSchema', () => {
  const base = {frequency: 'one-time', name: '', email: ''};
  it.each([
    ['', 'required'],
    ['abc', 'number'],
    ['3.5', 'integer'],
    ['3', 'min'],
    ['20000', 'max'],
  ])('maps amount %j to %s', (amount, key) => {
    expect(errorsOf(donationSchema.safeParse({...base, amount}))).toEqual({amount: key});
  });

  it('accepts a trimmed whole amount and optional email', () => {
    const result = donationSchema.safeParse({...base, frequency: 'monthly', amount: ' 50 '});
    expect(result.success && result.data.amount).toBe(50);
    expect(errorsOf(donationSchema.safeParse({...base, amount: '50', email: 'bad'}))).toEqual({email: 'email'});
  });
});

describe('other schemas', () => {
  it('requires at least one valid interest', () => {
    const base = {name: 'A', email: 'a@b.co', school: 'Grade 11', motivation: ''};
    expect(errorsOf(menteeApplySchema.safeParse({...base, interests: []}))).toEqual({interests: 'required'});
    expect(errorsOf(menteeApplySchema.safeParse({...base, interests: ['cooking']}))).toEqual({interests: 'required'});
    expect(menteeApplySchema.safeParse({...base, interests: ['technology']}).success).toBe(true);
  });

  it('validates the newsletter, host, and request forms', () => {
    expect(errorsOf(newsletterSchema.safeParse({email: ''}))).toEqual({email: 'required'});
    expect(
      errorsOf(
        hostEventSchema.safeParse({
          name: 'A',
          email: 'a@b.co',
          cohort: '',
          eventType: 'panel',
          title: 'T',
          preferredDate: 'March',
          format: 'online',
          description: 'D',
        }),
      ),
    ).toEqual({eventType: 'required'});
    expect(requestEventSchema.safeParse({name: 'A', email: 'a@b.co', topic: 'Law', details: 'More law talks'}).success).toBe(true);
  });
});
```

`tests/unit/validation/query.test.ts`:
```ts
import {describe, expect, it} from 'vitest';
import {parseEnum} from '@/lib/validation/query';

const CATEGORIES = ['workshops', 'events', 'stories', 'news'] as const;

describe('parseEnum', () => {
  it('accepts allowed values', () => {
    expect(parseEnum('news', CATEGORIES)).toBe('news');
  });

  it('ignores missing, unknown, differently-cased, or malicious values', () => {
    expect(parseEnum(null, CATEGORIES)).toBeNull();
    expect(parseEnum('', CATEGORIES)).toBeNull();
    expect(parseEnum('NEWS', CATEGORIES)).toBeNull();
    expect(parseEnum('<script>alert(1)</script>', CATEGORIES)).toBeNull();
  });
});
```

Run: `npm run test -- tests/unit/validation`
Expected: FAIL — modules not found.

- [ ] **Step 2: Implement validation and hooks**

`lib/validation/forms.ts`:
```ts
import {z} from 'zod';

/** Every issue message is one of these keys; the UI translates them via messages `Errors.<key>`. */
export const FORM_ERROR_KEYS = ['required', 'email', 'tooLong', 'min', 'max', 'integer', 'number'] as const;
export type FormErrorKey = (typeof FORM_ERROR_KEYS)[number];

export const CONTACT_TOPICS = ['general', 'mentorship', 'mentor', 'donation', 'event', 'partnership'] as const;
export type ContactTopic = (typeof CONTACT_TOPICS)[number];
export const MENTEE_INTERESTS = ['business', 'technology', 'healthcare', 'law', 'finance', 'engineering', 'arts', 'other'] as const;
export const EVENT_TYPES = ['workshop', 'seminar', 'networking', 'other'] as const;
export const EVENT_FORMATS = ['online', 'in-person', 'hybrid'] as const;
export const DONATION_FREQUENCIES = ['one-time', 'monthly'] as const;
export type DonationFrequency = (typeof DONATION_FREQUENCIES)[number];

const requiredText = (max: number) =>
  z.string().trim().min(1, {error: 'required'}).max(max, {error: 'tooLong'});
const optionalText = (max: number) => z.string().trim().max(max, {error: 'tooLong'});
const email = z.string().trim().min(1, {error: 'required'}).pipe(z.email({error: 'email'}));
const optionalEmail = z
  .string()
  .trim()
  .refine((value) => value === '' || z.email().safeParse(value).success, {error: 'email'});
const choice = <T extends readonly [string, ...string[]]>(values: T) => z.enum(values, {error: 'required'});

export const newsletterSchema = z.object({email});

export const contactSchema = z.object({
  name: requiredText(100),
  email,
  topic: choice(CONTACT_TOPICS),
  message: requiredText(2000),
});

export const menteeApplySchema = z.object({
  name: requiredText(100),
  email,
  school: requiredText(150),
  interests: z.array(z.enum(MENTEE_INTERESTS)).min(1, {error: 'required'}),
  motivation: optionalText(500),
});

export const eventRegisterSchema = z.object({
  name: requiredText(100),
  email,
  cohort: optionalText(20),
  question: optionalText(500),
});

export const hostEventSchema = z.object({
  name: requiredText(100),
  email,
  cohort: optionalText(20),
  eventType: choice(EVENT_TYPES),
  title: requiredText(150),
  preferredDate: requiredText(100),
  format: choice(EVENT_FORMATS),
  description: requiredText(1000),
});

export const requestEventSchema = z.object({
  name: requiredText(100),
  email,
  topic: requiredText(150),
  details: requiredText(1000),
});

export const donationSchema = z.object({
  frequency: choice(DONATION_FREQUENCIES),
  amount: z
    .string()
    .trim()
    .min(1, {error: 'required'})
    .pipe(z.coerce.number({error: 'number'}).int({error: 'integer'}).min(5, {error: 'min'}).max(10000, {error: 'max'})),
  name: optionalText(100),
  email: optionalEmail,
});

/** First error per top-level field. Unknown messages (e.g. an invalid array element) map to 'required'. */
export function toFieldErrors(error: z.ZodError): Record<string, FormErrorKey> {
  const result: Record<string, FormErrorKey> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? '');
    if (!field || field in result) continue;
    result[field] = (FORM_ERROR_KEYS as readonly string[]).includes(issue.message)
      ? (issue.message as FormErrorKey)
      : 'required';
  }
  return result;
}
```

`lib/validation/query.ts`:
```ts
/** Returns `value` only if it is exactly one of `allowed`; anything else (including hand-edited URLs) is ignored. */
export function parseEnum<T extends string>(value: string | null | undefined, allowed: readonly T[]): T | null {
  if (!value) return null;
  return (allowed as readonly string[]).includes(value) ? (value as T) : null;
}
```

`lib/forms/useDemoForm.ts`:
```ts
'use client';

import {useRef, useState, type FormEvent} from 'react';
import type {z} from 'zod';
import {toFieldErrors, type FormErrorKey} from '@/lib/validation/forms';

export type DemoFormStatus = 'idle' | 'invalid' | 'demo';
type FieldValues = Record<string, string | string[]>;

/**
 * Client-side validation for demo forms. Nothing is ever sent.
 * Phase 3: replace the success branch in `handleSubmit` with a Server Action call.
 */
export function useDemoForm<V extends FieldValues>(schema: z.ZodType, initialValues: V) {
  type Field = keyof V & string;
  const [values, setValues] = useState<V>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<Field, FormErrorKey>>>({});
  const [status, setStatus] = useState<DemoFormStatus>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  function revalidate(field: Field, next: V) {
    const result = schema.safeParse(next);
    const fieldErrors = result.success ? {} : toFieldErrors(result.error);
    setErrors((previous) => {
      const updated = {...previous};
      const error = fieldErrors[field];
      if (error) updated[field] = error;
      else delete updated[field];
      return updated;
    });
  }

  function setValue<K extends Field>(field: K, value: V[K]) {
    const next = {...values, [field]: value};
    setValues(next);
    if (status === 'demo') setStatus('idle');
    if (errors[field]) revalidate(field, next);
  }

  function handleBlur(field: Field) {
    if (errors[field]) revalidate(field, values);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // A second submit right after the demo notice (e.g. a double click) keeps the notice instead of
    // flashing "required" errors on the freshly reset form. Any edit sets the status back to 'idle'.
    if (status === 'demo') return;
    const result = schema.safeParse(values);
    if (!result.success) {
      const fieldErrors = toFieldErrors(result.error) as Partial<Record<Field, FormErrorKey>>;
      setErrors(fieldErrors);
      setStatus('invalid');
      const firstInvalid = (Object.keys(values) as Field[]).find((field) => fieldErrors[field]);
      if (firstInvalid) formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    setErrors({});
    setValues(initialValues);
    setStatus('demo');
  }

  return {values, errors, status, setValue, handleBlur, handleSubmit, formRef};
}
```

`lib/hooks/useQueryParam.ts`:
```ts
'use client';

import {useCallback, useSyncExternalStore} from 'react';
import {parseEnum} from '@/lib/validation/query';

const CHANGE_EVENT = 'elca:querychange';

function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener('popstate', callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

/**
 * Reads a whitelisted query parameter after hydration. The server snapshot is always `null`,
 * so pages stay statically rendered; invalid values are ignored.
 */
export function useQueryParam<T extends string>(key: string, allowed: readonly T[]): [T | null, (value: T | null) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => parseEnum(new URLSearchParams(window.location.search).get(key), allowed),
    () => null,
  );

  const setValue = useCallback(
    (next: T | null) => {
      const url = new URL(window.location.href);
      if (next === null) url.searchParams.delete(key);
      else url.searchParams.set(key, next);
      window.history.replaceState(null, '', url);
      window.dispatchEvent(new Event(CHANGE_EVENT));
    },
    [key],
  );

  return [value, setValue];
}
```

Run: `npm run test -- tests/unit/validation`
Expected: PASS.

- [ ] **Step 3: Form UI components**

`components/ui/Input.tsx`:
```tsx
import type {ComponentProps} from 'react';
import {cn} from '@/lib/utils/cn';

const fieldClass =
  'w-full rounded-button border border-border-strong bg-surface px-3 text-base text-text placeholder:text-muted transition-colors duration-150 hover:border-text aria-[invalid=true]:border-danger';

export function Input({className, ...props}: ComponentProps<'input'>) {
  return <input {...props} className={cn(fieldClass, 'min-h-11 py-2', className)} />;
}

export function Textarea({className, rows = 5, ...props}: ComponentProps<'textarea'>) {
  return <textarea rows={rows} {...props} className={cn(fieldClass, 'py-2.5', className)} />;
}

export function Select({className, ...props}: ComponentProps<'select'>) {
  return <select {...props} className={cn(fieldClass, 'min-h-11 py-2', className)} />;
}
```

`components/ui/FormField.tsx`:
```tsx
import {useTranslations} from 'next-intl';
import type {ReactNode} from 'react';
import {cn} from '@/lib/utils/cn';

export type FieldA11yProps = {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  required?: boolean;
};

type Tone = 'default' | 'dark';

const labelTone: Record<Tone, string> = {default: 'text-text', dark: 'text-on-primary'};
const hintTone: Record<Tone, string> = {default: 'text-muted', dark: 'text-on-primary-muted'};
const errorTone: Record<Tone, string> = {default: 'text-danger', dark: 'text-danger-on-dark'};

function RequiredMark({required, tone}: {required?: boolean; tone: Tone}) {
  const t = useTranslations('Forms');
  return required ? (
    <>
      <span aria-hidden="true" className={errorTone[tone]}>
        {' *'}
      </span>
      <span className="sr-only"> ({t('required')})</span>
    </>
  ) : (
    <span className={cn('font-normal', hintTone[tone])}> ({t('optional')})</span>
  );
}

type FormFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  tone?: Tone;
  className?: string;
  children: (field: FieldA11yProps) => ReactNode;
};

/** Label + control + hint + error, wired together with ids and aria attributes. */
export function FormField({id, label, required, hint, error, tone = 'default', className, children}: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className={cn('text-sm font-semibold', labelTone[tone])}>
        {label}
        <RequiredMark required={required} tone={tone} />
      </label>
      {hint ? (
        <p id={hintId} className={cn('text-sm', hintTone[tone])}>
          {hint}
        </p>
      ) : null}
      {children({id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined, required})}
      {error ? (
        <p id={errorId} className={cn('text-sm font-medium', errorTone[tone])}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Fieldset for radio/checkbox groups. */
export function ChoiceGroup({
  legend,
  required,
  hint,
  error,
  className,
  children,
}: {
  legend: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className={cn('flex flex-col gap-2', className)}>
      <legend className="mb-1 text-sm font-semibold text-text">
        {legend}
        <RequiredMark required={required} tone="default" />
      </legend>
      {hint ? <p className="text-sm text-muted">{hint}</p> : null}
      {children}
      {error ? <p className="text-sm font-medium text-danger">{error}</p> : null}
    </fieldset>
  );
}
```

`components/ui/FormFeedback.tsx`:
```tsx
import {CircleAlert} from 'lucide-react';
import {useTranslations} from 'next-intl';
import type {DemoFormStatus} from '@/lib/forms/useDemoForm';
import {cn} from '@/lib/utils/cn';
import {Badge} from './Badge';

/** Persistent live region; demo success never looks like a real success (no green check). */
export function FormFeedback({status, demoMessage, tone = 'default'}: {status: DemoFormStatus; demoMessage: string; tone?: 'default' | 'dark'}) {
  const t = useTranslations('Forms');
  const tCommon = useTranslations('Common');
  return (
    <div aria-live="polite" aria-atomic="true">
      {status === 'invalid' ? (
        <p className={cn('flex items-center gap-2 text-sm font-medium', tone === 'dark' ? 'text-danger-on-dark' : 'text-danger')}>
          <CircleAlert aria-hidden="true" className="size-4 shrink-0" />
          {t('errorSummary')}
        </p>
      ) : null}
      {status === 'demo' ? (
        <p
          className={cn(
            'flex flex-wrap items-center gap-2 rounded-card border px-3 py-2 text-sm',
            tone === 'dark' ? 'border-on-primary/30 text-on-primary' : 'border-border-strong bg-background text-text',
          )}
        >
          <Badge variant="demo">{tCommon('demo')}</Badge>
          {demoMessage}
        </p>
      ) : null}
    </div>
  );
}
```

`FormFeedback` imports only a *type* from `useDemoForm`, so it stays usable from server components.

- [ ] **Step 4: Newsletter form and Footer**

`components/layout/NewsletterForm.tsx`:
```tsx
'use client';

import {useTranslations} from 'next-intl';
import {useId} from 'react';
import {Button} from '@/components/ui/Button';
import {FormFeedback} from '@/components/ui/FormFeedback';
import {FormField} from '@/components/ui/FormField';
import {Input} from '@/components/ui/Input';
import {useDemoForm} from '@/lib/forms/useDemoForm';
import {newsletterSchema} from '@/lib/validation/forms';

export function NewsletterForm() {
  const t = useTranslations('Newsletter');
  const tErrors = useTranslations('Errors');
  const id = useId();
  const form = useDemoForm(newsletterSchema, {email: ''});

  return (
    <form ref={form.formRef} onSubmit={form.handleSubmit} noValidate className="flex flex-col gap-3">
      <FormField
        id={`${id}-email`}
        label={t('label')}
        required
        tone="dark"
        error={form.errors.email ? tErrors(form.errors.email) : undefined}
      >
        {(field) => (
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              {...field}
              name="email"
              type="email"
              autoComplete="email"
              placeholder={t('placeholder')}
              value={form.values.email}
              onChange={(event) => form.setValue('email', event.target.value)}
              onBlur={() => form.handleBlur('email')}
              className="sm:flex-1"
            />
            <Button type="submit" variant="inverse">
              {t('submit')}
            </Button>
          </div>
        )}
      </FormField>
      <FormFeedback status={form.status} tone="dark" demoMessage={t('demoNotice')} />
    </form>
  );
}
```

`components/layout/Footer.tsx`:
```tsx
import {getTranslations} from 'next-intl/server';
import {Button} from '@/components/ui/Button';
import {FlagBadges} from '@/components/ui/FlagBadges';
import {SocialMark} from '@/components/ui/SocialMark';
import {Link} from '@/lib/i18n/navigation';
import {FOOTER_EXPLORE, FOOTER_GET_INVOLVED, resolveNav, type NavLink} from '@/lib/navigation/site-nav';
import {cn} from '@/lib/utils/cn';
import type {SiteSettings} from '@/types/pages';
import {Container} from './Container';
import {Logo} from './Logo';
import {NewsletterForm} from './NewsletterForm';

const columnTitleClass = 'text-sm font-semibold uppercase tracking-wide text-on-primary-muted';

function FooterLinks({title, links, className}: {title: string; links: NavLink[]; className?: string}) {
  return (
    <nav aria-label={title} className={cn('flex flex-col gap-3', className)}>
      <h2 className={columnTitleClass}>{title}</h2>
      <ul className="flex flex-col">
        {links.map((link) => (
          <li key={link.key}>
            <Link href={link.href} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export async function Footer({settings}: {settings: SiteSettings}) {
  const [t, tNav, tCommon] = await Promise.all([
    getTranslations('Footer'),
    getTranslations('Nav'),
    getTranslations('Common'),
  ]);
  const socialLinks = [
    {network: 'facebook' as const, href: settings.social.facebook, label: t('facebook')},
    {network: 'linkedin' as const, href: settings.social.linkedin, label: t('linkedin')},
  ].filter((link): link is {network: 'facebook' | 'linkedin'; href: string; label: string} => Boolean(link.href));

  return (
    <footer className="on-dark bg-primary-deep text-on-primary">
      <section aria-labelledby="prefooter-title" className="border-b border-on-primary/15 bg-primary">
        <Container className="flex flex-col gap-6 py-14 lg:flex-row lg:items-center lg:justify-between lg:py-16">
          <div className="flex max-w-heading flex-col gap-3">
            <h2 id="prefooter-title" className="font-heading text-h2 font-bold text-balance">
              {settings.preFooterCta.title}
            </h2>
            <p className="text-lg text-on-primary-muted">{settings.preFooterCta.body}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {settings.preFooterCta.ctas.map((cta, index) => (
              <Button key={cta.href} href={cta.href} size="lg" variant={index === 0 ? 'inverse' : 'accent'}>
                {cta.label}
              </Button>
            ))}
          </div>
        </Container>
      </section>

      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-4">
          <Logo label={tCommon('homeLabel')} tone="dark" />
          <p className="text-sm font-semibold">{settings.orgFullName}</p>
          <p className="max-w-sm text-on-primary-muted">{settings.description}</p>
          <ul aria-label={t('social')} className="flex gap-2">
            {socialLinks.map((link) => (
              <li key={link.network}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${link.label} ${tCommon('opensInNewTab')}`}
                  className="inline-flex size-11 items-center justify-center rounded-full transition-colors duration-150 hover:bg-on-primary/10"
                >
                  <SocialMark network={link.network} />
                </a>
              </li>
            ))}
          </ul>
          <FlagBadges flags={settings.social} />
        </div>

        <FooterLinks title={t('explore')} links={resolveNav(FOOTER_EXPLORE, (key) => tNav(key))} className="lg:col-span-2" />
        <FooterLinks title={t('getInvolved')} links={resolveNav(FOOTER_GET_INVOLVED, (key) => tNav(key))} className="lg:col-span-2" />

        <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-4">
          <h2 className={columnTitleClass}>{t('stayConnected')}</h2>
          <p>
            <span className="sr-only">{t('email')}: </span>
            <a href={`mailto:${settings.contact.email}`} className="font-semibold underline-offset-4 hover:underline">
              {settings.contact.email}
            </a>
          </p>
          <FlagBadges flags={settings.contact} />
          <div className="flex flex-col gap-1">
            <p className="font-semibold">{settings.newsletter.title}</p>
            <p className="text-sm text-on-primary-muted">{settings.newsletter.body}</p>
          </div>
          <NewsletterForm />
        </div>
      </Container>

      <div className="border-t border-on-primary/15">
        <Container className="flex flex-col gap-3 py-6 text-sm text-on-primary-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{t('copyright', {year: settings.currentYear})}</p>
          <p>
            <Link href="/contact" className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
              {t('privacy')} {t('privacyNote')}
            </Link>
          </p>
        </Container>
      </div>
    </footer>
  );
}
```

`app/[locale]/layout.tsx` — final body (add imports `Footer` and `getSiteSettings`; fetch settings after the locale check):
```tsx
import {Footer} from '@/components/layout/Footer';
import {getSiteSettings} from '@/lib/content/site';
```
```tsx
export default async function LocaleLayout({children, params}: LayoutProps<'/[locale]'>) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const settings = await getSiteSettings(locale);

  return (
    <html lang={locale} className={fontVariables}>
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider>
          <OverlayProvider>
            <Header />
            <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
              {children}
            </main>
            <Footer settings={settings} />
          </OverlayProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Footer E2E test**

`tests/e2e/footer.spec.ts`:
```ts
import {expect, test} from '@playwright/test';

test('footer shows navigation, contact, social links, and copyright', async ({page}) => {
  await page.goto('/en/ui-lab');
  const footer = page.locator('footer');
  await expect(footer.getByRole('navigation', {name: 'Explore'})).toBeVisible();
  await expect(footer.getByRole('navigation', {name: 'Get Involved'}).getByRole('link', {name: 'Mentors'})).toHaveAttribute(
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
```

Run: `npm run test && npm run test:e2e -- tests/e2e/footer.spec.ts tests/e2e/header.spec.ts`
Expected: PASS.

- [ ] **Step 6: Typecheck, lint, commit**

Run: `npm run typecheck && npm run lint`

```bash
git add lib components app tests
git commit -m "$(cat <<'EOF'
feat: add demo form infrastructure, newsletter, and footer

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 13: Floating UI (Contact + Back to top)

**Files:**
- Create: `components/layout/FloatingActions.tsx`
- Modify: `app/[locale]/layout.tsx` (render `<FloatingActions />` after `Footer`, inside `OverlayProvider`)
- Test: `tests/e2e/floating.spec.ts`

**Interfaces:**
- Consumes: `useOverlayCount` (Task 10), `isCurrent` (Task 11), `prefersReducedMotion` (Task 9), messages `Common.backToTop|openContact`.
- Produces: `FloatingActions()`.

- [ ] **Step 1: Write the failing E2E test**

`tests/e2e/floating.spec.ts`:
```ts
import {expect, test} from '@playwright/test';

const contact = (page: import('@playwright/test').Page) => page.getByRole('link', {name: 'Open the contact page'});
const top = (page: import('@playwright/test').Page) => page.getByRole('button', {name: 'Back to top'});

test('back-to-top appears after 600px and scrolls to the top', async ({page}) => {
  await page.goto('/en/ui-lab');
  await expect(contact(page)).toBeVisible();
  await expect(top(page)).toBeHidden();

  await page.evaluate(() => window.scrollTo(0, 700));
  await expect(top(page)).toBeVisible();
  await top(page).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.locator('main#main')).toBeFocused();
});

test('floating buttons hide while a dialog is open', async ({page}) => {
  await page.goto('/en/ui-lab');
  await page.getByRole('button', {name: 'Open dialog'}).click();
  await expect(contact(page)).toBeHidden();
  await page.keyboard.press('Escape');
  await expect(contact(page)).toBeVisible();
});

test('floating buttons come back after navigating away from an open drawer', async ({page}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'drawer is mobile-only');
  await page.goto('/en/ui-lab');
  await page.getByRole('button', {name: 'Open menu'}).click();
  await expect(contact(page)).toBeHidden();
  await page.getByRole('dialog', {name: 'Menu'}).getByRole('link', {name: 'Home'}).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(contact(page)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('');
});

test('browser Back with an open dialog releases the overlay and scroll lock', async ({page}) => {
  await page.goto('/en');
  await page.goto('/en/ui-lab');
  await page.getByRole('button', {name: 'Open dialog'}).click();
  await page.goBack();
  await expect(page).toHaveURL(/\/en$/);
  await expect(contact(page)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('');
});

test('the contact button is not shown on the contact page', async ({page}) => {
  await page.goto('/en/contact');
  await expect(contact(page)).toBeHidden();
});
```

Run: `npm run test:e2e -- tests/e2e/floating.spec.ts`
Expected: FAIL.

- [ ] **Step 2: Implement**

`components/layout/FloatingActions.tsx`:
```tsx
'use client';

import {ArrowUp, MessageCircle} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';
import {Link, usePathname} from '@/lib/i18n/navigation';
import {isCurrent} from '@/lib/navigation/site-nav';
import {prefersReducedMotion} from '@/lib/utils/motion';
import {useOverlayCount} from './OverlayProvider';

const SHOW_TOP_AFTER = 600;

export function FloatingActions() {
  const t = useTranslations('Common');
  const pathname = usePathname();
  const overlays = useOverlayCount();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setShowTop(window.scrollY > SHOW_TOP_AFTER);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Hidden (not just invisible) while a dialog, drawer, or menu is open.
  if (overlays > 0) return null;

  const scrollToTop = () => {
    window.scrollTo({top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth'});
    document.getElementById('main')?.focus({preventScroll: true});
  };

  return (
    <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] end-[calc(1rem+env(safe-area-inset-right))] z-30 flex flex-col items-center gap-3">
      {showTop ? (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label={t('backToTop')}
          className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-surface text-primary shadow-float transition-colors duration-150 hover:bg-background"
        >
          <ArrowUp aria-hidden="true" className="size-5" />
        </button>
      ) : null}
      {isCurrent(pathname, '/contact') ? null : (
        <Link
          href="/contact"
          aria-label={t('openContact')}
          className="inline-flex size-13 items-center justify-center rounded-full bg-primary text-on-primary shadow-float transition-colors duration-150 hover:bg-primary-hover"
        >
          <MessageCircle aria-hidden="true" className="size-6" />
        </Link>
      )}
    </div>
  );
}
```

In `app/[locale]/layout.tsx`, import and render it right after `<Footer settings={settings} />`:
```tsx
import {FloatingActions} from '@/components/layout/FloatingActions';
```
```tsx
            <Footer settings={settings} />
            <FloatingActions />
```

- [ ] **Step 3: Run the milestone suite**

Run: `npm run typecheck && npm run lint && npm run test && npm run test:e2e`
Expected: all PASS.

- [ ] **Step 4: Commit**

```bash
git add components/layout app tests
git commit -m "$(cat <<'EOF'
feat: add floating contact and back-to-top buttons

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

import type {PortableTextBlock} from '@portabletext/types';

export type {Locale} from '@/lib/i18n/routing';

/** Field-level localization (same shape as the Phase 2 Sanity locale objects). Missing `ko` falls back to `en`. */
export type Localized<T = string> = {en: T; ko?: T};

/** Portable Text blocks — the rich-text format Sanity uses. */
export type RichText = PortableTextBlock[];

/** Drives the SAMPLE / Needs-review badges. Kept as fields in the Phase 2 schema. */
export type Flags = {isSample?: boolean; needsReview?: boolean};

export type DocBase = Flags & {_id: string; _type: string};

export type ImageAsset = {url: string; alt: Localized; width: number; height: number; credit?: string};
export type FileAsset = {url: string; sizeBytes?: number; mimeType?: string};

/** `href` is a locale-less path ('/about', '/contact?topic=mentor'), an in-page anchor ('#apply'), or an absolute URL. */
export type Cta = {label: Localized; href: string};
export type CtaBlock = {title: Localized; body: Localized; ctas: Cta[]};
export type SectionIntro = {eyebrow?: Localized; title: Localized; intro?: Localized};
export type Seo = {title: Localized; description: Localized};

export type IconName =
  | 'award'
  | 'bookOpen'
  | 'briefcase'
  | 'calendar'
  | 'compass'
  | 'graduationCap'
  | 'handshake'
  | 'heart'
  | 'lightbulb'
  | 'messageCircle'
  | 'rocket'
  | 'sparkles'
  | 'sprout'
  | 'target'
  | 'trendingUp'
  | 'users';

export type Card = {title: Localized; body: Localized; icon?: IconName};

export type PageHero = {
  eyebrow?: Localized;
  title: Localized;
  body: Localized;
  cta?: Cta;
  secondaryCta?: Cta;
  image?: ImageAsset;
};

/** Locale-resolved shape of a document: every `Localized<X>` becomes `X`. */
export type Resolved<T> = T extends RichText
  ? T
  : T extends Localized<infer U>
    ? Resolved<U>
    : T extends readonly (infer E)[]
      ? Resolved<E>[]
      : T extends object
        ? {[K in keyof T]: Resolved<T[K]>}
        : T;

export type ImageView = Resolved<ImageAsset>;
export type CtaView = Resolved<Cta>;
export type CtaBlockView = Resolved<CtaBlock>;
export type SectionIntroView = Resolved<SectionIntro>;
export type CardView = Resolved<Card>;
export type PageHeroView = Resolved<PageHero>;

import type {
  Card,
  Cta,
  CtaBlock,
  DocBase,
  Flags,
  ImageAsset,
  Localized,
  PageHero,
  Resolved,
  SectionIntro,
  Seo,
} from './common';

export type SiteSettingsDoc = DocBase & {
  _type: 'siteSettings';
  orgName: string;
  orgFullName: Localized;
  description: Localized;
  contact: Flags & {email: string; location: Localized};
  social: Flags & {facebook?: string; linkedin?: string};
  preFooterCta: CtaBlock;
  newsletter: {title: Localized; body: Localized};
};
export type SiteSettings = Resolved<SiteSettingsDoc> & {currentYear: number};

export type HeroSlideKind = 'overview' | 'mentor' | 'event';
export type HeroSlide = Flags & {
  key: string;
  kind: HeroSlideKind;
  eyebrow?: Localized;
  title: Localized;
  body: Localized;
  media: {type: 'image' | 'video'; image: ImageAsset; videoUrl?: string};
  ctas: Cta[];
  /** kind 'event': the repository swaps in this event's cover image and links the first CTA to it. */
  eventSlug?: string;
};
export type HeroSlideView = Resolved<HeroSlide>;

export type GetInvolvedCard = Card & {cta: Cta; tone: 'primary' | 'secondary' | 'accent'};
export type GetInvolvedCardView = Resolved<GetInvolvedCard>;

export type HomePageDoc = DocBase & {
  _type: 'homePage';
  seo: Seo;
  heroSlides: HeroSlide[];
  sponsors: SectionIntro;
  purpose: SectionIntro & Flags & {body: Localized; cta: Cta};
  impact: SectionIntro;
  mentorshipPreview: SectionIntro & Flags & {items: Card[]; cta: Cta};
  featuredMentors: SectionIntro & {cta: Cta};
  highlights: SectionIntro & {cta: Cta};
  testimonials: SectionIntro;
  getInvolved: SectionIntro & {cards: GetInvolvedCard[]};
  faq: SectionIntro;
};
export type HomePage = Resolved<HomePageDoc>;

export type AboutPageDoc = DocBase & {
  _type: 'aboutPage';
  seo: Seo;
  hero: PageHero;
  purpose: SectionIntro & {body: Localized};
  values: SectionIntro;
  missionVision: Flags & {
    mission: {title: Localized; body: Localized};
    vision: {title: Localized; body: Localized};
  };
  story: SectionIntro;
  impact: SectionIntro & Flags & {cases: Card[]};
  team: SectionIntro;
  reportsTeaser: SectionIntro & {cta: Cta};
  faq: SectionIntro;
  cta: CtaBlock;
};
export type AboutPage = Resolved<AboutPageDoc>;

export type ReportsPageDoc = DocBase & {_type: 'reportsPage'; seo: Seo; hero: PageHero};
export type ReportsPage = Resolved<ReportsPageDoc>;

export type MentorshipPageDoc = DocBase & {
  _type: 'mentorshipPage';
  seo: Seo;
  hero: PageHero;
  offer: SectionIntro & Flags & {summary: Localized; benefits: Card[]};
  inlineCta: {title: Localized; cta: Cta};
  eligibility: SectionIntro & Flags & {items: Localized<string[]>};
  process: SectionIntro & Flags & {steps: {title: Localized; body: Localized; duration?: Localized}[]};
  details: SectionIntro & Flags & {items: {label: Localized; value: Localized}[]};
  outcomes: SectionIntro & {items: Card[]};
  stories: SectionIntro;
  apply: SectionIntro & Flags & {body: Localized; nextCohort: Localized; deadline: Localized};
  faq: SectionIntro;
};
export type MentorshipPage = Resolved<MentorshipPageDoc>;

export type MentorsPageDoc = DocBase & {
  _type: 'mentorsPage';
  seo: Seo;
  hero: PageHero;
  featured: SectionIntro;
  directory: SectionIntro;
  cta: CtaBlock;
};
export type MentorsPage = Resolved<MentorsPageDoc>;

export type DonatePageDoc = DocBase & {
  _type: 'donatePage';
  seo: Seo;
  hero: PageHero;
  why: SectionIntro & Flags & {body: Localized; points: Card[]};
  impact: SectionIntro;
  fundUsage: SectionIntro & Flags & {items: {label: Localized; percent: number}[]};
  options: SectionIntro;
  faq: SectionIntro;
};
export type DonatePage = Resolved<DonatePageDoc>;

export type EventsPageDoc = DocBase & {
  _type: 'eventsPage';
  seo: Seo;
  hero: PageHero;
  featured: SectionIntro;
  upcoming: SectionIntro;
  timeline: SectionIntro;
  latest: SectionIntro;
  recap: SectionIntro;
  forms: SectionIntro & {hostIntro: Localized; requestIntro: Localized};
};
export type EventsPage = Resolved<EventsPageDoc>;

export type ContactPageDoc = DocBase & {
  _type: 'contactPage';
  seo: Seo;
  hero: PageHero;
  info: SectionIntro;
  form: SectionIntro;
  location: SectionIntro;
  faq: SectionIntro;
};
export type ContactPage = Resolved<ContactPageDoc>;

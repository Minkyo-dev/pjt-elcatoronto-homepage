import type {DocBase, FileAsset, IconName, ImageAsset, Localized, Resolved, RichText} from './common';

export type FaqGroup = 'home' | 'about' | 'mentorship' | 'donate' | 'events' | 'contact';
export type FaqDoc = DocBase & {_type: 'faq'; group: FaqGroup; question: Localized; answer: Localized<RichText>; order: number};
export type Faq = Resolved<FaqDoc>;

export type SponsorDoc = DocBase & {_type: 'sponsor'; name: string; logo?: ImageAsset; url?: string; order: number};
export type Sponsor = Resolved<SponsorDoc>;

export type ReportKind = 'financial' | 'annual';
export type ReportDoc = DocBase & {
  _type: 'report';
  kind: ReportKind;
  year: number;
  title: Localized;
  summary?: Localized;
  file?: FileAsset;
};
export type Report = Resolved<ReportDoc>;

export type HistoryEntryDoc = DocBase & {
  _type: 'timelineEntry';
  group: 'history';
  year: number;
  title: Localized;
  body?: Localized;
  order: number;
};
export type HistoryEntry = Resolved<HistoryEntryDoc>;

export type StatGroup = 'home' | 'about';
export type StatDoc = DocBase & {
  _type: 'stat';
  group: StatGroup;
  /** Display string, e.g. "12", "~200" / "약 200" */
  value: Localized;
  label: Localized;
  description?: Localized;
  order: number;
};
export type Stat = Resolved<StatDoc>;

export type CoreValueDoc = DocBase & {_type: 'coreValue'; title: Localized; body: Localized; icon?: IconName; order: number};
export type CoreValue = Resolved<CoreValueDoc>;

export type DonationTierDoc = DocBase & {_type: 'donationTier'; amount: number; impact: Localized; order: number};
export type DonationTier = Resolved<DonationTierDoc>;

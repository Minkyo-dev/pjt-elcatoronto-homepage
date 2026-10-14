import type {DocBase, Localized, Resolved} from './common';

export type MentorDoc = DocBase & {
  _type: 'mentor';
  slug: string;
  name: Localized;
  jobTitle: Localized;
  company: Localized;
  location: Localized;
  /** ELCA cohort the mentor came from, if they were a mentee. */
  cohort?: number;
  /** e.g. "Cohort 2 Mentee → Mentor" / "Mentor since Cohort 5" */
  cohortRole?: Localized;
  bio: Localized;
  expertise: Localized<string[]>;
  linkedinUrl?: string;
  /** Reserved for future filters (no UI in Phase 1). */
  industry?: string;
  /** Reserved for future filters (no UI in Phase 1). */
  role?: string;
  featured?: boolean;
  order: number;
};

/** `nameAlt` is the name in the other locale, so search works in English and Korean. */
export type Mentor = Resolved<MentorDoc> & {nameAlt: string};

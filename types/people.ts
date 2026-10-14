import type {DocBase, ImageAsset, Localized, Resolved} from './common';

export type TeamMemberDoc = DocBase & {
  _type: 'teamMember';
  name: Localized;
  title: Localized;
  bio?: Localized;
  photo?: ImageAsset;
  order: number;
};
export type TeamMember = Resolved<TeamMemberDoc>;

export type TestimonialDoc = DocBase & {
  _type: 'testimonial';
  quote: Localized;
  name: Localized;
  authorType: 'mentee' | 'mentor';
  cohort?: number;
  context?: Localized;
  order: number;
};
export type Testimonial = Resolved<TestimonialDoc>;

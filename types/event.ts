import type {DocBase, ImageAsset, Localized, Resolved, RichText} from './common';

export type EventKind = 'workshop' | 'event';
export type LocationMode = 'online' | 'in-person' | 'hybrid';
export type EventStatus = 'upcoming' | 'past';

export type EventDoc = DocBase & {
  _type: 'event';
  slug: string;
  kind: EventKind;
  title: Localized;
  summary: Localized;
  body: Localized<RichText>;
  /** ISO 8601 with offset, Toronto local time, e.g. 2026-11-20T18:30:00-05:00 */
  startsAt: string;
  endsAt: string;
  location: {mode: LocationMode; label: Localized};
  audience?: Localized;
  capacity?: number;
  agenda?: {time: string; item: Localized}[];
  coverImage: ImageAsset;
  gallery?: ImageAsset[];
  featured?: boolean;
};

/** `status` is computed by the repository from the current time; it is never stored. */
export type EventItem = Resolved<EventDoc> & {status: EventStatus};

export type PostKind = 'story' | 'news';

export type PostDoc = DocBase & {
  _type: 'post';
  slug: string;
  kind: PostKind;
  title: Localized;
  excerpt: Localized;
  body: Localized<RichText>;
  publishedAt: string;
  author?: Localized;
  coverImage: ImageAsset;
  featured?: boolean;
};

export type Post = Resolved<PostDoc>;

export type ContentCategory = 'workshops' | 'events' | 'stories' | 'news';
export type ContentItem = (EventItem & {type: 'event'}) | (Post & {type: 'post'});

export type TimelineEntryView = {
  slug: string;
  title: string;
  startsAt: string;
  status: EventStatus;
  kind: EventKind;
};
export type TimelineYear = {year: number; items: TimelineEntryView[]};

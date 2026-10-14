import type {ContentCategory, EventKind, PostKind} from '@/types/event';

export const CONTENT_CATEGORIES: readonly ContentCategory[] = ['workshops', 'events', 'stories', 'news'];

type Categorizable = {type: 'event'; kind: EventKind} | {type: 'post'; kind: PostKind};

export function categoryOf(item: Categorizable): ContentCategory {
  if (item.type === 'event') return item.kind === 'workshop' ? 'workshops' : 'events';
  return item.kind === 'story' ? 'stories' : 'news';
}

export function matchesCategory(item: Categorizable, category: ContentCategory | 'all'): boolean {
  return category === 'all' || categoryOf(item) === category;
}

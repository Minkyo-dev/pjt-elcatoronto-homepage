import type {ContentItem} from '@/types/event';
import {EventCard} from './EventCard';
import {NewsCard} from './NewsCard';

export function ContentCard({item, cid}: {item: ContentItem; cid?: string}) {
  return item.type === 'event' ? <EventCard event={item} cid={cid} /> : <NewsCard post={item} cid={cid} />;
}

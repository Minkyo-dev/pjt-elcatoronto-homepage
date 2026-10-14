import type {ContentItem} from '@/types/event';
import {EventCard} from './EventCard';
import {NewsCard} from './NewsCard';

export function ContentCard({item}: {item: ContentItem}) {
  return item.type === 'event' ? <EventCard event={item} /> : <NewsCard post={item} />;
}

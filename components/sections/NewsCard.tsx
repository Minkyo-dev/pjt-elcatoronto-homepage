import {useFormatter, useTranslations} from 'next-intl';
import {Badge} from '@/components/ui/Badge';
import {FlagBadges} from '@/components/ui/FlagBadges';
import {ImageFrame} from '@/components/ui/ImageFrame';
import {Link} from '@/lib/i18n/navigation';
import {cidAttrs} from '@/lib/utils/cid';
import type {Post} from '@/types/event';
import {cardClass, cardImageSizes, cardLinkClass} from './EventCard';

export function NewsCard({post, cid}: {post: Post; cid?: string}) {
  const t = useTranslations('Events');
  const format = useFormatter();
  return (
    <article className={cardClass} {...cidAttrs(cid, 'NewsCard')}>
      <ImageFrame image={post.coverImage} ratio="3/2" sizes={cardImageSizes} rounded={false} />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="category">{t(`categories.${post.kind === 'story' ? 'stories' : 'news'}`)}</Badge>
          <FlagBadges flags={post} />
        </div>
        <p className="text-sm font-medium text-secondary">
          <time dateTime={post.publishedAt}>{format.dateTime(new Date(post.publishedAt), {dateStyle: 'medium'})}</time>
        </p>
        <h3 className="font-heading text-h3 font-bold text-text">
          <Link href={`/events-news/${post.slug}`} className={cardLinkClass}>
            {post.title}
          </Link>
        </h3>
        <p className="text-muted">{post.excerpt}</p>
        {post.author ? <p className="mt-auto pt-2 text-sm text-muted">{t('byAuthor', {author: post.author})}</p> : null}
      </div>
    </article>
  );
}

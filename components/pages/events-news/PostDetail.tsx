import {getFormatter, getTranslations} from 'next-intl/server';
import {Container} from '@/components/layout/Container';
import {Section} from '@/components/layout/Section';
import {Breadcrumb} from '@/components/sections/Breadcrumb';
import {Badge} from '@/components/ui/Badge';
import {FlagBadges} from '@/components/ui/FlagBadges';
import {ImageFrame} from '@/components/ui/ImageFrame';
import {RichText} from '@/components/ui/RichText';
import {cidAttrs} from '@/lib/utils/cid';
import type {ContentItem, Post} from '@/types/event';
import {RelatedContent} from './RelatedContent';

export async function PostDetail({post, related}: {post: Post; related: ContentItem[]}) {
  const [t, tNav, format] = await Promise.all([getTranslations('Events'), getTranslations('Nav'), getFormatter()]);
  return (
    <>
      <section aria-labelledby="page-title" className="border-b border-border bg-background" {...cidAttrs('NWS-01', 'DetailHeader')}>
        <Container className="flex flex-col items-start gap-6 py-12 lg:py-16">
          <Breadcrumb items={[{label: tNav('eventsNews'), href: '/events-news'}]} current={post.title} cid="NWS-01-01" />
          <div className="flex flex-wrap gap-2" {...cidAttrs('NWS-01-02', 'BadgeRow')}>
            <Badge variant="category">{t(`categories.${post.kind === 'story' ? 'stories' : 'news'}`)}</Badge>
            <FlagBadges flags={post} />
          </div>
          <h1 id="page-title" className="max-w-heading font-heading text-display font-extrabold text-balance text-text" {...cidAttrs('NWS-01-03', 'Title')}>
            {post.title}
          </h1>
          <p className="flex flex-wrap gap-x-3 text-muted" {...cidAttrs('NWS-01-04', 'PostMeta')}>
            <time dateTime={post.publishedAt}>{format.dateTime(new Date(post.publishedAt), {dateStyle: 'long'})}</time>
            {post.author ? <span>{t('byAuthor', {author: post.author})}</span> : null}
          </p>
        </Container>
      </section>
      <Section cid="NWS-02">
        <div className="mx-auto flex max-w-heading flex-col gap-8">
          <ImageFrame image={post.coverImage} ratio="16/9" sizes="(min-width: 1024px) 56rem, 100vw" eager cid="NWS-02-01" />
          <RichText value={post.body} className="text-lg" cid="NWS-02-02" />
        </div>
      </Section>
      <RelatedContent items={related} title={t('related')} cid="NWS-03" />
    </>
  );
}

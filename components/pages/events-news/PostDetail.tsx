import {getFormatter, getTranslations} from 'next-intl/server';
import {Container} from '@/components/layout/Container';
import {Section} from '@/components/layout/Section';
import {Breadcrumb} from '@/components/sections/Breadcrumb';
import {Badge} from '@/components/ui/Badge';
import {FlagBadges} from '@/components/ui/FlagBadges';
import {ImageFrame} from '@/components/ui/ImageFrame';
import {RichText} from '@/components/ui/RichText';
import type {ContentItem, Post} from '@/types/event';
import {RelatedContent} from './RelatedContent';

export async function PostDetail({post, related}: {post: Post; related: ContentItem[]}) {
  const [t, tNav, format] = await Promise.all([getTranslations('Events'), getTranslations('Nav'), getFormatter()]);
  return (
    <>
      <section aria-labelledby="page-title" className="border-b border-border bg-background">
        <Container className="flex flex-col items-start gap-6 py-12 lg:py-16">
          <Breadcrumb items={[{label: tNav('eventsNews'), href: '/events-news'}]} current={post.title} />
          <div className="flex flex-wrap gap-2">
            <Badge variant="category">{t(`categories.${post.kind === 'story' ? 'stories' : 'news'}`)}</Badge>
            <FlagBadges flags={post} />
          </div>
          <h1 id="page-title" className="max-w-heading font-heading text-display font-extrabold text-balance text-text">
            {post.title}
          </h1>
          <p className="flex flex-wrap gap-x-3 text-muted">
            <time dateTime={post.publishedAt}>{format.dateTime(new Date(post.publishedAt), {dateStyle: 'long'})}</time>
            {post.author ? <span>{t('byAuthor', {author: post.author})}</span> : null}
          </p>
        </Container>
      </section>
      <Section>
        <div className="mx-auto flex max-w-heading flex-col gap-8">
          <ImageFrame image={post.coverImage} ratio="16/9" sizes="(min-width: 1024px) 56rem, 100vw" eager />
          <RichText value={post.body} className="text-lg" />
        </div>
      </Section>
      <RelatedContent items={related} title={t('related')} />
    </>
  );
}

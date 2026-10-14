import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {EventDetail} from '@/components/pages/events-news/EventDetail';
import {PostDetail} from '@/components/pages/events-news/PostDetail';
import {getAllContentSlugs, getContentBySlug, getRelated} from '@/lib/content/content';
import {assertLocale} from '@/lib/i18n/locale';
import {buildPageMetadata} from '@/lib/i18n/metadata';

// Every slug × locale is prerendered. Unknown slugs render on request and call notFound() (HTTP 404).
export async function generateStaticParams() {
  return (await getAllContentSlugs()).map((slug) => ({slug}));
}

export async function generateMetadata({params}: PageProps<'/[locale]/events-news/[slug]'>): Promise<Metadata> {
  const {locale: rawLocale, slug} = await params;
  const locale = assertLocale(rawLocale);
  const item = await getContentBySlug(locale, slug);
  if (!item) return {};
  return buildPageMetadata({
    locale,
    path: `/events-news/${slug}`,
    title: item.title,
    description: item.type === 'event' ? item.summary : item.excerpt,
    image: item.coverImage,
  });
}

export default async function ContentDetailPage({params}: PageProps<'/[locale]/events-news/[slug]'>) {
  const {locale: rawLocale, slug} = await params;
  const locale = assertLocale(rawLocale);
  const item = await getContentBySlug(locale, slug);
  if (!item) notFound();
  const related = await getRelated(locale, slug);

  return item.type === 'event' ? <EventDetail event={item} related={related} /> : <PostDetail post={item} related={related} />;
}

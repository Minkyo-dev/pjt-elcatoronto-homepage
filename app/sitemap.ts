import type {MetadataRoute} from 'next';
import {getAllContentSlugs} from '@/lib/content/content';
import {localizedPath, STATIC_PATHS} from '@/lib/i18n/paths';
import {routing} from '@/lib/i18n/routing';
import {siteUrl} from '@/lib/utils/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const slugs = await getAllContentSlugs();
  const paths = [...STATIC_PATHS, ...slugs.map((slug) => `/events-news/${slug}`)];

  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${base}${localizedPath(locale, path)}`,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((other) => [other, `${base}${localizedPath(other, path)}`])),
      },
    })),
  );
}

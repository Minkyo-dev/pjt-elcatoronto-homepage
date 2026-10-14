import type {MetadataRoute} from 'next';
import {routing} from '@/lib/i18n/routing';
import {siteUrl} from '@/lib/utils/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /studio is the Phase 2 Sanity Studio; ui-lab is a dev-only showcase.
        disallow: ['/studio', ...routing.locales.map((locale) => `/${locale}/ui-lab`)],
      },
    ],
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}

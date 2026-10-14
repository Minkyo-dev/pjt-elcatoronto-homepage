import type {Metadata} from 'next';
import {localizedPath} from './paths';
import {routing} from './routing';

type MetadataImage = {url: string; width: number; height: number; alt: string};

type PageMetadataInput = {
  locale: string;
  /** Locale-less app path, e.g. '/about' */
  path: string;
  title: string;
  description: string;
  image?: MetadataImage;
};

export function buildPageMetadata({locale, path, title, description, image}: PageMetadataInput): Metadata {
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [l, localizedPath(l, path)]),
  );
  languages['x-default'] = localizedPath(routing.defaultLocale, path);

  return {
    title,
    description,
    alternates: {canonical: localizedPath(locale, path), languages},
    openGraph: {
      type: 'website',
      siteName: 'ELCA Toronto',
      title,
      description,
      url: localizedPath(locale, path),
      locale: locale === 'ko' ? 'ko_KR' : 'en_CA',
      images: image ? [{url: image.url, width: image.width, height: image.height, alt: image.alt}] : undefined,
    },
  };
}

import {describe, expect, it} from 'vitest';
import {buildPageMetadata} from '@/lib/i18n/metadata';

describe('buildPageMetadata', () => {
  const metadata = buildPageMetadata({
    locale: 'ko',
    path: '/about',
    title: 'ELCA 소개',
    description: '설명',
  });

  it('sets a canonical URL for the current locale', () => {
    expect(metadata.alternates?.canonical).toBe('/ko/about');
  });

  it('lists every locale plus x-default as alternates', () => {
    expect(metadata.alternates?.languages).toEqual({
      en: '/en/about',
      ko: '/ko/about',
      'x-default': '/en/about',
    });
  });

  it('uses the Korean Open Graph locale', () => {
    expect(metadata.openGraph).toMatchObject({locale: 'ko_KR', title: 'ELCA 소개', url: '/ko/about'});
  });

  it('adds an Open Graph image when provided', () => {
    const withImage = buildPageMetadata({
      locale: 'en',
      path: '/',
      title: 'Home',
      description: 'd',
      image: {url: 'https://images.unsplash.com/x', width: 1200, height: 800, alt: 'A photo'},
    });
    expect(withImage.openGraph?.images).toEqual([
      {url: 'https://images.unsplash.com/x', width: 1200, height: 800, alt: 'A photo'},
    ]);
  });
});

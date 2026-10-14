import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts');

const nextConfig: NextConfig = {
  // Partial Prefetching stays off: with it on, unknown [slug] paths answer 200 instead of 404.
  cacheComponents: true,
  partialPrefetching: false,
  images: {
    remotePatterns: [{protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**'}],
  },
  turbopack: {
    rules: {
      '*.css': {loaders: ['@tailwindcss/turbopack'], as: '*.css'},
    },
  },
};

export default withNextIntl(nextConfig);

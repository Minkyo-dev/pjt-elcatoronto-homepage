import createMiddleware from 'next-intl/middleware';
import {routing} from './lib/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Skip /api, /studio (Phase 2 Sanity Studio), Next.js and Vercel internals, and any path with a file extension.
  matcher: '/((?!api|studio|_next|_vercel|.*\\..*).*)',
};

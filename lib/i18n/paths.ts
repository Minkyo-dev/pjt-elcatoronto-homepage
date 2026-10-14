/** Builds the public URL path for a locale-less app path. */
export function localizedPath(locale: string, path: string): string {
  return `/${locale}${path === '/' ? '' : path}`;
}

/** Every static (non-slug) route of the public site, locale-less. */
export const STATIC_PATHS = [
  '/',
  '/about',
  '/about/reports',
  '/get-involved/mentorship',
  '/get-involved/mentors',
  '/get-involved/donate',
  '/events-news',
  '/contact',
] as const;

/** True for '#anchor', a static route, or /events-news/<known slug> — with optional ?query and #hash. */
export function isKnownInternalHref(href: string, contentSlugs: readonly string[]): boolean {
  if (href.startsWith('#')) return href.length > 1;
  const pathname = href.split(/[?#]/)[0];
  if ((STATIC_PATHS as readonly string[]).includes(pathname)) return true;
  const match = /^\/events-news\/([a-z0-9-]+)$/.exec(pathname);
  return match !== null && contentSlugs.includes(match[1]);
}

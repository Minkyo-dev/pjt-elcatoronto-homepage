/** Builds the public URL path for a locale-less app path. */
export function localizedPath(locale: string, path: string): string {
  return `/${locale}${path === '/' ? '' : path}`;
}

export function normalizeSearch(value: string): string {
  return value.normalize('NFC').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
}

/** Matches the query against the name in both locales; spaces are optional (e.g. "김 지원" finds "김지원"). */
export function filterMentors<T extends {name: string; nameAlt: string}>(mentors: T[], query: string): T[] {
  const q = normalizeSearch(query);
  if (!q) return mentors;
  const compact = q.replace(/ /g, '');
  return mentors.filter((mentor) =>
    [mentor.name, mentor.nameAlt].some((name) => {
      const value = normalizeSearch(name);
      return value.includes(q) || value.replace(/ /g, '').includes(compact);
    }),
  );
}

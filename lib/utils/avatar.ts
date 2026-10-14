const HANGUL_START = /^[ᄀ-ᇿ㄰-㆏가-힯]/;

export function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  if (HANGUL_START.test(trimmed)) return trimmed[0];
  const parts = trimmed.split(/\s+/);
  const first = parts[0][0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : '';
  return `${first}${last}`.toUpperCase();
}

/** Background tokens that all pass AA with white text. */
export const AVATAR_TONES = ['bg-primary', 'bg-secondary', 'bg-accent-strong', 'bg-text'] as const;

export function avatarTone(seed: string): (typeof AVATAR_TONES)[number] {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + (char.codePointAt(0) ?? 0)) >>> 0;
  return AVATAR_TONES[hash % AVATAR_TONES.length];
}

import type {Locale, Localized, Resolved} from '@/types/common';

function hasValue(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim() !== '';
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

export function isLocalized(value: unknown): value is Localized<unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const keys = Object.keys(value);
  return keys.includes('en') && keys.every((key) => key === 'en' || key === 'ko');
}

/** Picks the value for `locale`, falling back to English when it is missing or blank. */
export function localize<T>(value: Localized<T>, locale: Locale): T {
  const preferred = value[locale];
  if (hasValue(preferred)) return preferred as T;
  if (locale !== 'en' && process.env.NODE_ENV === 'development') {
    console.warn(`[i18n] Missing "${locale}" value, falling back to English:`, value.en);
  }
  return value.en;
}

/** Deeply replaces every Localized field with its value for `locale`. */
export function resolveLocalized<T>(value: T, locale: Locale): Resolved<T> {
  if (Array.isArray(value)) {
    return value.map((item) => resolveLocalized(item, locale)) as Resolved<T>;
  }
  if (isLocalized(value)) {
    return resolveLocalized(localize(value, locale), locale) as Resolved<T>;
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, resolveLocalized(child, locale)]),
    ) as Resolved<T>;
  }
  return value as Resolved<T>;
}

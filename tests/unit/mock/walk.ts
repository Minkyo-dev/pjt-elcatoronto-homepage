import {isLocalized} from '@/lib/i18n/localize';

export type Found<T> = {path: string; value: T};

/** Visits every object and array inside `root`, depth-first. */
export function walk(root: unknown, visit: (value: unknown, path: string) => void, path = '$'): void {
  visit(root, path);
  if (Array.isArray(root)) {
    root.forEach((child, i) => walk(child, visit, `${path}[${i}]`));
  } else if (root !== null && typeof root === 'object') {
    for (const [key, child] of Object.entries(root)) walk(child, visit, `${path}.${key}`);
  }
}

type ImageLike = {url: string; width: number; height: number; alt: {en: string; ko?: string}};

export function findImages(root: unknown): Found<ImageLike>[] {
  const found: Found<ImageLike>[] = [];
  walk(root, (value, path) => {
    if (value && typeof value === 'object' && 'url' in value && 'width' in value && 'height' in value) {
      found.push({path, value: value as ImageLike});
    }
  });
  return found;
}

export function findLocalized(root: unknown): Found<{en: unknown; ko?: unknown}>[] {
  const found: Found<{en: unknown; ko?: unknown}>[] = [];
  walk(root, (value, path) => {
    if (isLocalized(value)) found.push({path, value});
  });
  return found;
}

export function isBlank(value: unknown): boolean {
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  return value === undefined || value === null;
}

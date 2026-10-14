import 'server-only';
import {coreValues} from '@/data/mock/core-values';
import {resolveLocalized} from '@/lib/i18n/localize';
import type {Locale} from '@/types/common';
import type {CoreValue} from '@/types/misc';

export async function getCoreValues(locale: Locale): Promise<CoreValue[]> {
  'use cache';
  return resolveLocalized([...coreValues].sort((a, b) => a.order - b.order), locale);
}

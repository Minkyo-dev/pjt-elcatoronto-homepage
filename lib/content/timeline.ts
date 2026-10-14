import 'server-only';
import {history} from '@/data/mock/timeline';
import {resolveLocalized} from '@/lib/i18n/localize';
import type {Locale} from '@/types/common';
import type {HistoryEntry} from '@/types/misc';

export async function getHistory(locale: Locale): Promise<HistoryEntry[]> {
  'use cache';
  return resolveLocalized([...history].sort((a, b) => a.order - b.order), locale);
}

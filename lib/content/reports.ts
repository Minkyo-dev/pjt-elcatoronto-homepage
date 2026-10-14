import 'server-only';
import {reports} from '@/data/mock/reports';
import {resolveLocalized} from '@/lib/i18n/localize';
import type {Locale} from '@/types/common';
import type {Report} from '@/types/misc';

export async function getReports(locale: Locale): Promise<Report[]> {
  'use cache';
  return resolveLocalized([...reports].sort((a, b) => b.year - a.year), locale);
}

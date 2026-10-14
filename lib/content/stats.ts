import 'server-only';
import {stats} from '@/data/mock/stats';
import {resolveLocalized} from '@/lib/i18n/localize';
import type {Locale} from '@/types/common';
import type {Stat, StatGroup} from '@/types/misc';

export async function getStats(locale: Locale, group: StatGroup): Promise<Stat[]> {
  'use cache';
  return resolveLocalized(stats.filter((stat) => stat.group === group).sort((a, b) => a.order - b.order), locale);
}

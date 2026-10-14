import 'server-only';
import {sponsors} from '@/data/mock/sponsors';
import {resolveLocalized} from '@/lib/i18n/localize';
import type {Locale} from '@/types/common';
import type {Sponsor} from '@/types/misc';

export async function getSponsors(locale: Locale): Promise<Sponsor[]> {
  'use cache';
  return resolveLocalized([...sponsors].sort((a, b) => a.order - b.order), locale);
}

import 'server-only';
import {siteSettings} from '@/data/mock/site-settings';
import {resolveLocalized} from '@/lib/i18n/localize';
import type {Locale} from '@/types/common';
import type {SiteSettings} from '@/types/pages';

export async function getSiteSettings(locale: Locale): Promise<SiteSettings> {
  'use cache';
  return {...resolveLocalized(siteSettings, locale), currentYear: new Date().getFullYear()};
}

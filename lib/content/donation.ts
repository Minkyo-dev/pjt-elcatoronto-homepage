import 'server-only';
import {donationTiers} from '@/data/mock/donation-tiers';
import {resolveLocalized} from '@/lib/i18n/localize';
import type {Locale} from '@/types/common';
import type {DonationTier} from '@/types/misc';

export async function getDonationTiers(locale: Locale): Promise<DonationTier[]> {
  'use cache';
  return resolveLocalized([...donationTiers].sort((a, b) => a.order - b.order), locale);
}

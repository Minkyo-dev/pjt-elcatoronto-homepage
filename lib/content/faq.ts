import 'server-only';
import {faqs} from '@/data/mock/faq';
import {resolveLocalized} from '@/lib/i18n/localize';
import type {Locale} from '@/types/common';
import type {Faq, FaqGroup} from '@/types/misc';

export async function getFaqs(locale: Locale, group: FaqGroup): Promise<Faq[]> {
  'use cache';
  return resolveLocalized(faqs.filter((faq) => faq.group === group).sort((a, b) => a.order - b.order), locale);
}

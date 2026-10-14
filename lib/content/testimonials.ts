import 'server-only';
import {testimonials} from '@/data/mock/testimonials';
import {resolveLocalized} from '@/lib/i18n/localize';
import type {Locale} from '@/types/common';
import type {Testimonial} from '@/types/people';

export async function getTestimonials(
  locale: Locale,
  options: {authorType?: 'mentee' | 'mentor'} = {},
): Promise<Testimonial[]> {
  'use cache';
  return resolveLocalized(
    testimonials
      .filter((item) => !options.authorType || item.authorType === options.authorType)
      .sort((a, b) => a.order - b.order),
    locale,
  );
}

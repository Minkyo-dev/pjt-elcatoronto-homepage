import {Scroller} from '@/components/ui/Scroller';
import {itemCid} from '@/lib/utils/cid';
import type {Testimonial} from '@/types/people';
import {TestimonialCard} from './TestimonialCard';

export function TestimonialScroller({testimonials, label, cid}: {testimonials: Testimonial[]; label: string; cid?: string}) {
  return (
    <Scroller
      label={label}
      cid={cid}
      items={testimonials.map((testimonial) => ({key: testimonial._id, node: <TestimonialCard testimonial={testimonial} cid={itemCid(cid)} />}))}
    />
  );
}

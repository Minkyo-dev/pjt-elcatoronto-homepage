import {Scroller} from '@/components/ui/Scroller';
import type {Testimonial} from '@/types/people';
import {TestimonialCard} from './TestimonialCard';

export function TestimonialScroller({testimonials, label}: {testimonials: Testimonial[]; label: string}) {
  return (
    <Scroller
      label={label}
      items={testimonials.map((testimonial) => ({key: testimonial._id, node: <TestimonialCard testimonial={testimonial} />}))}
    />
  );
}

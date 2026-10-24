import {Avatar} from '@/components/ui/Avatar';
import {FlagBadges} from '@/components/ui/FlagBadges';
import {cidAttrs} from '@/lib/utils/cid';
import type {Testimonial} from '@/types/people';

export function TestimonialCard({testimonial, cid}: {testimonial: Testimonial; cid?: string}) {
  return (
    <figure className="flex h-full flex-col justify-between gap-6 rounded-card border border-border bg-surface p-6" {...cidAttrs(cid, 'TestimonialCard')}>
      <blockquote className="text-lg text-text">“{testimonial.quote}”</blockquote>
      <figcaption className="flex flex-wrap items-center gap-3">
        <Avatar name={testimonial.name} seed={testimonial._id} />
        <div className="min-w-0">
          <p className="font-semibold text-text">{testimonial.name}</p>
          {testimonial.context ? <p className="text-sm text-muted">{testimonial.context}</p> : null}
        </div>
        <FlagBadges flags={testimonial} className="ms-auto" />
      </figcaption>
    </figure>
  );
}

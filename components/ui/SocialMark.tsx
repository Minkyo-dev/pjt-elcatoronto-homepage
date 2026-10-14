import {cn} from '@/lib/utils/cn';

// lucide-react 1.x ships no brand icons; lettermarks stand in until the designer supplies official marks.
const MARKS = {facebook: 'f', linkedin: 'in'} as const;

export function SocialMark({network, className}: {network: keyof typeof MARKS; className?: string}) {
  return (
    <span
      aria-hidden="true"
      className={cn('inline-flex size-9 items-center justify-center rounded-full border border-current font-heading text-sm font-bold', className)}
    >
      {MARKS[network]}
    </span>
  );
}

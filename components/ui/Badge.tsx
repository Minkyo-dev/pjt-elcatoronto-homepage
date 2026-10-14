import type {ReactNode} from 'react';
import {cn} from '@/lib/utils/cn';

export type BadgeVariant = 'neutral' | 'category' | 'sample' | 'review' | 'demo';

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'border border-border bg-background text-text',
  category: 'bg-secondary text-on-primary',
  sample: 'border border-dashed border-border-strong bg-surface text-muted',
  review: 'border border-accent-strong bg-surface text-accent-strong',
  demo: 'bg-text text-on-primary',
};

export function Badge({variant = 'neutral', className, children}: {variant?: BadgeVariant; className?: string; children: ReactNode}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

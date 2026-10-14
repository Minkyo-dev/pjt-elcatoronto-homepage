import type {ReactNode} from 'react';
import {cn} from '@/lib/utils/cn';

type SectionHeadingProps = {
  /** id of the h2 — pass the same value to Section's `labelledBy`. */
  id: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: 'start' | 'center';
  tone?: 'default' | 'dark';
  action?: ReactNode;
  className?: string;
};

export function SectionHeading({id, eyebrow, title, intro, align = 'start', tone = 'default', action, className}: SectionHeadingProps) {
  const dark = tone === 'dark';
  return (
    <div
      className={cn(
        'mb-10 flex flex-col gap-4',
        action ? 'sm:flex-row sm:items-end sm:justify-between' : undefined,
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      <div className={cn('flex max-w-heading flex-col gap-3', align === 'center' && 'items-center')}>
        {eyebrow ? (
          <p className={cn('text-eyebrow font-semibold uppercase', dark ? 'text-on-primary-muted' : 'text-secondary')}>{eyebrow}</p>
        ) : null}
        <h2 id={id} className={cn('font-heading text-h2 font-bold text-balance', dark ? 'text-on-primary' : 'text-text')}>
          {title}
        </h2>
        {intro ? <p className={cn('max-w-body text-lg', dark ? 'text-on-primary-muted' : 'text-muted')}>{intro}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

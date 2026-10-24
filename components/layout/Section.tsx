import type {ReactNode} from 'react';
import {cidAttrs} from '@/lib/utils/cid';
import {cn} from '@/lib/utils/cn';
import {Container} from './Container';

export type SectionTone = 'default' | 'surface' | 'primary';

const toneClasses: Record<SectionTone, string> = {
  default: 'bg-background',
  surface: 'bg-surface',
  primary: 'on-dark bg-primary text-on-primary',
};

type SectionProps = {
  id?: string;
  labelledBy?: string;
  tone?: SectionTone;
  className?: string;
  /** Wrap children in the page container (default true). */
  contained?: boolean;
  /** Design-review component ID (lib/utils/cid.ts). */
  cid?: string;
  children: ReactNode;
};

export function Section({id, labelledBy, tone = 'default', className, contained = true, cid, children}: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn('section-y', toneClasses[tone], className)} {...cidAttrs(cid, 'Section')}>
      {contained ? <Container>{children}</Container> : children}
    </section>
  );
}

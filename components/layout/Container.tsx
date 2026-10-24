import type {ReactNode} from 'react';
import {cidAttrs} from '@/lib/utils/cid';
import {cn} from '@/lib/utils/cn';

export function Container({className, cid, children}: {className?: string; cid?: string; children: ReactNode}) {
  return (
    <div className={cn('container-page', className)} {...cidAttrs(cid, 'Container')}>
      {children}
    </div>
  );
}

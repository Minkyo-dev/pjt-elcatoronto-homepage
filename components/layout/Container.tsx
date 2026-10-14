import type {ReactNode} from 'react';
import {cn} from '@/lib/utils/cn';

export function Container({className, children}: {className?: string; children: ReactNode}) {
  return <div className={cn('container-page', className)}>{children}</div>;
}

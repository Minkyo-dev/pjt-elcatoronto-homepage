import type {ComponentProps} from 'react';
import {cn} from '@/lib/utils/cn';

const fieldClass =
  'w-full rounded-button border border-border-strong bg-surface px-3 text-base text-text placeholder:text-muted transition-colors duration-150 hover:border-text aria-[invalid=true]:border-danger';

export function Input({className, ...props}: ComponentProps<'input'>) {
  return <input {...props} className={cn(fieldClass, 'min-h-11 py-2', className)} />;
}

export function Textarea({className, rows = 5, ...props}: ComponentProps<'textarea'>) {
  return <textarea rows={rows} {...props} className={cn(fieldClass, 'py-2.5', className)} />;
}

export function Select({className, ...props}: ComponentProps<'select'>) {
  return <select {...props} className={cn(fieldClass, 'min-h-11 py-2', className)} />;
}

import {ChevronDown} from 'lucide-react';
import type {ReactNode} from 'react';
import {cn} from '@/lib/utils/cn';

export type AccordionItem = {id: string; title: string; content: ReactNode};

/** Native <details>: keyboard and screen-reader support come from the browser. */
export function Accordion({items, className}: {items: AccordionItem[]; className?: string}) {
  return (
    <div className={cn('divide-y divide-border rounded-card border border-border bg-surface', className)}>
      {items.map((item) => (
        <details key={item.id} id={item.id} className="group">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-heading text-base font-semibold text-text [&::-webkit-details-marker]:hidden">
            <span>{item.title}</span>
            <ChevronDown
              aria-hidden="true"
              className="size-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
            />
          </summary>
          <div className="px-5 pb-5 text-text">{item.content}</div>
        </details>
      ))}
    </div>
  );
}

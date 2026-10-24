'use client';

import {useId, useRef, type KeyboardEvent, type ReactNode} from 'react';
import {cidAttrs} from '@/lib/utils/cid';
import {cn} from '@/lib/utils/cn';

export type TabItem = {id: string; label: string};

type TabsProps = {
  label: string;
  items: TabItem[];
  value: string;
  onValueChange: (id: string) => void;
  children: ReactNode;
  className?: string;
  cid?: string;
};

/** WAI-ARIA tabs (automatic activation). The parent renders the active panel's content as children. */
export function Tabs({label, items, value, onValueChange, children, className, cid}: TabsProps) {
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = Math.max(0, items.findIndex((item) => item.id === value));
  const activeItem = items[activeIndex];

  function activate(index: number) {
    const next = (index + items.length) % items.length;
    onValueChange(items[next].id);
    tabRefs.current[next]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const targets: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: items.length - 1,
    };
    if (event.key in targets) {
      event.preventDefault();
      activate(targets[event.key]);
    }
  }

  return (
    <div className={className} {...cidAttrs(cid, 'Tabs')}>
      <div role="tablist" aria-label={label} className="flex gap-1 overflow-x-auto border-b border-border">
        {items.map((item, index) => {
          const selected = index === activeIndex;
          return (
            <button
              key={item.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onValueChange(item.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                '-mb-px min-h-11 shrink-0 whitespace-nowrap border-b-2 px-4 text-sm font-semibold transition-colors duration-150',
                selected ? 'border-secondary text-text' : 'border-transparent text-muted hover:text-text',
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={activeItem ? `${baseId}-tab-${activeItem.id}` : undefined}
        tabIndex={0}
        className="pt-8"
      >
        {children}
      </div>
    </div>
  );
}

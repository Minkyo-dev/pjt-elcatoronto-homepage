'use client';

import {ChevronLeft, ChevronRight} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useRef, type ReactNode} from 'react';
import {cidAttrs} from '@/lib/utils/cid';
import {cn} from '@/lib/utils/cn';
import {prefersReducedMotion} from '@/lib/utils/motion';

type ScrollerProps = {
  label: string;
  items: {key: string; node: ReactNode}[];
  /** Width classes for each item, e.g. 'w-[85%] sm:w-[45%] lg:w-[calc((100%-3rem)/3)]'. */
  itemClassName?: string;
  cid?: string;
};

const controlClass =
  'inline-flex size-11 items-center justify-center rounded-full border border-border bg-surface text-primary transition-colors duration-150 hover:bg-background';

/** Horizontal, snap-scrolling list. The list itself is focusable so arrow keys scroll it. */
export function Scroller({label, items, itemClassName = 'w-[85%] sm:w-[45%] lg:w-[calc((100%-3rem)/3)]', cid}: ScrollerProps) {
  const t = useTranslations('Common');
  const listRef = useRef<HTMLUListElement>(null);

  function scrollByItem(direction: 1 | -1) {
    const list = listRef.current;
    if (!list) return;
    const first = list.querySelector('li');
    const step = first ? first.getBoundingClientRect().width + 24 : list.clientWidth;
    list.scrollBy({left: direction * step, behavior: prefersReducedMotion() ? 'auto' : 'smooth'});
  }

  return (
    <div {...cidAttrs(cid, 'Scroller')}>
      <div className="mb-4 flex justify-end gap-2">
        <button type="button" onClick={() => scrollByItem(-1)} aria-label={t('previous')} className={controlClass}>
          <ChevronLeft aria-hidden="true" className="size-5" />
        </button>
        <button type="button" onClick={() => scrollByItem(1)} aria-label={t('next')} className={controlClass}>
          <ChevronRight aria-hidden="true" className="size-5" />
        </button>
      </div>
      <ul
        ref={listRef}
        tabIndex={0}
        aria-label={t('scrollerLabel', {label})}
        className="relative flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4"
      >
        {items.map((item) => (
          <li key={item.key} className={cn('shrink-0 snap-start', itemClassName)}>
            {item.node}
          </li>
        ))}
      </ul>
    </div>
  );
}

'use client';

import {useEffect, useRef} from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * After a "Load more" reveals items, moves focus to the first newly revealed one so keyboard and
 * screen-reader users do not lose their place when the button unmounts. Attach `listRef` to the
 * list (or its wrapper), call `reveal(currentCount)` before increasing the count.
 */
export function useRevealFocus<T extends HTMLElement>(visible: number) {
  const listRef = useRef<T>(null);
  const from = useRef<number | null>(null);

  useEffect(() => {
    const start = from.current;
    from.current = null;
    if (start === null) return;
    const root = listRef.current;
    const list = root?.matches('ul') ? root : root?.querySelector(':scope > ul');
    const item = list?.querySelectorAll(':scope > li')[start];
    item?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
  }, [visible]);

  const reveal = (currentCount: number) => {
    from.current = currentCount;
  };
  return {listRef, reveal};
}

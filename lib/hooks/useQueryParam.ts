'use client';

import {useCallback, useSyncExternalStore} from 'react';
import {parseEnum} from '@/lib/validation/query';

const CHANGE_EVENT = 'elca:querychange';

function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener('popstate', callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

/**
 * Reads a whitelisted query parameter after hydration. The server snapshot is always `null`,
 * so pages stay statically rendered; invalid values are ignored.
 */
export function useQueryParam<T extends string>(key: string, allowed: readonly T[]): [T | null, (value: T | null) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => parseEnum(new URLSearchParams(window.location.search).get(key), allowed),
    () => null,
  );

  const setValue = useCallback(
    (next: T | null) => {
      const url = new URL(window.location.href);
      if (next === null) url.searchParams.delete(key);
      else url.searchParams.set(key, next);
      window.history.replaceState(null, '', url);
      window.dispatchEvent(new Event(CHANGE_EVENT));
    },
    [key],
  );

  return [value, setValue];
}

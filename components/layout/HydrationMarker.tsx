'use client';

import {useEffect} from 'react';

/** Marks <html data-hydrated="true"> once React has hydrated; e2e tests wait for it before interacting. */
export function HydrationMarker() {
  useEffect(() => {
    document.documentElement.dataset.hydrated = 'true';
  }, []);
  return null;
}

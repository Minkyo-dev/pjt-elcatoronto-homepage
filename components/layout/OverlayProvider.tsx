'use client';

import {createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode} from 'react';

type OverlayContextValue = {count: number; register: () => void; unregister: () => void};

const OverlayContext = createContext<OverlayContextValue | null>(null);

/** Counts open overlays (dialogs, drawers, menus) so floating UI can hide while any is open. */
export function OverlayProvider({children}: {children: ReactNode}) {
  const [count, setCount] = useState(0);
  const register = useCallback(() => setCount((current) => current + 1), []);
  const unregister = useCallback(() => setCount((current) => Math.max(0, current - 1)), []);
  const value = useMemo(() => ({count, register, unregister}), [count, register, unregister]);
  return <OverlayContext value={value}>{children}</OverlayContext>;
}

function useOverlayContext(): OverlayContextValue {
  const context = useContext(OverlayContext);
  if (!context) throw new Error('OverlayProvider is missing from the layout.');
  return context;
}

export function useOverlayCount(): number {
  return useOverlayContext().count;
}

/** Registers an open overlay; unregisters when it closes or unmounts (e.g. on navigation). */
export function useRegisterOverlay(active: boolean): void {
  const {register, unregister} = useOverlayContext();
  useEffect(() => {
    if (!active) return;
    register();
    return unregister;
  }, [active, register, unregister]);
}

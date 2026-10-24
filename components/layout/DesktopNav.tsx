'use client';

import {ChevronDown} from 'lucide-react';
import {useEffect, useRef, useState, type KeyboardEvent} from 'react';
import {useRegisterOverlay} from '@/components/layout/OverlayProvider';
import {Link, usePathname} from '@/lib/i18n/navigation';
import {isCurrent, isNavGroup, isWithin, type NavItem} from '@/lib/navigation/site-nav';
import {cidAttrs} from '@/lib/utils/cid';
import {cn} from '@/lib/utils/cn';

const topLinkClass =
  'inline-flex min-h-11 items-center gap-1 rounded-button px-3 text-sm font-semibold text-text transition-colors duration-150 hover:text-secondary';
const activeClass = 'underline decoration-secondary decoration-2 underline-offset-8';

function panelLinks(key: string): HTMLAnchorElement[] {
  return Array.from(document.querySelectorAll<HTMLAnchorElement>(`#nav-panel-${key} a`));
}

export function DesktopNav({items, label, cid}: {items: NavItem[]; label: string; cid?: string}) {
  const pathname = usePathname();
  const [openKey, setOpenKey] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useRegisterOverlay(openKey !== null);

  useEffect(() => {
    if (!openKey) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpenKey(null);
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpenKey(null);
      document.getElementById(`nav-trigger-${openKey}`)?.focus();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [openKey]);

  function openAndFocus(key: string, index: number) {
    setOpenKey(key);
    requestAnimationFrame(() => panelLinks(key).at(index)?.focus());
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>, key: string) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      openAndFocus(key, 0);
    }
  }

  function onPanelKeyDown(event: KeyboardEvent<HTMLUListElement>, key: string) {
    const links = panelLinks(key);
    const index = links.indexOf(document.activeElement as HTMLAnchorElement);
    const targets: Record<string, number> = {ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: links.length - 1};
    if (event.key in targets) {
      event.preventDefault();
      links[(targets[event.key] + links.length) % links.length]?.focus();
    }
  }

  return (
    <nav ref={navRef} aria-label={label} className="hidden lg:block" {...cidAttrs(cid, 'DesktopNav')}>
      <ul className="flex items-center gap-1">
        {items.map((item) => {
          if (!isNavGroup(item)) {
            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-current={isCurrent(pathname, item.href) ? 'page' : undefined}
                  className={cn(topLinkClass, isWithin(pathname, item.href) && activeClass)}
                >
                  {item.label}
                </Link>
              </li>
            );
          }
          const open = openKey === item.key;
          const active = item.children.some((child) => isWithin(pathname, child.href));
          return (
            <li
              key={item.key}
              className="relative"
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setOpenKey((current) => (current === item.key ? null : current));
                }
              }}
            >
              <button
                id={`nav-trigger-${item.key}`}
                type="button"
                aria-expanded={open}
                aria-controls={`nav-panel-${item.key}`}
                onClick={() => setOpenKey(open ? null : item.key)}
                onKeyDown={(event) => onTriggerKeyDown(event, item.key)}
                className={cn(topLinkClass, active && activeClass)}
              >
                {item.label}
                <ChevronDown aria-hidden="true" className={cn('size-4 transition-transform duration-150', open && 'rotate-180')} />
              </button>
              <ul
                id={`nav-panel-${item.key}`}
                hidden={!open}
                onKeyDown={(event) => onPanelKeyDown(event, item.key)}
                className="absolute start-0 top-full z-40 mt-2 min-w-56 rounded-card border border-border bg-surface p-2 shadow-float"
              >
                {item.children.map((child) => (
                  <li key={child.key}>
                    <Link
                      href={child.href}
                      aria-current={isCurrent(pathname, child.href) ? 'page' : undefined}
                      onClick={() => setOpenKey(null)}
                      className="flex min-h-11 items-center rounded-button px-3 text-sm font-medium text-text transition-colors duration-150 hover:bg-background aria-[current=page]:text-secondary"
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

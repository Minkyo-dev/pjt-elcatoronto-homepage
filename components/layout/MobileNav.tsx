'use client';

import {ChevronDown, Menu} from 'lucide-react';
import {useEffect, useState} from 'react';
import {Button} from '@/components/ui/Button';
import {Dialog} from '@/components/ui/Dialog';
import {Link, usePathname} from '@/lib/i18n/navigation';
import {isCurrent, isNavGroup, isWithin, type NavItem} from '@/lib/navigation/site-nav';
import {LanguageSwitcher} from './LanguageSwitcher';

type MobileNavProps = {items: NavItem[]; title: string; openLabel: string; donateLabel: string};

const linkClass =
  'flex min-h-12 items-center rounded-button px-3 font-semibold text-text transition-colors duration-150 hover:bg-background aria-[current=page]:text-secondary';

export function MobileNav({items, title, openLabel, donateLabel}: MobileNavProps) {
  const pathname = usePathname();
  // Open state is tied to the path it was opened on, so any route change closes the drawer.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const close = () => setOpenPath(null);

  // Crossing into the desktop layout hides this nav; close so no invisible modal remains.
  useEffect(() => {
    const query = window.matchMedia('(min-width: 64rem)');
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpenPath(null);
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={openLabel}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpenPath(pathname)}
        className="inline-flex size-11 items-center justify-center rounded-button text-primary transition-colors duration-150 hover:bg-background"
      >
        <Menu aria-hidden="true" className="size-6" />
      </button>
      <Dialog open={open} onClose={close} title={title} variant="drawer">
        <nav id="mobile-nav" aria-label={title}>
          <ul className="flex flex-col gap-1">
            {items.map((item) =>
              isNavGroup(item) ? (
                <li key={item.key}>
                  <details className="group" open={item.children.some((child) => isWithin(pathname, child.href))}>
                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between rounded-button px-3 font-semibold text-text hover:bg-background [&::-webkit-details-marker]:hidden">
                      {item.label}
                      <ChevronDown aria-hidden="true" className="size-5 transition-transform duration-200 group-open:rotate-180" />
                    </summary>
                    <ul className="ms-3 flex flex-col gap-1 border-s border-border ps-3">
                      {item.children.map((child) => (
                        <li key={child.key}>
                          <Link
                            href={child.href}
                            onClick={close}
                            aria-current={isCurrent(pathname, child.href) ? 'page' : undefined}
                            className={linkClass}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ) : (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={isCurrent(pathname, item.href) ? 'page' : undefined}
                    className={linkClass}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>
        <div className="mt-6 flex flex-col gap-4 border-t border-border pt-6">
          <LanguageSwitcher onNavigate={close} />
          <Button href="/get-involved/donate" variant="accent" onClick={close}>
            {donateLabel}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

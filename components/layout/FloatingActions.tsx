'use client';

import {ArrowUp, MessageCircle} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';
import {Link, usePathname} from '@/lib/i18n/navigation';
import {isCurrent} from '@/lib/navigation/site-nav';
import {cidAttrs} from '@/lib/utils/cid';
import {prefersReducedMotion} from '@/lib/utils/motion';
import {useOverlayCount} from './OverlayProvider';

const SHOW_TOP_AFTER = 600;

export function FloatingActions() {
  const t = useTranslations('Common');
  const pathname = usePathname();
  const overlays = useOverlayCount();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setShowTop(window.scrollY > SHOW_TOP_AFTER);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Hidden (not just invisible) while a dialog, drawer, or menu is open.
  if (overlays > 0) return null;

  const scrollToTop = () => {
    window.scrollTo({top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth'});
    document.getElementById('main')?.focus({preventScroll: true});
  };

  return (
    <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] end-[calc(1rem+env(safe-area-inset-right))] z-30 flex flex-col items-center gap-3"
      {...cidAttrs('GLB-06', 'FloatingActions')}
    >
      {showTop ? (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label={t('backToTop')}
          className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-surface text-primary shadow-float transition-colors duration-150 hover:bg-background"
        >
          <ArrowUp aria-hidden="true" className="size-5" />
        </button>
      ) : null}
      {isCurrent(pathname, '/contact') ? null : (
        <Link
          href="/contact"
          aria-label={t('openContact')}
          className="inline-flex size-13 items-center justify-center rounded-full bg-primary text-on-primary shadow-float transition-colors duration-150 hover:bg-primary-hover"
        >
          <MessageCircle aria-hidden="true" className="size-6" />
        </Link>
      )}
    </div>
  );
}

'use client';

import {X} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useEffect, useId, useRef, type ReactNode} from 'react';
import {useRegisterOverlay} from '@/components/layout/OverlayProvider';
import {cn} from '@/lib/utils/cn';

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  titleHidden?: boolean;
  description?: string;
  variant?: 'modal' | 'drawer' | 'lightbox';
  size?: 'md' | 'lg';
  children: ReactNode;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

const variantClasses = {
  modal: 'm-auto max-h-[90dvh] w-[calc(100%-2rem)] rounded-card',
  drawer: 'my-0 me-0 ms-auto h-dvh max-h-dvh w-full max-w-sm',
  lightbox: 'm-auto max-h-[92dvh] w-[calc(100%-2rem)] max-w-5xl rounded-card',
} as const;

export function Dialog({open, onClose, title, titleHidden, description, variant = 'modal', size = 'md', children}: DialogProps) {
  const t = useTranslations('Common');
  const ref = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useRegisterOverlay(open);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
      document.documentElement.style.overflow = 'hidden';
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleClose = () => {
      document.documentElement.style.overflow = '';
      returnFocusRef.current?.focus();
      onClose();
    };
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  // If the dialog unmounts while open (e.g. browser Back), release the scroll lock.
  useEffect(() => () => {
    document.documentElement.style.overflow = '';
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className={cn(
        'bg-surface p-0 text-text shadow-float backdrop:bg-overlay',
        variantClasses[variant],
        variant === 'modal' && (size === 'lg' ? 'max-w-3xl' : 'max-w-2xl'),
      )}
      onClick={(event) => {
        // Clicks on the <dialog> element itself (not its content) are backdrop clicks.
        if (event.target === event.currentTarget) ref.current?.close();
      }}
      onKeyDown={(event) => {
        // Keep Tab inside the dialog (browsers may otherwise move focus to their own UI).
        if (event.key !== 'Tab' || !ref.current) return;
        const focusable = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
          (element) => element.getClientRects().length > 0,
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
    >
      <div className="flex h-full max-h-[inherit] flex-col">
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <h2 id={titleId} className={cn('font-heading text-xl font-bold text-text', titleHidden && 'sr-only')}>
            {title}
          </h2>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label={t('close')}
            className="-me-2 ms-auto inline-flex size-11 shrink-0 items-center justify-center rounded-button text-text transition-colors duration-150 hover:bg-background"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
        {description ? (
          <p id={descriptionId} className="px-6 pt-4 text-muted">
            {description}
          </p>
        ) : null}
        <div className="overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </dialog>
  );
}

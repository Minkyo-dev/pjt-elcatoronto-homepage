'use client';

import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {useState} from 'react';
import {Button} from '@/components/ui/Button';
import {Dialog} from '@/components/ui/Dialog';
import {ImageFrame} from '@/components/ui/ImageFrame';
import {useRevealFocus} from '@/lib/hooks/useRevealFocus';
import {Link} from '@/lib/i18n/navigation';
import {cidAttrs, itemCid} from '@/lib/utils/cid';
import type {ImageView} from '@/types/common';

export type GalleryItem = {key: string; image: ImageView; caption: string; href?: string};

type GalleryProps = {items: GalleryItem[]; label: string; pageSize?: number; cid?: string};

export function Gallery({items, label, pageSize = 6, cid}: GalleryProps) {
  const t = useTranslations('Events');
  const tCommon = useTranslations('Common');
  const [visible, setVisible] = useState(pageSize);
  const {listRef, reveal} = useRevealFocus<HTMLUListElement>(visible);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const current = openIndex === null ? null : items[openIndex];

  return (
    <>
      <ul ref={listRef} aria-label={label} className="grid grid-cols-2 gap-4 sm:grid-cols-3" {...cidAttrs(cid, 'Gallery')}>
        {items.slice(0, visible).map((item, index) => (
          <li key={item.key} {...cidAttrs(itemCid(cid, 'a'), 'GalleryPhoto')}>
            <button
              type="button"
              aria-haspopup="dialog"
              aria-label={t('openPhoto', {alt: item.image.alt})}
              onClick={() => setOpenIndex(index)}
              className="block w-full overflow-hidden rounded-card"
            >
              <ImageFrame as="span" image={item.image} ratio="1/1" sizes="(min-width: 640px) 33vw, 50vw" rounded={false} />
            </button>
          </li>
        ))}
      </ul>
      {visible < items.length ? (
        <div className="mt-8 flex justify-center">
          <Button variant="secondary" cid={itemCid(cid, 'b')} onClick={() => {
              reveal(visible);
              setVisible((count) => count + pageSize);
            }}>
            {tCommon('loadMore')}
          </Button>
        </div>
      ) : null}
      <Dialog open={current !== null} onClose={() => setOpenIndex(null)} title={current?.caption ?? ''} variant="lightbox" cid={itemCid(cid, 'c')}>
        {current ? (
          <figure className="flex flex-col gap-3">
            <Image
              src={current.image.url}
              alt={current.image.alt}
              width={current.image.width}
              height={current.image.height}
              sizes="(min-width: 1024px) 64rem, 100vw"
              className="h-auto w-full rounded-card"
            />
            <figcaption className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
              <span>
                {current.image.alt}
                {current.image.credit ? ` · ${current.image.credit}` : ''}
              </span>
              {current.href ? (
                <Link href={current.href} className="font-semibold text-primary underline-offset-4 hover:underline">
                  {t('viewEvent')}
                </Link>
              ) : null}
            </figcaption>
          </figure>
        ) : null}
      </Dialog>
    </>
  );
}

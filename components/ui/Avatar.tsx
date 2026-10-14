import Image from 'next/image';
import {avatarTone, getInitials} from '@/lib/utils/avatar';
import {cn} from '@/lib/utils/cn';
import type {ImageView} from '@/types/common';

const SIZES = {md: 'size-12 text-base', lg: 'size-16 text-xl'} as const;

/** Decorative: the person's name is always rendered as text next to it. */
export function Avatar({name, seed, size = 'md', photo}: {name: string; seed?: string; size?: keyof typeof SIZES; photo?: ImageView}) {
  if (photo) {
    return (
      <span className={cn('relative inline-block shrink-0 overflow-hidden rounded-full', SIZES[size])}>
        <Image src={photo.url} alt="" fill sizes="4rem" className="object-cover" />
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-heading font-bold text-on-primary',
        avatarTone(seed ?? name),
        SIZES[size],
      )}
    >
      {getInitials(name)}
    </span>
  );
}

import Image from 'next/image';
import {cn} from '@/lib/utils/cn';
import type {ImageView} from '@/types/common';

const RATIOS = {
  '3/2': 'aspect-3/2',
  '16/9': 'aspect-video',
  '1/1': 'aspect-square',
  '4/3': 'aspect-4/3',
} as const;

type ImageFrameProps = {
  image: ImageView;
  ratio?: keyof typeof RATIOS;
  sizes: string;
  /** Load immediately with high priority (above-the-fold images only). */
  eager?: boolean;
  rounded?: boolean;
  className?: string;
  /** Wrapper element; use 'span' inside phrasing-only parents such as <button>. */
  as?: 'div' | 'span';
};

/** Fixed aspect-ratio box so images never shift layout. */
export function ImageFrame({image, ratio = '3/2', sizes, eager, rounded = true, className, as = 'div'}: ImageFrameProps) {
  const Wrapper = as;
  return (
    <Wrapper className={cn(as === 'span' && 'block', 'relative overflow-hidden bg-border', RATIOS[ratio], rounded && 'rounded-card', className)}>
      <Image
        src={image.url}
        alt={image.alt}
        fill
        sizes={sizes}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
        className="object-cover"
      />
    </Wrapper>
  );
}

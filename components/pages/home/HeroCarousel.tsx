'use client';

import {ChevronLeft, ChevronRight, Pause, Play} from 'lucide-react';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';
import {Container} from '@/components/layout/Container';
import {Button} from '@/components/ui/Button';
import {FlagBadges} from '@/components/ui/FlagBadges';
import {usePrefersReducedMotion} from '@/lib/hooks/usePrefersReducedMotion';
import {cidAttrs, itemCid, subCid} from '@/lib/utils/cid';
import {cn} from '@/lib/utils/cn';
import type {HeroSlideView} from '@/types/pages';

const INTERVAL_MS = 7000;
const controlClass =
  'inline-flex size-11 items-center justify-center rounded-full border border-on-primary/60 text-on-primary transition-colors duration-150 hover:bg-on-primary hover:text-primary';

export function HeroCarousel({slides, cid}: {slides: HeroSlideView[]; cid?: string}) {
  const t = useTranslations('Carousel');
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const autoplay = playing && !paused && !reducedMotion && slides.length > 1;

  useEffect(() => {
    if (!autoplay) return;
    const timer = window.setTimeout(() => setIndex((current) => (current + 1) % slides.length), INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [autoplay, index, slides.length]);

  const goTo = (next: number) => setIndex((next + slides.length) % slides.length);

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t('label')}
      data-autoplay={autoplay}
      className="on-dark relative isolate overflow-hidden bg-primary text-on-primary"
      {...cidAttrs(cid, 'HeroCarousel')}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <div aria-live={autoplay ? 'off' : 'polite'} {...cidAttrs(subCid(cid, 1), 'Slides')}>
        {slides.map((slide, slideIndex) => (
          <div
            key={slide.key}
            role="group"
            aria-roledescription="slide"
            aria-label={t('slideLabel', {index: slideIndex + 1, total: slides.length})}
            hidden={slideIndex !== index}
            className="relative"
            {...cidAttrs(itemCid(subCid(cid, 1)), 'Slide')}
          >
            <Image
              src={slide.media.image.url}
              alt=""
              fill
              sizes="100vw"
              loading={slideIndex === 0 ? 'eager' : 'lazy'}
              fetchPriority={slideIndex === 0 ? 'high' : undefined}
              className="-z-10 object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-overlay" />
            <Container className="flex min-h-[32rem] flex-col justify-end gap-5 pb-28 pt-20 lg:min-h-[38rem]">
              <div className="flex flex-wrap items-center gap-3">
                {slide.eyebrow ? (
                  <p className="text-eyebrow font-semibold uppercase" {...cidAttrs(subCid(cid, 2), 'SlideEyebrow')}>
                    {slide.eyebrow}
                  </p>
                ) : null}
                <FlagBadges flags={slide} cid={subCid(cid, 3)} />
              </div>
              <h2 className="max-w-heading font-heading text-display font-extrabold text-balance" {...cidAttrs(subCid(cid, 4), 'SlideTitle')}>
                {slide.title}
              </h2>
              <p className="max-w-body text-lg" {...cidAttrs(subCid(cid, 5), 'SlideBody')}>
                {slide.body}
              </p>
              <div className="flex flex-wrap gap-3" {...cidAttrs(subCid(cid, 6), 'SlideCTAs')}>
                {slide.ctas.map((cta, ctaIndex) => (
                  <Button key={cta.href} href={cta.href} size="lg" variant={ctaIndex === 0 ? 'inverse' : 'on-dark'}>
                    {cta.label}
                  </Button>
                ))}
              </div>
            </Container>
          </div>
        ))}
      </div>

      <Container className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-2 pb-8">
        <button type="button" onClick={() => goTo(index - 1)} aria-label={t('previous')} className={controlClass} {...cidAttrs(subCid(cid, 7), 'PrevButton')}>
          <ChevronLeft aria-hidden="true" className="size-5" />
        </button>
        <button type="button" onClick={() => goTo(index + 1)} aria-label={t('next')} className={controlClass} {...cidAttrs(subCid(cid, 8), 'NextButton')}>
          <ChevronRight aria-hidden="true" className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => setPlaying((current) => !current)}
          aria-label={playing ? t('pause') : t('play')}
          className={controlClass}
          {...cidAttrs(subCid(cid, 9), 'PlayPauseButton')}
        >
          {playing ? <Pause aria-hidden="true" className="size-5" /> : <Play aria-hidden="true" className="size-5" />}
        </button>
        <div className="ms-2 flex" {...cidAttrs(subCid(cid, 10), 'SlideIndicators')}>
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.key}
              type="button"
              onClick={() => goTo(slideIndex)}
              aria-label={t('goTo', {index: slideIndex + 1})}
              aria-current={slideIndex === index ? 'true' : undefined}
              className="group inline-flex size-11 items-center justify-center"
              {...cidAttrs(itemCid(subCid(cid, 10)), 'SlideIndicator')}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'h-2.5 rounded-full transition-all duration-200',
                  slideIndex === index ? 'w-8 bg-on-primary' : 'w-2.5 bg-on-primary-muted group-hover:bg-on-primary',
                )}
              />
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}

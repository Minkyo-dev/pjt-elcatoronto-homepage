import Image from 'next/image';
import {Container} from '@/components/layout/Container';
import {Button} from '@/components/ui/Button';
import {cn} from '@/lib/utils/cn';
import type {CtaView, PageHeroView} from '@/types/common';

type HeroProps = {hero: PageHeroView; variant?: 'typography' | 'photo'};

function HeroBody({hero, dark}: {hero: PageHeroView; dark: boolean}) {
  const ctas = [hero.cta, hero.secondaryCta].filter((cta): cta is CtaView => Boolean(cta));
  return (
    <>
      {hero.eyebrow ? (
        <p className={cn('text-eyebrow font-semibold uppercase', dark ? 'text-on-primary' : 'text-secondary')}>{hero.eyebrow}</p>
      ) : null}
      <h1 id="page-title" className={cn('max-w-heading font-heading text-display font-extrabold text-balance', dark ? 'text-on-primary' : 'text-text')}>
        {hero.title}
      </h1>
      <p className={cn('max-w-body text-lg', dark ? 'text-on-primary' : 'text-muted')}>{hero.body}</p>
      {ctas.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {ctas.map((cta, index) => (
            <Button
              key={cta.href}
              href={cta.href}
              size="lg"
              variant={index === 0 ? (dark ? 'inverse' : 'primary') : dark ? 'on-dark' : 'secondary'}
            >
              {cta.label}
            </Button>
          ))}
        </div>
      ) : null}
    </>
  );
}

/** Typography hero (default) or full-width photo hero with a dark overlay. Owns the page's only h1. */
export function Hero({hero, variant = 'typography'}: HeroProps) {
  if (variant === 'photo' && hero.image) {
    return (
      <section aria-labelledby="page-title" className="on-dark relative isolate overflow-hidden bg-primary">
        {/* Decorative background; the overlay keeps white text at ≥ 6:1 even over a white photo. */}
        <Image src={hero.image.url} alt="" fill sizes="100vw" loading="eager" fetchPriority="high" className="-z-10 object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-overlay" />
        <Container className="flex min-h-[28rem] flex-col items-start justify-end gap-6 py-16 lg:min-h-[34rem] lg:py-24">
          <HeroBody hero={hero} dark />
        </Container>
      </section>
    );
  }
  return (
    <section aria-labelledby="page-title" className="border-b border-border bg-background">
      <Container className="flex flex-col items-start gap-6 py-16 lg:py-24">
        <HeroBody hero={hero} dark={false} />
      </Container>
    </section>
  );
}

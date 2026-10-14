import {Container} from '@/components/layout/Container';
import {FlagBadges} from '@/components/ui/FlagBadges';
import type {Sponsor} from '@/types/misc';

export function SponsorBar({title, sponsors}: {title: string; sponsors: Sponsor[]}) {
  return (
    <section aria-labelledby="sponsors-title" className="border-b border-border bg-surface py-10">
      <Container className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-3 lg:w-48 lg:shrink-0">
          <h2 id="sponsors-title" className="text-sm font-semibold uppercase tracking-wide text-muted">
            {title}
          </h2>
          <FlagBadges flags={{isSample: sponsors.some((sponsor) => sponsor.isSample)}} />
        </div>
        <ul className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {sponsors.map((sponsor) => (
            <li
              key={sponsor._id}
              className="flex min-h-14 items-center justify-center rounded-card border border-border px-3 text-center font-heading text-sm font-bold text-muted"
            >
              {sponsor.name}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

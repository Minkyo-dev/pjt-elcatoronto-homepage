import {Icon} from '@/components/ui/Icon';
import {cn} from '@/lib/utils/cn';
import type {CardView} from '@/types/common';

const COLUMNS = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
} as const;

export function CardGrid({cards, columns = 3, className}: {cards: CardView[]; columns?: keyof typeof COLUMNS; className?: string}) {
  return (
    <ul className={cn('grid gap-6', COLUMNS[columns], className)}>
      {cards.map((card) => (
        <li key={card.title} className="flex flex-col gap-3 rounded-card border border-border bg-surface p-6">
          {card.icon ? (
            <span className="inline-flex size-12 items-center justify-center rounded-card bg-background text-secondary">
              <Icon name={card.icon} />
            </span>
          ) : null}
          <h3 className="font-heading text-h3 font-bold text-text">{card.title}</h3>
          <p className="text-muted">{card.body}</p>
        </li>
      ))}
    </ul>
  );
}

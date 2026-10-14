import {Button, type ButtonVariant} from '@/components/ui/Button';
import {Icon} from '@/components/ui/Icon';
import {cn} from '@/lib/utils/cn';
import type {GetInvolvedCardView} from '@/types/pages';

const TONES: Record<GetInvolvedCardView['tone'], {bar: string; icon: string; button: ButtonVariant}> = {
  primary: {bar: 'bg-primary', icon: 'text-primary', button: 'primary'},
  secondary: {bar: 'bg-secondary', icon: 'text-secondary', button: 'secondary'},
  accent: {bar: 'bg-accent', icon: 'text-accent-strong', button: 'accent'},
};

export function GetInvolvedCards({cards}: {cards: GetInvolvedCardView[]}) {
  return (
    <ul className="grid gap-6 lg:grid-cols-3">
      {cards.map((card) => {
        const tone = TONES[card.tone];
        return (
          <li key={card.title} className="flex flex-col gap-4 overflow-hidden rounded-card border border-border bg-surface px-6 pb-6">
            <span aria-hidden="true" className={cn('-mx-6 mb-2 h-1', tone.bar)} />
            {card.icon ? <Icon name={card.icon} className={cn('size-8', tone.icon)} /> : null}
            <h3 className="font-heading text-h3 font-bold text-text">{card.title}</h3>
            <p className="text-muted">{card.body}</p>
            <Button href={card.cta.href} variant={tone.button} className="mt-auto self-start">
              {card.cta.label}
            </Button>
          </li>
        );
      })}
    </ul>
  );
}

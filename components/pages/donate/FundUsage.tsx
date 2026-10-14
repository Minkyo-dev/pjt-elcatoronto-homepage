import {FlagBadges} from '@/components/ui/FlagBadges';
import type {Flags} from '@/types/common';

export function FundUsage({items, flags}: {items: {label: string; percent: number}[]; flags: Flags}) {
  return (
    <div className="flex max-w-heading flex-col gap-6">
      <ul className="flex flex-col gap-5">
        {items.map((item) => (
          <li key={item.label} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-semibold text-text">{item.label}</span>
              <span className="font-heading text-lg font-bold text-primary">{item.percent}%</span>
            </div>
            <div aria-hidden="true" className="h-2.5 overflow-hidden rounded-full bg-border">
              {/* Width is data, not a design token. */}
              <div className="h-full rounded-full bg-secondary" style={{width: `${item.percent}%`}} />
            </div>
          </li>
        ))}
      </ul>
      <FlagBadges flags={flags} />
    </div>
  );
}

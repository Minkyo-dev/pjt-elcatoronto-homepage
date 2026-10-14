import {FlagBadges} from '@/components/ui/FlagBadges';
import type {Stat} from '@/types/misc';

export function StatGrid({stats}: {stats: Stat[]}) {
  return (
    <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat._id} className="flex flex-col gap-2 rounded-card border border-border bg-surface p-6">
          <dt className="order-2 text-sm font-medium text-muted">{stat.label}</dt>
          <dd className="order-1 font-heading text-h2 font-extrabold text-primary">{stat.value}</dd>
          {stat.description ? <dd className="order-3 text-sm text-muted">{stat.description}</dd> : null}
          {stat.isSample || stat.needsReview ? (
            <dd className="order-4">
              <FlagBadges flags={stat} />
            </dd>
          ) : null}
        </div>
      ))}
    </dl>
  );
}

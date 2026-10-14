import {FlagBadges} from '@/components/ui/FlagBadges';
import type {HistoryEntry} from '@/types/misc';

export function HistoryTimeline({entries}: {entries: HistoryEntry[]}) {
  return (
    <ol className="flex flex-col gap-8 border-s-2 border-border ps-8">
      {entries.map((entry) => (
        <li key={entry._id} className="relative">
          {/* Dot centred on the 2px rail: -(2rem padding + 0.125rem rail) - 0.3125rem */}
          <span aria-hidden="true" className="absolute -start-[2.4375rem] top-2 size-3 rounded-full bg-secondary ring-4 ring-background" />
          <p className="font-heading text-lg font-extrabold text-secondary">{entry.year}</p>
          <h3 className="font-heading text-h3 font-bold text-text">{entry.title}</h3>
          {entry.body ? <p className="mt-1 max-w-body text-muted">{entry.body}</p> : null}
          <FlagBadges flags={entry} className="mt-2" />
        </li>
      ))}
    </ol>
  );
}

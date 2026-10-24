import {FlagBadges} from '@/components/ui/FlagBadges';
import {cidAttrs, itemCid, subCid} from '@/lib/utils/cid';
import type {Flags} from '@/types/common';

type FundUsageProps = {
  items: {label: string; percent: number}[];
  flags: Flags;
  /** Section cid of the host section; its SectionHeading is component 01, so this labels 02 (list) and 03 (flags). */
  cid?: string;
};

export function FundUsage({items, flags, cid}: FundUsageProps) {
  const listCid = subCid(cid, 2);
  return (
    <div className="flex max-w-heading flex-col gap-6">
      <ul className="flex flex-col gap-5" {...cidAttrs(listCid, 'FundUsageList')}>
        {items.map((item) => (
          <li key={item.label} className="flex flex-col gap-2" {...cidAttrs(itemCid(listCid), 'FundUsageItem')}>
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
      <FlagBadges flags={flags} cid={subCid(cid, 3)} />
    </div>
  );
}

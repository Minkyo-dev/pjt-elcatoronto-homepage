'use client';

import {useState} from 'react';
import {Scroller} from '@/components/ui/Scroller';
import {cidAttrs, itemCid} from '@/lib/utils/cid';
import type {Mentor} from '@/types/mentor';
import {MentorCard} from './MentorCard';
import {MentorProfileDialog} from './MentorProfileDialog';

type MentorShowcaseProps = {
  mentors: Mentor[];
  layout: 'grid' | 'carousel';
  label: string;
  cid?: string;
  /** Component ID of the profile dialog, which opens outside the section. */
  dialogCid?: string;
};

/** Mentor cards (4/2/1 grid or a horizontal carousel) plus the shared profile dialog. */
export function MentorShowcase({mentors, layout, label, cid, dialogCid}: MentorShowcaseProps) {
  const [selected, setSelected] = useState<Mentor | null>(null);
  const cards = mentors.map((mentor) => ({
    key: mentor.slug,
    node: <MentorCard mentor={mentor} onViewProfile={setSelected} cid={itemCid(cid)} />,
  }));

  return (
    <>
      {layout === 'carousel' ? (
        <Scroller label={label} items={cards} itemClassName="w-[85%] sm:w-[45%] lg:w-[calc((100%-4.5rem)/4)]" cid={cid} />
      ) : (
        <ul aria-label={label} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" {...cidAttrs(cid, 'MentorGrid')}>
          {cards.map((card) => (
            <li key={card.key}>{card.node}</li>
          ))}
        </ul>
      )}
      <MentorProfileDialog mentor={selected} onClose={() => setSelected(null)} cid={dialogCid} />
    </>
  );
}

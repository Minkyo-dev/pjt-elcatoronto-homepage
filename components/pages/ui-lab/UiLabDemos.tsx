'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/Button';
import {Dialog} from '@/components/ui/Dialog';
import {Scroller} from '@/components/ui/Scroller';
import {Tabs} from '@/components/ui/Tabs';

const TAB_ITEMS = [
  {id: 'first', label: 'First'},
  {id: 'second', label: 'Second'},
  {id: 'third', label: 'Third'},
];

// Dev-only demos for the UI Lab page.
export function UiLabDemos() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('first');

  return (
    <div className="flex flex-col gap-12">
      <div>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <Dialog open={open} onClose={() => setOpen(false)} title="Demo dialog" description="Press Escape to close.">
          <label className="flex flex-col gap-2">
            Your name
            <input className="rounded-button border border-border-strong px-3 py-2" />
          </label>
        </Dialog>
      </div>

      <Tabs label="Demo tabs" items={TAB_ITEMS} value={tab} onValueChange={setTab}>
        <p>{TAB_ITEMS.find((item) => item.id === tab)?.label} panel</p>
      </Tabs>

      <Scroller
        label="Scroller demo"
        items={Array.from({length: 6}, (_, i) => ({
          key: `card-${i}`,
          node: <div className="flex h-32 items-center justify-center rounded-card border border-border bg-surface">Card {i + 1}</div>,
        }))}
      />
    </div>
  );
}

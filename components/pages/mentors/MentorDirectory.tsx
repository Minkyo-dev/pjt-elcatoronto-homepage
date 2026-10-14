'use client';

import {Search, SearchX} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useDeferredValue, useId, useMemo, useRef, useState} from 'react';
import {MentorShowcase} from '@/components/sections/MentorShowcase';
import {Button} from '@/components/ui/Button';
import {EmptyState} from '@/components/ui/EmptyState';
import {Input} from '@/components/ui/Input';
import {useRevealFocus} from '@/lib/hooks/useRevealFocus';
import {filterMentors} from '@/lib/content/helpers/mentors';
import type {Mentor} from '@/types/mentor';

const PAGE_SIZE = 12;

export function MentorDirectory({mentors, label}: {mentors: Mentor[]; label: string}) {
  const t = useTranslations('Mentors');
  const tCommon = useTranslations('Common');
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const {listRef, reveal} = useRevealFocus<HTMLDivElement>(visibleCount);
  const deferredQuery = useDeferredValue(query);
  const results = useMemo(() => filterMentors(mentors, deferredQuery), [mentors, deferredQuery]);

  function updateQuery(value: string) {
    setQuery(value);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:max-w-md">
        <label htmlFor={`${id}-search`} className="text-sm font-semibold text-text">
          {t('searchLabel')}
        </label>
        <div className="relative">
          <Search aria-hidden="true" className="pointer-events-none absolute start-3 top-1/2 size-5 -translate-y-1/2 text-muted" />
          <Input
            ref={inputRef}
            id={`${id}-search`}
            type="search"
            autoComplete="off"
            value={query}
            placeholder={t('searchPlaceholder')}
            onChange={(event) => updateQuery(event.target.value)}
            className="ps-10"
          />
        </div>
      </div>

      <p role="status" className="text-sm font-medium text-muted">
        {t('resultCount', {count: results.length})}
      </p>

      {results.length === 0 ? (
        <EmptyState
          icon={<SearchX aria-hidden="true" className="size-8 text-muted" />}
          title={t('emptyTitle')}
          body={t('emptyBody')}
          action={
            <Button
              variant="secondary"
              onClick={() => {
                updateQuery('');
                inputRef.current?.focus();
              }}
            >
              {t('clearSearch')}
            </Button>
          }
        />
      ) : (
        <div ref={listRef}>
          <MentorShowcase mentors={results.slice(0, visibleCount)} layout="grid" label={label} />
        </div>
      )}

      {visibleCount < results.length ? (
        <Button variant="secondary" className="self-center" onClick={() => {
            reveal(visibleCount);
            setVisibleCount((count) => count + PAGE_SIZE);
          }}
        >
          {tCommon('loadMore')}
        </Button>
      ) : null}
    </div>
  );
}

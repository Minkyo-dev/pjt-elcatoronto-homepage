'use client';

import {Download, FileText} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useState} from 'react';
import {Button} from '@/components/ui/Button';
import {EmptyState} from '@/components/ui/EmptyState';
import {FlagBadges} from '@/components/ui/FlagBadges';
import {Tabs} from '@/components/ui/Tabs';
import {cidAttrs, itemCid, subCid} from '@/lib/utils/cid';
import type {Report, ReportKind} from '@/types/misc';

/** `cid` is the enclosing section's ID; the tabs and the report list are labelled as its components. */
export function ReportsTabs({reports, cid}: {reports: Report[]; cid?: string}) {
  const t = useTranslations('Reports');
  const [kind, setKind] = useState<ReportKind>('financial');
  const visible = reports.filter((report) => report.kind === kind);

  return (
    <Tabs
      label={t('tabsLabel')}
      items={[
        {id: 'financial', label: t('financial')},
        {id: 'annual', label: t('annual')},
      ]}
      value={kind}
      onValueChange={(id) => setKind(id as ReportKind)}
      cid={subCid(cid, 1)}
    >
      {visible.length === 0 ? (
        <EmptyState title={t('emptyTitle')} cid={subCid(cid, 2)} />
      ) : (
        <ul className="flex flex-col gap-4" {...cidAttrs(subCid(cid, 2), 'ReportList')}>
          {visible.map((report) => (
            <li
              key={report._id}
              className="flex flex-col gap-4 rounded-card border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between"
              {...cidAttrs(itemCid(subCid(cid, 2)), 'ReportRow')}
            >
              <div className="flex items-start gap-4">
                <span className="font-heading text-h3 font-extrabold text-secondary">{report.year}</span>
                <div>
                  <h3 className="font-heading text-lg font-bold text-text">{report.title}</h3>
                  {report.summary ? <p className="text-muted">{report.summary}</p> : null}
                  <FlagBadges flags={report} className="mt-2" />
                </div>
              </div>
              {report.file ? (
                <Button href={report.file.url} variant="secondary" icon={<Download aria-hidden="true" className="size-4" />}>
                  {t('download')}
                </Button>
              ) : (
                <Button variant="secondary" disabled icon={<FileText aria-hidden="true" className="size-4" />}>
                  {t('unavailable')}
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </Tabs>
  );
}

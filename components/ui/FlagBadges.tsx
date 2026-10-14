import {useTranslations} from 'next-intl';
import {cn} from '@/lib/utils/cn';
import type {Flags} from '@/types/common';
import {Badge} from './Badge';

export function FlagBadges({flags, className}: {flags: Flags; className?: string}) {
  const t = useTranslations('Common');
  if (!flags.isSample && !flags.needsReview) return null;
  return (
    <span className={cn('inline-flex flex-wrap gap-1.5', className)}>
      {flags.isSample ? <Badge variant="sample">{t('sample')}</Badge> : null}
      {flags.needsReview ? <Badge variant="review">{t('needsReview')}</Badge> : null}
    </span>
  );
}

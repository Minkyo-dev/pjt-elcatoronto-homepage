import {CircleAlert} from 'lucide-react';
import {useTranslations} from 'next-intl';
import type {DemoFormStatus} from '@/lib/forms/useDemoForm';
import {cn} from '@/lib/utils/cn';
import {Badge} from './Badge';

/** Persistent live region; demo success never looks like a real success (no green check). */
export function FormFeedback({status, demoMessage, tone = 'default'}: {status: DemoFormStatus; demoMessage: string; tone?: 'default' | 'dark'}) {
  const t = useTranslations('Forms');
  const tCommon = useTranslations('Common');
  return (
    <div aria-live="polite" aria-atomic="true">
      {status === 'invalid' ? (
        <p className={cn('flex items-center gap-2 text-sm font-medium', tone === 'dark' ? 'text-danger-on-dark' : 'text-danger')}>
          <CircleAlert aria-hidden="true" className="size-4 shrink-0" />
          {t('errorSummary')}
        </p>
      ) : null}
      {status === 'demo' ? (
        <p
          className={cn(
            'flex flex-wrap items-center gap-2 rounded-card border px-3 py-2 text-sm',
            tone === 'dark' ? 'border-on-primary/30 text-on-primary' : 'border-border-strong bg-background text-text',
          )}
        >
          <Badge variant="demo">{tCommon('demo')}</Badge>
          {demoMessage}
        </p>
      ) : null}
    </div>
  );
}

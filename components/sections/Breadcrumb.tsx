import {ChevronRight} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {Link} from '@/lib/i18n/navigation';

export function Breadcrumb({items, current}: {items: {label: string; href: string}[]; current: string}) {
  const t = useTranslations('Common');
  return (
    <nav aria-label={t('breadcrumb')}>
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
        {items.map((item) => (
          <li key={item.href} className="flex items-center gap-2">
            <Link href={item.href} className="inline-flex min-h-11 items-center font-medium text-primary underline-offset-4 hover:underline">
              {item.label}
            </Link>
            <ChevronRight aria-hidden="true" className="size-4" />
          </li>
        ))}
        <li aria-current="page" className="min-w-0 break-words">
          {current}
        </li>
      </ol>
    </nav>
  );
}

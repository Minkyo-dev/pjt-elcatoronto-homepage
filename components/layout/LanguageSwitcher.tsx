'use client';

import {useLocale, useTranslations} from 'next-intl';
import {Fragment, type MouseEvent} from 'react';
import {Link, usePathname, useRouter} from '@/lib/i18n/navigation';
import {routing, type Locale} from '@/lib/i18n/routing';
import {cidAttrs} from '@/lib/utils/cid';
import {cn} from '@/lib/utils/cn';

const SHORT_LABEL: Record<Locale, string> = {en: 'EN', ko: 'KO'};

type LanguageSwitcherProps = {className?: string; onNavigate?: () => void; cid?: string};

export function LanguageSwitcher({className, onNavigate, cid}: LanguageSwitcherProps) {
  const t = useTranslations('Nav');
  const current = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function keepQuery(event: MouseEvent<HTMLAnchorElement>, locale: Locale) {
    onNavigate?.();
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const params = new URLSearchParams(window.location.search);
    if (!params.size) return; // the Link already points at the right path
    event.preventDefault();
    const query: Record<string, string | string[]> = {};
    for (const key of new Set(params.keys())) {
      const values = params.getAll(key);
      query[key] = values.length > 1 ? values : values[0];
    }
    router.replace({pathname, query}, {locale});
  }

  return (
    <div
      role="group"
      aria-label={t('languageLabel')}
      className={cn('flex items-center gap-1 text-sm font-semibold', className)}
      {...cidAttrs(cid, 'LanguageSwitcher')}
    >
      {routing.locales.map((locale, index) => (
        <Fragment key={locale}>
          {index > 0 ? (
            <span aria-hidden="true" className="text-border-strong">
              |
            </span>
          ) : null}
          <Link
            href={pathname}
            locale={locale}
            lang={locale}
            hrefLang={locale}
            aria-current={locale === current ? 'true' : undefined}
            onClick={(event) => keepQuery(event, locale)}
            className="inline-flex min-h-11 items-center rounded-button px-2 text-muted transition-colors duration-150 hover:text-text aria-[current=true]:text-text aria-[current=true]:underline aria-[current=true]:decoration-2 aria-[current=true]:underline-offset-4"
          >
            {SHORT_LABEL[locale]}
            <span className="sr-only"> — {t(locale === 'en' ? 'langEn' : 'langKo')}</span>
          </Link>
        </Fragment>
      ))}
    </div>
  );
}

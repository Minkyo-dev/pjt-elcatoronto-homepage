import {useTranslations} from 'next-intl';
import {Section} from '@/components/layout/Section';
import {Link} from '@/lib/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('NotFound');
  return (
    <Section>
      <div className="flex max-w-body flex-col gap-4">
        <h1 className="font-heading text-display font-extrabold text-text">{t('title')}</h1>
        <p className="text-lg text-muted">{t('body')}</p>
        <p>
          <Link href="/" className="font-semibold text-secondary underline underline-offset-4">
            {t('backHome')}
          </Link>
        </p>
      </div>
    </Section>
  );
}

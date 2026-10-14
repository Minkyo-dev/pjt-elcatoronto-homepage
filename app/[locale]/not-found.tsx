import {useTranslations} from 'next-intl';
import {Section} from '@/components/layout/Section';
import {Button} from '@/components/ui/Button';

export default function NotFound() {
  const t = useTranslations('NotFound');
  return (
    <Section>
      <div className="flex max-w-body flex-col items-start gap-4">
        <h1 className="font-heading text-display font-extrabold text-text">{t('title')}</h1>
        <p className="text-lg text-muted">{t('body')}</p>
        <Button href="/">{t('backHome')}</Button>
      </div>
    </Section>
  );
}

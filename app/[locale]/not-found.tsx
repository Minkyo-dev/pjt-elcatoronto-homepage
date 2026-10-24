import {useTranslations} from 'next-intl';
import {Section} from '@/components/layout/Section';
import {Button} from '@/components/ui/Button';
import {cidAttrs} from '@/lib/utils/cid';

export default function NotFound() {
  const t = useTranslations('NotFound');
  return (
    <Section cid="ERR-01">
      <div className="flex max-w-body flex-col items-start gap-4">
        <h1 className="font-heading text-display font-extrabold text-text" {...cidAttrs('ERR-01-01', 'NotFoundTitle')}>
          {t('title')}
        </h1>
        <p className="text-lg text-muted" {...cidAttrs('ERR-01-02', 'NotFoundBody')}>
          {t('body')}
        </p>
        <Button href="/" cid="ERR-01-03">{t('backHome')}</Button>
      </div>
    </Section>
  );
}

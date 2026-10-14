import {getTranslations} from 'next-intl/server';
import {Section} from '@/components/layout/Section';

export default async function HomePage() {
  const t = await getTranslations('Metadata');
  return (
    <Section>
      <h1 className="max-w-heading font-heading text-display font-extrabold text-text">{t('siteName')}</h1>
    </Section>
  );
}

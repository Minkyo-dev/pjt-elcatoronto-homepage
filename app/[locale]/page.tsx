import {getTranslations} from 'next-intl/server';

export default async function HomePage() {
  const t = await getTranslations('Metadata');
  return (
    <main id="main">
      <h1>{t('siteName')}</h1>
    </main>
  );
}

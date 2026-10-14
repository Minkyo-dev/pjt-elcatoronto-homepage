import {NextIntlClientProvider, hasLocale} from 'next-intl';
import type {Metadata, Viewport} from 'next';
import {getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {FloatingActions} from '@/components/layout/FloatingActions';
import {HydrationMarker} from '@/components/layout/HydrationMarker';
import {Footer} from '@/components/layout/Footer';
import {Header} from '@/components/layout/Header';
import {OverlayProvider} from '@/components/layout/OverlayProvider';
import {getSiteSettings} from '@/lib/content/site';
import {fontVariables} from '@/lib/fonts';
import {routing} from '@/lib/i18n/routing';
import {siteUrl} from '@/lib/utils/site';
import '../globals.css';

export const viewport: Viewport = {viewportFit: 'cover'};

export async function generateMetadata({params}: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({locale, namespace: 'Metadata'});
  return {
    metadataBase: new URL(siteUrl()),
    title: {default: t('defaultTitle'), template: t('titleTemplate')},
    description: t('defaultDescription'),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({children, params}: LayoutProps<'/[locale]'>) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const settings = await getSiteSettings(locale);

  return (
    <html lang={locale} className={fontVariables}>
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider>
          <OverlayProvider>
            <Header />
            <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
              {children}
            </main>
            <Footer settings={settings} />
            <FloatingActions />
            <HydrationMarker />
          </OverlayProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

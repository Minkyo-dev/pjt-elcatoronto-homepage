import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {fontVariables} from '@/lib/fonts';
import {routing} from '@/lib/i18n/routing';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({children, params}: LayoutProps<'/[locale]'>) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html lang={locale} className={fontVariables}>
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider>
          <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

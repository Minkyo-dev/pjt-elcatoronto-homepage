import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {Section} from '@/components/layout/Section';
import {ReportsTabs} from '@/components/pages/reports/ReportsTabs';
import {Hero} from '@/components/sections/Hero';
import {getReportsPage} from '@/lib/content/pages';
import {getReports} from '@/lib/content/reports';
import {assertLocale} from '@/lib/i18n/locale';
import {buildPageMetadata} from '@/lib/i18n/metadata';

export async function generateMetadata({params}: PageProps<'/[locale]/about/reports'>): Promise<Metadata> {
  const locale = assertLocale((await params).locale);
  const page = await getReportsPage(locale);
  return buildPageMetadata({locale, path: '/about/reports', title: page.seo.title, description: page.seo.description});
}

export default async function ReportsPage({params}: PageProps<'/[locale]/about/reports'>) {
  const locale = assertLocale((await params).locale);
  const [page, reports, t] = await Promise.all([getReportsPage(locale), getReports(locale), getTranslations('Reports')]);

  return (
    <>
      <Hero hero={page.hero} cid="RPT-01" />
      <Section id="reports-list" labelledBy="reports-list-title" cid="RPT-02">
        <h2 id="reports-list-title" className="sr-only">
          {t('tabsLabel')}
        </h2>
        <ReportsTabs reports={reports} cid="RPT-02" />
      </Section>
    </>
  );
}

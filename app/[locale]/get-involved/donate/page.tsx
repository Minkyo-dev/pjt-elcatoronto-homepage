import type {Metadata} from 'next';
import {getFormatter} from 'next-intl/server';
import {Section} from '@/components/layout/Section';
import {DonationSelector} from '@/components/pages/donate/DonationSelector';
import {FundUsage} from '@/components/pages/donate/FundUsage';
import {CardGrid} from '@/components/sections/CardGrid';
import {FAQSection} from '@/components/sections/FAQSection';
import {Hero} from '@/components/sections/Hero';
import {SectionHeading} from '@/components/sections/SectionHeading';
import {FlagBadges} from '@/components/ui/FlagBadges';
import {getDonationTiers} from '@/lib/content/donation';
import {getFaqs} from '@/lib/content/faq';
import {getDonatePage} from '@/lib/content/pages';
import {assertLocale} from '@/lib/i18n/locale';
import {buildPageMetadata} from '@/lib/i18n/metadata';
import {cidAttrs} from '@/lib/utils/cid';

export async function generateMetadata({params}: PageProps<'/[locale]/get-involved/donate'>): Promise<Metadata> {
  const locale = assertLocale((await params).locale);
  const page = await getDonatePage(locale);
  return buildPageMetadata({
    locale,
    path: '/get-involved/donate',
    title: page.seo.title,
    description: page.seo.description,
    image: page.hero.image,
  });
}

export default async function DonatePage({params}: PageProps<'/[locale]/get-involved/donate'>) {
  const locale = assertLocale((await params).locale);
  const [page, tiers, faqs, format] = await Promise.all([
    getDonatePage(locale),
    getDonationTiers(locale),
    getFaqs(locale, 'donate'),
    getFormatter(),
  ]);

  return (
    <>
      <Hero hero={page.hero} variant="photo" cid="DON-01" />

      <Section id="why-donate" labelledBy="why-title" cid="DON-02">
        <SectionHeading id="why-title" eyebrow={page.why.eyebrow} title={page.why.title} intro={page.why.body} cid="DON-02-01" />
        <FlagBadges flags={page.why} className="mb-6" cid="DON-02-02" />
        <CardGrid cards={page.why.points} columns={3} cid="DON-02-03" />
      </Section>

      <Section id="donation-impact" labelledBy="impact-title" tone="surface" cid="DON-03">
        <SectionHeading id="impact-title" eyebrow={page.impact.eyebrow} title={page.impact.title} intro={page.impact.intro} cid="DON-03-01" />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" {...cidAttrs('DON-03-02', 'ImpactTierList')}>
          {tiers.map((tier) => (
            <li key={tier._id} className="flex flex-col gap-3 rounded-card border border-border bg-background p-6" {...cidAttrs('DON-03-02a', 'ImpactTier')}>
              <p className="font-heading text-h2 font-extrabold text-accent-strong">
                {format.number(tier.amount, {style: 'currency', currency: 'CAD', maximumFractionDigits: 0})}
              </p>
              <p className="text-text">{tier.impact}</p>
              <FlagBadges flags={tier} className="mt-auto" />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="how-funds-are-used" labelledBy="usage-title" cid="DON-04">
        <SectionHeading id="usage-title" eyebrow={page.fundUsage.eyebrow} title={page.fundUsage.title} cid="DON-04-01" />
        <FundUsage items={page.fundUsage.items} flags={page.fundUsage} cid="DON-04" />
      </Section>

      <Section id="donation-options" labelledBy="options-title" tone="surface" cid="DON-05">
        <SectionHeading id="options-title" eyebrow={page.options.eyebrow} title={page.options.title} intro={page.options.intro} cid="DON-05-01" />
        <DonationSelector tiers={tiers} cid="DON-05-02" />
      </Section>

      <FAQSection intro={page.faq} faqs={faqs} cid="DON-06" />
    </>
  );
}

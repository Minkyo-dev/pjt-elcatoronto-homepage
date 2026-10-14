import {Check} from 'lucide-react';
import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {Container} from '@/components/layout/Container';
import {Section} from '@/components/layout/Section';
import {MenteeApply} from '@/components/pages/mentorship/MenteeApply';
import {CardGrid} from '@/components/sections/CardGrid';
import {FAQSection} from '@/components/sections/FAQSection';
import {Hero} from '@/components/sections/Hero';
import {SectionHeading} from '@/components/sections/SectionHeading';
import {StepList} from '@/components/sections/StepList';
import {TestimonialCard} from '@/components/sections/TestimonialCard';
import {Button} from '@/components/ui/Button';
import {FlagBadges} from '@/components/ui/FlagBadges';
import {getFaqs} from '@/lib/content/faq';
import {getMentorshipPage} from '@/lib/content/pages';
import {getTestimonials} from '@/lib/content/testimonials';
import {assertLocale} from '@/lib/i18n/locale';
import {buildPageMetadata} from '@/lib/i18n/metadata';

export async function generateMetadata({params}: PageProps<'/[locale]/get-involved/mentorship'>): Promise<Metadata> {
  const locale = assertLocale((await params).locale);
  const page = await getMentorshipPage(locale);
  return buildPageMetadata({
    locale,
    path: '/get-involved/mentorship',
    title: page.seo.title,
    description: page.seo.description,
    image: page.hero.image,
  });
}

export default async function MentorshipPage({params}: PageProps<'/[locale]/get-involved/mentorship'>) {
  const locale = assertLocale((await params).locale);
  const [page, stories, faqs, t] = await Promise.all([
    getMentorshipPage(locale),
    getTestimonials(locale, {authorType: 'mentee'}),
    getFaqs(locale, 'mentorship'),
    getTranslations('Mentorship'),
  ]);

  return (
    <>
      <Hero hero={page.hero} variant="photo" />

      <Section id="what-we-offer" labelledBy="offer-title">
        <SectionHeading id="offer-title" eyebrow={page.offer.eyebrow} title={page.offer.title} intro={page.offer.summary} />
        <FlagBadges flags={page.offer} className="mb-6" />
        <CardGrid cards={page.offer.benefits} columns={4} />
      </Section>

      <section aria-labelledby="inline-cta-title" className="border-y border-border bg-surface py-10">
        <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="inline-cta-title" className="font-heading text-h3 font-bold text-text">
            {page.inlineCta.title}
          </h2>
          <Button href={page.inlineCta.cta.href} size="lg">
            {page.inlineCta.cta.label}
          </Button>
        </Container>
      </section>

      <Section id="who-can-apply" labelledBy="eligibility-title">
        <SectionHeading id="eligibility-title" eyebrow={page.eligibility.eyebrow} title={page.eligibility.title} />
        <ul className="grid gap-4 sm:grid-cols-2">
          {page.eligibility.items.map((item) => (
            <li key={item} className="flex items-start gap-3 rounded-card border border-border bg-surface p-5">
              <Check aria-hidden="true" className="mt-1 size-5 shrink-0 text-secondary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <FlagBadges flags={page.eligibility} className="mt-4" />
      </Section>

      <Section id="application-phase" labelledBy="process-title" tone="surface">
        <SectionHeading id="process-title" eyebrow={page.process.eyebrow} title={page.process.title} />
        <StepList steps={page.process.steps} />
        <FlagBadges flags={page.process} className="mt-4" />
      </Section>

      <Section id="program-details" labelledBy="details-title">
        <SectionHeading id="details-title" eyebrow={page.details.eyebrow} title={page.details.title} />
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {page.details.items.map((item) => (
            <div key={item.label} className="flex flex-col gap-1 rounded-card border border-border bg-surface p-6">
              <dt className="text-sm font-medium text-muted">{item.label}</dt>
              <dd className="font-heading text-lg font-bold text-text">{item.value}</dd>
            </div>
          ))}
        </dl>
        <FlagBadges flags={page.details} className="mt-4" />
      </Section>

      <Section id="what-youll-achieve" labelledBy="outcomes-title" tone="surface">
        <SectionHeading id="outcomes-title" eyebrow={page.outcomes.eyebrow} title={page.outcomes.title} />
        <CardGrid cards={page.outcomes.items} columns={4} />
      </Section>

      <Section id="success-stories" labelledBy="stories-title">
        <SectionHeading id="stories-title" eyebrow={page.stories.eyebrow} title={page.stories.title} />
        <ul className="grid gap-6 lg:grid-cols-3">
          {stories.slice(0, 3).map((story) => (
            <li key={story._id}>
              <TestimonialCard testimonial={story} />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="apply" labelledBy="apply-title" tone="surface">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionHeading id="apply-title" eyebrow={page.apply.eyebrow} title={page.apply.title} intro={page.apply.body} className="mb-6" />
            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-card border border-border bg-background p-5">
                <dt className="text-sm text-muted">{t('nextCohort')}</dt>
                <dd className="font-semibold">{page.apply.nextCohort}</dd>
              </div>
              <div className="rounded-card border border-border bg-background p-5">
                <dt className="text-sm text-muted">{t('deadline')}</dt>
                <dd className="font-semibold">{page.apply.deadline}</dd>
              </div>
            </dl>
            <FlagBadges flags={page.apply} className="mt-4" />
          </div>
          <div className="lg:col-span-5 lg:justify-self-end">
            <MenteeApply />
          </div>
        </div>
      </Section>

      <FAQSection intro={page.faq} faqs={faqs} />
    </>
  );
}

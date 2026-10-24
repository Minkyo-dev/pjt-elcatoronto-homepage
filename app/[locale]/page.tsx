import type {Metadata} from 'next';
import {Section} from '@/components/layout/Section';
import {HeroCarousel} from '@/components/pages/home/HeroCarousel';
import {CardGrid} from '@/components/sections/CardGrid';
import {ContentCard} from '@/components/sections/ContentCard';
import {FAQSection} from '@/components/sections/FAQSection';
import {GetInvolvedCards} from '@/components/sections/GetInvolvedCards';
import {MentorShowcase} from '@/components/sections/MentorShowcase';
import {SectionHeading} from '@/components/sections/SectionHeading';
import {SponsorBar} from '@/components/sections/SponsorBar';
import {StatGrid} from '@/components/sections/StatGrid';
import {TestimonialScroller} from '@/components/sections/TestimonialScroller';
import {Button} from '@/components/ui/Button';
import {FlagBadges} from '@/components/ui/FlagBadges';
import {getLatestHighlights} from '@/lib/content/content';
import {getCoreValues} from '@/lib/content/core-values';
import {getFaqs} from '@/lib/content/faq';
import {getFeaturedMentors} from '@/lib/content/mentors';
import {getHomePage} from '@/lib/content/pages';
import {getSponsors} from '@/lib/content/sponsors';
import {getStats} from '@/lib/content/stats';
import {getTestimonials} from '@/lib/content/testimonials';
import {assertLocale} from '@/lib/i18n/locale';
import {buildPageMetadata} from '@/lib/i18n/metadata';
import {cidAttrs, itemCid} from '@/lib/utils/cid';

export async function generateMetadata({params}: PageProps<'/[locale]'>): Promise<Metadata> {
  const locale = assertLocale((await params).locale);
  const page = await getHomePage(locale);
  return buildPageMetadata({
    locale,
    path: '/',
    title: page.seo.title,
    description: page.seo.description,
    image: page.heroSlides[0]?.media.image,
  });
}

export default async function HomePage({params}: PageProps<'/[locale]'>) {
  const locale = assertLocale((await params).locale);
  const [page, sponsors, values, stats, mentors, highlights, testimonials, faqs] = await Promise.all([
    getHomePage(locale),
    getSponsors(locale),
    getCoreValues(locale),
    getStats(locale, 'home'),
    getFeaturedMentors(locale),
    getLatestHighlights(locale, 3),
    getTestimonials(locale),
    getFaqs(locale, 'home'),
  ]);

  return (
    <>
      <h1 className="sr-only">{page.seo.title}</h1>
      <HeroCarousel slides={page.heroSlides} cid="HOM-01" />
      <SponsorBar title={page.sponsors.title} sponsors={sponsors} cid="HOM-02" />

      <Section id="purpose" labelledBy="purpose-title" cid="HOM-03">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="flex flex-col items-start gap-5 lg:col-span-5">
            <SectionHeading id="purpose-title" eyebrow={page.purpose.eyebrow} title={page.purpose.title} className="mb-0" cid="HOM-03-01" />
            <p className="text-lg text-muted" {...cidAttrs('HOM-03-02', 'PurposeBody')}>
              {page.purpose.body}
            </p>
            <FlagBadges flags={page.purpose} cid="HOM-03-03" />
            <Button href={page.purpose.cta.href} variant="secondary" cid="HOM-03-04">
              {page.purpose.cta.label}
            </Button>
          </div>
          <CardGrid cards={values} columns={2} className="lg:col-span-7" cid="HOM-03-05" />
        </div>
      </Section>

      <Section id="impact" labelledBy="impact-title" tone="surface" cid="HOM-04">
        <SectionHeading id="impact-title" eyebrow={page.impact.eyebrow} title={page.impact.title} intro={page.impact.intro} cid="HOM-04-01" />
        <StatGrid stats={stats} cid="HOM-04-02" />
      </Section>

      <Section id="mentorship-preview" labelledBy="mentorship-preview-title" cid="HOM-05">
        <SectionHeading
          id="mentorship-preview-title"
          eyebrow={page.mentorshipPreview.eyebrow}
          title={page.mentorshipPreview.title}
          intro={page.mentorshipPreview.intro}
          cid="HOM-05-01"
          action={
            <Button href={page.mentorshipPreview.cta.href} variant="primary" cid="HOM-05-02">
              {page.mentorshipPreview.cta.label}
            </Button>
          }
        />
        <FlagBadges flags={page.mentorshipPreview} className="mb-6" cid="HOM-05-03" />
        <CardGrid cards={page.mentorshipPreview.items} columns={3} cid="HOM-05-04" />
      </Section>

      <Section id="featured-mentors" labelledBy="featured-mentors-title" tone="surface" cid="HOM-06">
        <SectionHeading
          id="featured-mentors-title"
          eyebrow={page.featuredMentors.eyebrow}
          title={page.featuredMentors.title}
          intro={page.featuredMentors.intro}
          cid="HOM-06-01"
          action={
            <Button href={page.featuredMentors.cta.href} variant="secondary" cid="HOM-06-02">
              {page.featuredMentors.cta.label}
            </Button>
          }
        />
        <MentorShowcase mentors={mentors} layout="carousel" label={page.featuredMentors.title} cid="HOM-06-03" dialogCid="HOM-11" />
      </Section>

      <Section id="highlights" labelledBy="highlights-title" cid="HOM-07">
        <SectionHeading
          id="highlights-title"
          eyebrow={page.highlights.eyebrow}
          title={page.highlights.title}
          cid="HOM-07-01"
          action={
            <Button href={page.highlights.cta.href} variant="secondary" cid="HOM-07-02">
              {page.highlights.cta.label}
            </Button>
          }
        />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" {...cidAttrs('HOM-07-03', 'HighlightList')}>
          {highlights.map((item) => (
            <li key={item.slug}>
              <ContentCard item={item} cid={itemCid('HOM-07-03')} />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="testimonials" labelledBy="testimonials-title" tone="surface" cid="HOM-08">
        <SectionHeading id="testimonials-title" eyebrow={page.testimonials.eyebrow} title={page.testimonials.title} cid="HOM-08-01" />
        <TestimonialScroller testimonials={testimonials} label={page.testimonials.title} cid="HOM-08-02" />
      </Section>

      <Section id="get-involved" labelledBy="get-involved-title" cid="HOM-09">
        <SectionHeading id="get-involved-title" eyebrow={page.getInvolved.eyebrow} title={page.getInvolved.title} align="center" cid="HOM-09-01" />
        <GetInvolvedCards cards={page.getInvolved.cards} cid="HOM-09-02" />
      </Section>

      <FAQSection intro={page.faq} faqs={faqs} tone="surface" cid="HOM-10" />
    </>
  );
}

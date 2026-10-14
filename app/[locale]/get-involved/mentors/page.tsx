import type {Metadata} from 'next';
import {Section} from '@/components/layout/Section';
import {MentorDirectory} from '@/components/pages/mentors/MentorDirectory';
import {CTASection} from '@/components/sections/CTASection';
import {Hero} from '@/components/sections/Hero';
import {MentorShowcase} from '@/components/sections/MentorShowcase';
import {SectionHeading} from '@/components/sections/SectionHeading';
import {getFeaturedMentors, getMentors} from '@/lib/content/mentors';
import {getMentorsPage} from '@/lib/content/pages';
import {assertLocale} from '@/lib/i18n/locale';
import {buildPageMetadata} from '@/lib/i18n/metadata';

export async function generateMetadata({params}: PageProps<'/[locale]/get-involved/mentors'>): Promise<Metadata> {
  const locale = assertLocale((await params).locale);
  const page = await getMentorsPage(locale);
  return buildPageMetadata({locale, path: '/get-involved/mentors', title: page.seo.title, description: page.seo.description});
}

export default async function MentorsPage({params}: PageProps<'/[locale]/get-involved/mentors'>) {
  const locale = assertLocale((await params).locale);
  const [page, mentors, featured] = await Promise.all([getMentorsPage(locale), getMentors(locale), getFeaturedMentors(locale)]);

  return (
    <>
      <Hero hero={page.hero} />

      <Section id="featured" labelledBy="featured-title" tone="surface">
        <SectionHeading id="featured-title" eyebrow={page.featured.eyebrow} title={page.featured.title} />
        <MentorShowcase mentors={featured} layout="grid" label={page.featured.title} />
      </Section>

      <Section id="directory" labelledBy="directory-title">
        <SectionHeading id="directory-title" eyebrow={page.directory.eyebrow} title={page.directory.title} intro={page.directory.intro} />
        <MentorDirectory mentors={mentors} label={page.directory.title} />
      </Section>

      <CTASection id="become-a-mentor" block={page.cta} />
    </>
  );
}

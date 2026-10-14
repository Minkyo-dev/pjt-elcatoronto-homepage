import type {Metadata} from 'next';
import {Section} from '@/components/layout/Section';
import {CardGrid} from '@/components/sections/CardGrid';
import {CTASection} from '@/components/sections/CTASection';
import {FAQSection} from '@/components/sections/FAQSection';
import {Hero} from '@/components/sections/Hero';
import {HistoryTimeline} from '@/components/sections/HistoryTimeline';
import {SectionHeading} from '@/components/sections/SectionHeading';
import {StatGrid} from '@/components/sections/StatGrid';
import {TeamGrid} from '@/components/sections/TeamGrid';
import {Button} from '@/components/ui/Button';
import {FlagBadges} from '@/components/ui/FlagBadges';
import {getCoreValues} from '@/lib/content/core-values';
import {getFaqs} from '@/lib/content/faq';
import {getAboutPage} from '@/lib/content/pages';
import {getStats} from '@/lib/content/stats';
import {getTeamMembers} from '@/lib/content/team';
import {getHistory} from '@/lib/content/timeline';
import {assertLocale} from '@/lib/i18n/locale';
import {buildPageMetadata} from '@/lib/i18n/metadata';

export async function generateMetadata({params}: PageProps<'/[locale]/about'>): Promise<Metadata> {
  const locale = assertLocale((await params).locale);
  const page = await getAboutPage(locale);
  return buildPageMetadata({locale, path: '/about', title: page.seo.title, description: page.seo.description});
}

export default async function AboutPage({params}: PageProps<'/[locale]/about'>) {
  const locale = assertLocale((await params).locale);
  const [page, values, history, stats, team, faqs] = await Promise.all([
    getAboutPage(locale),
    getCoreValues(locale),
    getHistory(locale),
    getStats(locale, 'about'),
    getTeamMembers(locale),
    getFaqs(locale, 'about'),
  ]);
  const {mission, vision} = page.missionVision;

  return (
    <>
      <Hero hero={page.hero} />

      <Section id="purpose" labelledBy="purpose-title">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="flex flex-col gap-5 lg:col-span-5">
            <SectionHeading id="purpose-title" eyebrow={page.purpose.eyebrow} title={page.purpose.title} className="mb-0" />
            <p className="text-lg text-muted">{page.purpose.body}</p>
            <p className="text-eyebrow font-semibold uppercase text-secondary">{page.values.eyebrow}</p>
          </div>
          <CardGrid cards={values} columns={2} className="lg:col-span-7" />
        </div>
      </Section>

      <Section id="mission-vision" tone="surface">
        <div className="grid gap-6 lg:grid-cols-2">
          {[mission, vision].map((block) => (
            <div key={block.title} className="flex flex-col gap-3 rounded-card border border-border bg-background p-8">
              <h2 className="font-heading text-h2 font-bold text-text">{block.title}</h2>
              <p className="text-lg text-muted">{block.body}</p>
            </div>
          ))}
        </div>
        <FlagBadges flags={page.missionVision} className="mt-4" />
      </Section>

      <Section id="story" labelledBy="story-title">
        <SectionHeading id="story-title" eyebrow={page.story.eyebrow} title={page.story.title} />
        <HistoryTimeline entries={history} />
      </Section>

      <Section id="impact" labelledBy="impact-title" tone="surface">
        <SectionHeading id="impact-title" eyebrow={page.impact.eyebrow} title={page.impact.title} />
        <StatGrid stats={stats} />
        <CardGrid cards={page.impact.cases} columns={2} className="mt-6" />
        <FlagBadges flags={page.impact} className="mt-4" />
      </Section>

      <Section id="team" labelledBy="team-title">
        <SectionHeading id="team-title" eyebrow={page.team.eyebrow} title={page.team.title} intro={page.team.intro} />
        <TeamGrid members={team} />
      </Section>

      <Section id="reports" labelledBy="reports-title" tone="surface">
        <SectionHeading
          id="reports-title"
          eyebrow={page.reportsTeaser.eyebrow}
          title={page.reportsTeaser.title}
          intro={page.reportsTeaser.intro}
          className="mb-0"
          action={
            <Button href={page.reportsTeaser.cta.href} variant="secondary">
              {page.reportsTeaser.cta.label}
            </Button>
          }
        />
      </Section>

      <FAQSection intro={page.faq} faqs={faqs} />
      <CTASection id="about-cta" block={page.cta} />
    </>
  );
}

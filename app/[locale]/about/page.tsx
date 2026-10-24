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
import {cidAttrs, itemCid} from '@/lib/utils/cid';

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
      <Hero hero={page.hero} cid="ABT-01" />

      <Section id="purpose" labelledBy="purpose-title" cid="ABT-02">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="flex flex-col gap-5 lg:col-span-5">
            <SectionHeading id="purpose-title" eyebrow={page.purpose.eyebrow} title={page.purpose.title} className="mb-0" cid="ABT-02-01" />
            <p className="text-lg text-muted" {...cidAttrs('ABT-02-02', 'PurposeBody')}>
              {page.purpose.body}
            </p>
            <p className="text-eyebrow font-semibold uppercase text-secondary" {...cidAttrs('ABT-02-03', 'ValuesEyebrow')}>
              {page.values.eyebrow}
            </p>
          </div>
          <CardGrid cards={values} columns={2} className="lg:col-span-7" cid="ABT-02-04" />
        </div>
      </Section>

      <Section id="mission-vision" tone="surface" cid="ABT-03">
        <div className="grid gap-6 lg:grid-cols-2" {...cidAttrs('ABT-03-01', 'MissionVisionGrid')}>
          {[mission, vision].map((block) => (
            <div
              key={block.title}
              className="flex flex-col gap-3 rounded-card border border-border bg-background p-8"
              {...cidAttrs(itemCid('ABT-03-01'), 'MissionVisionCard')}
            >
              <h2 className="font-heading text-h2 font-bold text-text">{block.title}</h2>
              <p className="text-lg text-muted">{block.body}</p>
            </div>
          ))}
        </div>
        <FlagBadges flags={page.missionVision} className="mt-4" cid="ABT-03-02" />
      </Section>

      <Section id="story" labelledBy="story-title" cid="ABT-04">
        <SectionHeading id="story-title" eyebrow={page.story.eyebrow} title={page.story.title} cid="ABT-04-01" />
        <HistoryTimeline entries={history} cid="ABT-04-02" />
      </Section>

      <Section id="impact" labelledBy="impact-title" tone="surface" cid="ABT-05">
        <SectionHeading id="impact-title" eyebrow={page.impact.eyebrow} title={page.impact.title} cid="ABT-05-01" />
        <StatGrid stats={stats} cid="ABT-05-02" />
        <CardGrid cards={page.impact.cases} columns={2} className="mt-6" cid="ABT-05-03" />
        <FlagBadges flags={page.impact} className="mt-4" cid="ABT-05-04" />
      </Section>

      <Section id="team" labelledBy="team-title" cid="ABT-06">
        <SectionHeading id="team-title" eyebrow={page.team.eyebrow} title={page.team.title} intro={page.team.intro} cid="ABT-06-01" />
        <TeamGrid members={team} cid="ABT-06-02" />
      </Section>

      <Section id="reports" labelledBy="reports-title" tone="surface" cid="ABT-07">
        <SectionHeading
          id="reports-title"
          eyebrow={page.reportsTeaser.eyebrow}
          title={page.reportsTeaser.title}
          intro={page.reportsTeaser.intro}
          className="mb-0"
          cid="ABT-07-01"
          action={
            <Button href={page.reportsTeaser.cta.href} variant="secondary" cid="ABT-07-02">
              {page.reportsTeaser.cta.label}
            </Button>
          }
        />
      </Section>

      <FAQSection intro={page.faq} faqs={faqs} cid="ABT-08" />
      <CTASection id="about-cta" block={page.cta} cid="ABT-09" />
    </>
  );
}

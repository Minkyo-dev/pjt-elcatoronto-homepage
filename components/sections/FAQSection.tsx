import {Section} from '@/components/layout/Section';
import {Accordion} from '@/components/ui/Accordion';
import {FlagBadges} from '@/components/ui/FlagBadges';
import {RichText} from '@/components/ui/RichText';
import {subCid} from '@/lib/utils/cid';
import type {SectionIntroView} from '@/types/common';
import type {Faq} from '@/types/misc';
import {SectionHeading} from './SectionHeading';

type FAQSectionProps = {id?: string; intro: SectionIntroView; faqs: Faq[]; tone?: 'default' | 'surface'; cid?: string};

export function FAQSection({id = 'faq', intro, faqs, tone = 'default', cid}: FAQSectionProps) {
  const headingId = `${id}-title`;
  return (
    <Section id={id} labelledBy={headingId} tone={tone} cid={cid}>
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading id={headingId} eyebrow={intro.eyebrow} title={intro.title} intro={intro.intro} className="mb-0" cid={subCid(cid, 1)} />
        </div>
        <Accordion
          className="lg:col-span-8"
          cid={subCid(cid, 2)}
          items={faqs.map((faq) => ({
            id: `${id}-${faq._id.replace(/\./g, '-')}`,
            title: faq.question,
            content: (
              <>
                <RichText value={faq.answer} className="text-muted" />
                <FlagBadges flags={faq} className="mt-3" />
              </>
            ),
          }))}
        />
      </div>
    </Section>
  );
}

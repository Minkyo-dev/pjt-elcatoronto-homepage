import {Section} from '@/components/layout/Section';
import {Button} from '@/components/ui/Button';
import {cidAttrs, subCid} from '@/lib/utils/cid';
import type {CtaBlockView} from '@/types/common';

export function CTASection({id, block, cid}: {id: string; block: CtaBlockView; cid?: string}) {
  const headingId = `${id}-title`;
  return (
    <Section id={id} labelledBy={headingId} tone="surface" className="border-t border-border" cid={cid}>
      <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-heading flex-col gap-3" {...cidAttrs(subCid(cid, 1), 'CTAText')}>
          <h2 id={headingId} className="font-heading text-h2 font-bold text-balance text-text">
            {block.title}
          </h2>
          <p className="max-w-body text-lg text-muted">{block.body}</p>
        </div>
        <div className="flex flex-wrap gap-3" {...cidAttrs(subCid(cid, 2), 'CTAButtons')}>
          {block.ctas.map((cta, index) => (
            <Button key={cta.href} href={cta.href} size="lg" variant={index === 0 ? 'primary' : 'secondary'}>
              {cta.label}
            </Button>
          ))}
        </div>
      </div>
    </Section>
  );
}

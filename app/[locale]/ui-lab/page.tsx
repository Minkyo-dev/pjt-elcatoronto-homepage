import type {Metadata} from 'next';
import {ArrowRight, SearchX} from 'lucide-react';
import {notFound} from 'next/navigation';
import {Section} from '@/components/layout/Section';
import {Avatar} from '@/components/ui/Avatar';
import {Badge} from '@/components/ui/Badge';
import {Button} from '@/components/ui/Button';
import {EmptyState} from '@/components/ui/EmptyState';
import {FlagBadges} from '@/components/ui/FlagBadges';
import {Icon} from '@/components/ui/Icon';
import {ImageFrame} from '@/components/ui/ImageFrame';
import {RichText} from '@/components/ui/RichText';
import {SocialMark} from '@/components/ui/SocialMark';
import {pt} from '@/lib/utils/pt';

export const metadata: Metadata = {title: 'UI Lab', robots: {index: false, follow: false}};

const demoImage = {
  url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&h=800&q=80',
  alt: 'Three young adults talking around a café table with laptops',
  width: 1200,
  height: 800,
};

// Developer/designer showcase. Hardcoded copy is allowed only on this page.
export default function UiLabPage() {
  if (process.env.NEXT_PUBLIC_ENABLE_UI_LAB !== '1') notFound();

  return (
    <>
      <Section>
        <h1 className="font-heading text-display font-extrabold text-text">UI Lab</h1>
      </Section>

      <Section id="buttons" labelledBy="buttons-title" tone="surface">
        <h2 id="buttons-title" className="mb-6 font-heading text-h2 font-bold">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="ghost">Ghost</Button>
          <Button href="/about" icon={<ArrowRight aria-hidden="true" className="size-4" />}>
            Internal link
          </Button>
          <Button href="#buttons" variant="secondary">
            Anchor link
          </Button>
          <Button href="https://example.com" variant="secondary">
            External link
          </Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="on-dark mt-6 flex flex-wrap gap-3 rounded-card bg-primary p-6">
          <Button variant="inverse">Inverse</Button>
          <Button variant="on-dark">On dark</Button>
        </div>
      </Section>

      <Section id="badges" labelledBy="badges-title">
        <h2 id="badges-title" className="mb-6 font-heading text-h2 font-bold">Badges, avatars, icons</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Neutral</Badge>
          <Badge variant="category">Workshop</Badge>
          <Badge variant="demo">Demo</Badge>
          <FlagBadges flags={{isSample: true, needsReview: true}} />
          <Avatar name="Jiwon Kim" seed="jiwon-kim" />
          <Avatar name="김지원" seed="jiwon-kim" size="lg" />
          <Icon name="compass" className="text-secondary" />
          <SocialMark network="facebook" className="text-primary" />
          <SocialMark network="linkedin" className="text-primary" />
        </div>
      </Section>

      <Section id="media" labelledBy="media-title" tone="surface">
        <h2 id="media-title" className="mb-6 font-heading text-h2 font-bold">Media and text</h2>
        <div className="grid gap-8 lg:grid-cols-2">
          <ImageFrame image={demoImage} ratio="3/2" sizes="(min-width: 1024px) 50vw, 100vw" />
          <RichText value={pt('A paragraph of rich text.\n\n## A heading\n\n- First item\n- Second item')} />
        </div>
        <div className="mt-8">
          <EmptyState
            icon={<SearchX aria-hidden="true" className="size-8 text-muted" />}
            title="Nothing here yet"
            body="Empty states explain what happened and what to do next."
            action={<Button variant="secondary">Reset</Button>}
          />
        </div>
      </Section>
    </>
  );
}

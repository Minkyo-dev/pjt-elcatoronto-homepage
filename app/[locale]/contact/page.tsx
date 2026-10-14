import {Mail, MapPin, Share2} from 'lucide-react';
import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {Section} from '@/components/layout/Section';
import {ContactForm} from '@/components/pages/contact/ContactForm';
import {FAQSection} from '@/components/sections/FAQSection';
import {Hero} from '@/components/sections/Hero';
import {SectionHeading} from '@/components/sections/SectionHeading';
import {FlagBadges} from '@/components/ui/FlagBadges';
import {SocialMark} from '@/components/ui/SocialMark';
import {getFaqs} from '@/lib/content/faq';
import {getContactPage} from '@/lib/content/pages';
import {getSiteSettings} from '@/lib/content/site';
import {assertLocale} from '@/lib/i18n/locale';
import {buildPageMetadata} from '@/lib/i18n/metadata';

export async function generateMetadata({params}: PageProps<'/[locale]/contact'>): Promise<Metadata> {
  const locale = assertLocale((await params).locale);
  const page = await getContactPage(locale);
  return buildPageMetadata({locale, path: '/contact', title: page.seo.title, description: page.seo.description});
}

const cardClass = 'flex flex-col gap-3 rounded-card border border-border bg-background p-6';

export default async function ContactPage({params}: PageProps<'/[locale]/contact'>) {
  const locale = assertLocale((await params).locale);
  const [page, settings, faqs, t, tFooter, tCommon] = await Promise.all([
    getContactPage(locale),
    getSiteSettings(locale),
    getFaqs(locale, 'contact'),
    getTranslations('Contact'),
    getTranslations('Footer'),
    getTranslations('Common'),
  ]);
  const socials = [
    {network: 'facebook' as const, href: settings.social.facebook, label: tFooter('facebook')},
    {network: 'linkedin' as const, href: settings.social.linkedin, label: tFooter('linkedin')},
  ].filter((social): social is {network: 'facebook' | 'linkedin'; href: string; label: string} => Boolean(social.href));

  return (
    <>
      <Hero hero={page.hero} />

      <Section id="contact-info" labelledBy="contact-info-title" tone="surface">
        <SectionHeading id="contact-info-title" title={page.info.title} />
        <ul className="grid gap-6 lg:grid-cols-3">
          <li className={cardClass}>
            <Mail aria-hidden="true" className="size-6 text-secondary" />
            <h3 className="font-heading text-lg font-bold">{t('email')}</h3>
            <a href={`mailto:${settings.contact.email}`} className="font-semibold text-primary underline-offset-4 hover:underline">
              {settings.contact.email}
            </a>
            <FlagBadges flags={settings.contact} />
          </li>
          <li className={cardClass}>
            <MapPin aria-hidden="true" className="size-6 text-secondary" />
            <h3 className="font-heading text-lg font-bold">{t('location')}</h3>
            <p>{settings.contact.location}</p>
          </li>
          <li className={cardClass}>
            <Share2 aria-hidden="true" className="size-6 text-secondary" />
            <h3 className="font-heading text-lg font-bold">{t('social')}</h3>
            <ul className="flex flex-col gap-1">
              {socials.map((social) => (
                <li key={social.network}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-3 font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    <SocialMark network={social.network} className="size-8" />
                    {social.label}
                    <span className="sr-only"> {tCommon('opensInNewTab')}</span>
                  </a>
                </li>
              ))}
            </ul>
            <FlagBadges flags={settings.social} />
          </li>
        </ul>
      </Section>

      <Section id="contact-form" labelledBy="contact-form-title">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading id="contact-form-title" eyebrow={page.form.eyebrow} title={page.form.title} intro={page.form.intro} className="mb-0" />
          </div>
          <div className="lg:col-span-8">
            <ContactForm />
          </div>
        </div>
      </Section>

      <Section id="location" labelledBy="location-title" tone="surface">
        <SectionHeading id="location-title" eyebrow={page.location.eyebrow} title={page.location.title} intro={page.location.intro} />
        <div className="flex aspect-video flex-col items-center justify-center gap-3 rounded-card border border-dashed border-border-strong bg-background p-6 text-center lg:aspect-[3/1]">
          <MapPin aria-hidden="true" className="size-8 text-muted" />
          <p className="font-semibold text-text">{settings.contact.location}</p>
          <p className="max-w-body text-sm text-muted">{t('mapPlaceholder')}</p>
        </div>
      </Section>

      <FAQSection intro={page.faq} faqs={faqs} />
    </>
  );
}

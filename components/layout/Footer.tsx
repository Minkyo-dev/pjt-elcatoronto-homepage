import {getTranslations} from 'next-intl/server';
import {Button} from '@/components/ui/Button';
import {FlagBadges} from '@/components/ui/FlagBadges';
import {SocialMark} from '@/components/ui/SocialMark';
import {Link} from '@/lib/i18n/navigation';
import {FOOTER_EXPLORE, FOOTER_GET_INVOLVED, resolveNav, type NavLink} from '@/lib/navigation/site-nav';
import {cn} from '@/lib/utils/cn';
import type {SiteSettings} from '@/types/pages';
import {Container} from './Container';
import {Logo} from './Logo';
import {NewsletterForm} from './NewsletterForm';

const columnTitleClass = 'text-sm font-semibold uppercase tracking-wide text-on-primary-muted';

function FooterLinks({title, links, className}: {title: string; links: NavLink[]; className?: string}) {
  return (
    <nav aria-label={title} className={cn('flex flex-col gap-3', className)}>
      <h2 className={columnTitleClass}>{title}</h2>
      <ul className="flex flex-col">
        {links.map((link) => (
          <li key={link.key}>
            <Link href={link.href} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export async function Footer({settings}: {settings: SiteSettings}) {
  const [t, tNav, tCommon] = await Promise.all([
    getTranslations('Footer'),
    getTranslations('Nav'),
    getTranslations('Common'),
  ]);
  const socialLinks = [
    {network: 'facebook' as const, href: settings.social.facebook, label: t('facebook')},
    {network: 'linkedin' as const, href: settings.social.linkedin, label: t('linkedin')},
  ].filter((link): link is {network: 'facebook' | 'linkedin'; href: string; label: string} => Boolean(link.href));

  return (
    <footer className="on-dark bg-primary-deep text-on-primary">
      <section aria-labelledby="prefooter-title" className="border-b border-on-primary/15 bg-primary">
        <Container className="flex flex-col gap-6 py-14 lg:flex-row lg:items-center lg:justify-between lg:py-16">
          <div className="flex max-w-heading flex-col gap-3">
            <h2 id="prefooter-title" className="font-heading text-h2 font-bold text-balance">
              {settings.preFooterCta.title}
            </h2>
            <p className="text-lg text-on-primary-muted">{settings.preFooterCta.body}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {settings.preFooterCta.ctas.map((cta, index) => (
              <Button key={cta.href} href={cta.href} size="lg" variant={index === 0 ? 'inverse' : 'accent'}>
                {cta.label}
              </Button>
            ))}
          </div>
        </Container>
      </section>

      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-4">
          <Logo label={tCommon('homeLabel')} tone="dark" />
          <p className="text-sm font-semibold">{settings.orgFullName}</p>
          <p className="max-w-sm text-on-primary-muted">{settings.description}</p>
          <ul aria-label={t('social')} className="flex gap-2">
            {socialLinks.map((link) => (
              <li key={link.network}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${link.label} ${tCommon('opensInNewTab')}`}
                  className="inline-flex size-11 items-center justify-center rounded-full transition-colors duration-150 hover:bg-on-primary/10"
                >
                  <SocialMark network={link.network} />
                </a>
              </li>
            ))}
          </ul>
          <FlagBadges flags={settings.social} />
        </div>

        <FooterLinks title={t('explore')} links={resolveNav(FOOTER_EXPLORE, (key) => tNav(key))} className="lg:col-span-2" />
        <FooterLinks title={t('getInvolved')} links={resolveNav(FOOTER_GET_INVOLVED, (key) => tNav(key))} className="lg:col-span-2" />

        <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-4">
          <h2 className={columnTitleClass}>{t('stayConnected')}</h2>
          <p>
            <span className="sr-only">{t('email')}: </span>
            <a href={`mailto:${settings.contact.email}`} className="font-semibold underline-offset-4 hover:underline">
              {settings.contact.email}
            </a>
          </p>
          <FlagBadges flags={settings.contact} />
          <div className="flex flex-col gap-1">
            <p className="font-semibold">{settings.newsletter.title}</p>
            <p className="text-sm text-on-primary-muted">{settings.newsletter.body}</p>
          </div>
          <NewsletterForm />
        </div>
      </Container>

      <div className="border-t border-on-primary/15">
        <Container className="flex flex-col gap-3 py-6 text-sm text-on-primary-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{t('copyright', {year: settings.currentYear})}</p>
          <p>
            <Link href="/contact" className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
              {t('privacy')} {t('privacyNote')}
            </Link>
          </p>
        </Container>
      </div>
    </footer>
  );
}

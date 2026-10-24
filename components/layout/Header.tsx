import {getTranslations} from 'next-intl/server';
import {Button} from '@/components/ui/Button';
import {PRIMARY_NAV, resolveNav} from '@/lib/navigation/site-nav';
import {cidAttrs} from '@/lib/utils/cid';
import {Container} from './Container';
import {DesktopNav} from './DesktopNav';
import {LanguageSwitcher} from './LanguageSwitcher';
import {Logo} from './Logo';
import {MobileNav} from './MobileNav';

export async function Header() {
  const [tCommon, tNav] = await Promise.all([getTranslations('Common'), getTranslations('Nav')]);
  const items = resolveNav(PRIMARY_NAV, (key) => tNav(key));

  return (
    <header className="relative z-40 border-b border-border bg-surface" {...cidAttrs('GLB-01', 'Header')}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-50 focus:rounded-button focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary"
      >
        {tCommon('skipToContent')}
      </a>
      <Container className="flex h-18 items-center justify-between gap-6">
        <Logo label={tCommon('homeLabel')} cid="GLB-01-01" />
        <DesktopNav items={items} label={tNav('primaryLabel')} cid="GLB-01-02" />
        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher cid="GLB-01-03" />
          <Button href="/get-involved/donate" variant="accent" cid="GLB-01-04">
            {tNav('donate')}
          </Button>
        </div>
        <MobileNav items={items} title={tNav('mobileTitle')} openLabel={tNav('openMenu')} donateLabel={tNav('donate')} />
      </Container>
    </header>
  );
}

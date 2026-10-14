import {Link} from '@/lib/i18n/navigation';
import {cn} from '@/lib/utils/cn';

/** Text wordmark placeholder until the official logo file is provided. */
export function Logo({label, tone = 'default'}: {label: string; tone?: 'default' | 'dark'}) {
  return (
    <Link
      href="/"
      aria-label={label}
      className={cn(
        'inline-flex min-h-11 items-center font-heading text-2xl font-extrabold tracking-tight',
        tone === 'dark' ? 'text-on-primary' : 'text-primary',
      )}
    >
      ELCA<span className="text-accent">.</span>
    </Link>
  );
}

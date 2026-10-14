import type {ComponentProps, ReactNode} from 'react';
import {Link} from '@/lib/i18n/navigation';
import {cn} from '@/lib/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'inverse' | 'on-dark';
export type ButtonSize = 'md' | 'lg';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary hover:bg-primary-hover',
  secondary: 'border border-primary bg-surface text-primary hover:bg-background',
  accent: 'bg-accent text-on-primary hover:bg-accent-strong',
  ghost: 'text-primary hover:bg-border/60',
  inverse: 'bg-on-primary text-primary hover:bg-background',
  'on-dark': 'border border-on-primary text-on-primary hover:bg-on-primary hover:text-primary',
};

const sizeClasses: Record<ButtonSize, string> = {
  md: 'min-h-11 px-4 text-sm',
  lg: 'min-h-12 px-6 text-base',
};

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  className,
}: {variant?: ButtonVariant; size?: ButtonSize; className?: string} = {}): string {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-button text-center font-semibold transition-colors duration-150',
    'disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

type BaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: 'start' | 'end';
  className?: string;
  children: ReactNode;
};

type NativeButtonProps = BaseProps & Omit<ComponentProps<'button'>, keyof BaseProps> & {href?: undefined};
type LinkButtonProps = BaseProps & Omit<ComponentProps<'a'>, keyof BaseProps | 'href'> & {href: string};

/** Renders a locale-aware Link for internal paths, <a> for anchors/mailto/external URLs, otherwise <button>. */
export function Button(props: NativeButtonProps | LinkButtonProps) {
  const {variant, size, icon, iconPosition = 'end', className, children, ...rest} = props;
  const classes = buttonClasses({variant, size, className});
  const content = (
    <>
      {icon && iconPosition === 'start' ? icon : null}
      <span>{children}</span>
      {icon && iconPosition === 'end' ? icon : null}
    </>
  );

  if (typeof rest.href === 'string') {
    const {href, ...anchorProps} = rest as Omit<LinkButtonProps, keyof BaseProps>;
    if (isExternalHref(href)) {
      return (
        <a href={href} className={classes} {...anchorProps} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      );
    }
    if (href.startsWith('#') || href.startsWith('mailto:')) {
      return (
        <a href={href} className={classes} {...anchorProps}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {content}
      </Link>
    );
  }

  const {type = 'button', ...buttonProps} = rest as Omit<NativeButtonProps, keyof BaseProps>;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {content}
    </button>
  );
}

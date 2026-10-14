import {useTranslations} from 'next-intl';
import type {ReactNode} from 'react';
import {cn} from '@/lib/utils/cn';

export type FieldA11yProps = {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  required?: boolean;
};

type Tone = 'default' | 'dark';

const labelTone: Record<Tone, string> = {default: 'text-text', dark: 'text-on-primary'};
const hintTone: Record<Tone, string> = {default: 'text-muted', dark: 'text-on-primary-muted'};
const errorTone: Record<Tone, string> = {default: 'text-danger', dark: 'text-danger-on-dark'};

function RequiredMark({required, tone}: {required?: boolean; tone: Tone}) {
  const t = useTranslations('Forms');
  return required ? (
    <>
      <span aria-hidden="true" className={errorTone[tone]}>
        {' *'}
      </span>
      <span className="sr-only"> ({t('required')})</span>
    </>
  ) : (
    <span className={cn('font-normal', hintTone[tone])}> ({t('optional')})</span>
  );
}

type FormFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  tone?: Tone;
  className?: string;
  children: (field: FieldA11yProps) => ReactNode;
};

/** Label + control + hint + error, wired together with ids and aria attributes. */
export function FormField({id, label, required, hint, error, tone = 'default', className, children}: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className={cn('text-sm font-semibold', labelTone[tone])}>
        {label}
        <RequiredMark required={required} tone={tone} />
      </label>
      {hint ? (
        <p id={hintId} className={cn('text-sm', hintTone[tone])}>
          {hint}
        </p>
      ) : null}
      {children({id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined, required})}
      {error ? (
        <p id={errorId} className={cn('text-sm font-medium', errorTone[tone])}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Fieldset for radio/checkbox groups. */
export function ChoiceGroup({
  legend,
  required,
  hint,
  error,
  className,
  children,
}: {
  legend: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className={cn('flex flex-col gap-2', className)}>
      <legend className="mb-1 text-sm font-semibold text-text">
        {legend}
        <RequiredMark required={required} tone="default" />
      </legend>
      {hint ? <p className="text-sm text-muted">{hint}</p> : null}
      {children}
      {error ? <p className="text-sm font-medium text-danger">{error}</p> : null}
    </fieldset>
  );
}

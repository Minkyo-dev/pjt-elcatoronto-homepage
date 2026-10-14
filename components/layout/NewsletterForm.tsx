'use client';

import {useTranslations} from 'next-intl';
import {useId} from 'react';
import {Button} from '@/components/ui/Button';
import {FormFeedback} from '@/components/ui/FormFeedback';
import {FormField} from '@/components/ui/FormField';
import {Input} from '@/components/ui/Input';
import {useDemoForm} from '@/lib/forms/useDemoForm';
import {newsletterSchema} from '@/lib/validation/forms';

export function NewsletterForm() {
  const t = useTranslations('Newsletter');
  const tErrors = useTranslations('Errors');
  const id = useId();
  const {formRef, ...form} = useDemoForm(newsletterSchema, {email: ''});

  return (
    <form ref={formRef} onSubmit={form.handleSubmit} noValidate className="flex flex-col gap-3">
      <FormField
        id={`${id}-email`}
        label={t('label')}
        required
        tone="dark"
        error={form.errors.email ? tErrors(form.errors.email) : undefined}
      >
        {(field) => (
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              {...field}
              name="email"
              type="email"
              autoComplete="email"
              placeholder={t('placeholder')}
              value={form.values.email}
              onChange={(event) => form.setValue('email', event.target.value)}
              onBlur={() => form.handleBlur('email')}
              className="sm:flex-1"
            />
            <Button type="submit" variant="inverse">
              {t('submit')}
            </Button>
          </div>
        )}
      </FormField>
      <FormFeedback status={form.status} tone="dark" demoMessage={t('demoNotice')} />
    </form>
  );
}

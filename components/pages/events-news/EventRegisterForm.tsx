'use client';

import {useTranslations} from 'next-intl';
import {useId} from 'react';
import {Button} from '@/components/ui/Button';
import {FormFeedback} from '@/components/ui/FormFeedback';
import {FormField} from '@/components/ui/FormField';
import {Input, Textarea} from '@/components/ui/Input';
import {useDemoForm} from '@/lib/forms/useDemoForm';
import {eventRegisterSchema} from '@/lib/validation/forms';

export function EventRegisterForm() {
  const t = useTranslations('Events');
  const tForms = useTranslations('Forms');
  const tErrors = useTranslations('Errors');
  const id = useId();
  const {formRef, ...form} = useDemoForm(eventRegisterSchema, {name: '', email: '', cohort: '', question: ''});
  const errorFor = (field: keyof typeof form.values) => {
    const key = form.errors[field];
    return key ? tErrors(key) : undefined;
  };

  return (
    <form ref={formRef} noValidate onSubmit={form.handleSubmit} className="flex flex-col gap-4">
      <FormField id={`${id}-name`} label={tForms('fields.name')} required error={errorFor('name')}>
        {(a11y) => (
          <Input {...a11y} name="name" autoComplete="name" value={form.values.name} onChange={(event) => form.setValue('name', event.target.value)} onBlur={() => form.handleBlur('name')} />
        )}
      </FormField>
      <FormField id={`${id}-email`} label={tForms('fields.email')} required error={errorFor('email')}>
        {(a11y) => (
          <Input
            {...a11y}
            name="email"
            type="email"
            autoComplete="email"
            value={form.values.email}
            onChange={(event) => form.setValue('email', event.target.value)}
            onBlur={() => form.handleBlur('email')}
          />
        )}
      </FormField>
      <FormField id={`${id}-cohort`} label={tForms('fields.cohort')} error={errorFor('cohort')}>
        {(a11y) => <Input {...a11y} name="cohort" value={form.values.cohort} onChange={(event) => form.setValue('cohort', event.target.value)} />}
      </FormField>
      <FormField id={`${id}-question`} label={tForms('fields.question')} error={errorFor('question')}>
        {(a11y) => (
          <Textarea {...a11y} name="question" rows={3} maxLength={500} value={form.values.question} onChange={(event) => form.setValue('question', event.target.value)} />
        )}
      </FormField>
      <FormFeedback status={form.status} demoMessage={tForms('demoSuccess')} />
      <Button type="submit" className="self-start">
        {t('registerSubmit')}
      </Button>
    </form>
  );
}

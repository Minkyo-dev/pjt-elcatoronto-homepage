'use client';

import {useTranslations} from 'next-intl';
import {useId, useState} from 'react';
import {Button} from '@/components/ui/Button';
import {Dialog} from '@/components/ui/Dialog';
import {FormFeedback} from '@/components/ui/FormFeedback';
import {ChoiceGroup, FormField} from '@/components/ui/FormField';
import {Input, Textarea} from '@/components/ui/Input';
import {useDemoForm} from '@/lib/forms/useDemoForm';
import {MENTEE_INTERESTS, menteeApplySchema} from '@/lib/validation/forms';

const MOTIVATION_MAX = 500;

export function MenteeApply() {
  const t = useTranslations('Mentorship');
  const tForms = useTranslations('Forms');
  const tErrors = useTranslations('Errors');
  const [open, setOpen] = useState(false);
  const id = useId();
  const {formRef, ...form} = useDemoForm(menteeApplySchema, {
    name: '',
    email: '',
    school: '',
    interests: [] as string[],
    motivation: '',
  });
  const errorFor = (field: keyof typeof form.values) => {
    const key = form.errors[field];
    return key ? tErrors(key) : undefined;
  };

  function toggleInterest(interest: string) {
    const current = form.values.interests;
    form.setValue('interests', current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest]);
  }

  return (
    <>
      <Button size="lg" aria-haspopup="dialog" onClick={() => setOpen(true)}>
        {t('applyNow')}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} title={t('applyTitle')} size="lg">
        <form ref={formRef} noValidate onSubmit={form.handleSubmit} className="flex flex-col gap-5">
          <FormField id={`${id}-name`} label={tForms('fields.name')} required error={errorFor('name')}>
            {(field) => (
              <Input
                {...field}
                name="name"
                autoComplete="name"
                value={form.values.name}
                onChange={(event) => form.setValue('name', event.target.value)}
                onBlur={() => form.handleBlur('name')}
              />
            )}
          </FormField>
          <FormField id={`${id}-email`} label={tForms('fields.email')} required error={errorFor('email')}>
            {(field) => (
              <Input
                {...field}
                name="email"
                type="email"
                autoComplete="email"
                value={form.values.email}
                onChange={(event) => form.setValue('email', event.target.value)}
                onBlur={() => form.handleBlur('email')}
              />
            )}
          </FormField>
          <FormField id={`${id}-school`} label={tForms('fields.school')} required error={errorFor('school')}>
            {(field) => (
              <Input
                {...field}
                name="school"
                value={form.values.school}
                onChange={(event) => form.setValue('school', event.target.value)}
                onBlur={() => form.handleBlur('school')}
              />
            )}
          </FormField>
          <ChoiceGroup legend={tForms('fields.interests')} required error={errorFor('interests')}>
            <div className="grid gap-2 sm:grid-cols-2">
              {MENTEE_INTERESTS.map((interest) => (
                <label
                  key={interest}
                  className="flex min-h-11 cursor-pointer items-center gap-3 rounded-button border border-border px-3 has-[:checked]:border-secondary has-[:checked]:bg-background"
                >
                  <input
                    type="checkbox"
                    name="interests"
                    value={interest}
                    checked={form.values.interests.includes(interest)}
                    onChange={() => toggleInterest(interest)}
                    className="size-4 accent-secondary"
                  />
                  {tForms(`interests.${interest}`)}
                </label>
              ))}
            </div>
          </ChoiceGroup>
          <FormField
            id={`${id}-motivation`}
            label={tForms('fields.motivation')}
            hint={tForms('characterCount', {count: form.values.motivation.length, max: MOTIVATION_MAX})}
            error={errorFor('motivation')}
          >
            {(field) => (
              <Textarea
                {...field}
                name="motivation"
                maxLength={MOTIVATION_MAX}
                value={form.values.motivation}
                onChange={(event) => form.setValue('motivation', event.target.value)}
                onBlur={() => form.handleBlur('motivation')}
              />
            )}
          </FormField>
          <FormFeedback status={form.status} demoMessage={tForms('demoSuccess')} />
          <Button type="submit" size="lg" className="self-start">
            {tForms('submit')}
          </Button>
        </form>
      </Dialog>
    </>
  );
}

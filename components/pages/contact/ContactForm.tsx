'use client';

import {useTranslations} from 'next-intl';
import {useId} from 'react';
import {Button} from '@/components/ui/Button';
import {FormFeedback} from '@/components/ui/FormFeedback';
import {FormField} from '@/components/ui/FormField';
import {Input, Select, Textarea} from '@/components/ui/Input';
import {useDemoForm} from '@/lib/forms/useDemoForm';
import {useQueryParam} from '@/lib/hooks/useQueryParam';
import {cidAttrs} from '@/lib/utils/cid';
import {CONTACT_TOPICS, contactSchema, type ContactTopic} from '@/lib/validation/forms';

const MESSAGE_MAX = 2000;

/** Reads ?topic= after hydration; the key remounts the fields so the topic becomes the initial value. */
export function ContactForm({cid}: {cid?: string}) {
  const [topic] = useQueryParam('topic', CONTACT_TOPICS);
  return <ContactFormFields key={topic ?? 'none'} initialTopic={topic ?? ''} cid={cid} />;
}

function ContactFormFields({initialTopic, cid}: {initialTopic: ContactTopic | ''; cid?: string}) {
  const t = useTranslations('Contact');
  const tForms = useTranslations('Forms');
  const tErrors = useTranslations('Errors');
  const id = useId();
  const {formRef, ...form} = useDemoForm(contactSchema, {name: '', email: '', topic: initialTopic as string, message: ''});
  const errorFor = (field: keyof typeof form.values) => {
    const key = form.errors[field];
    return key ? tErrors(key) : undefined;
  };

  return (
    <form ref={formRef} noValidate onSubmit={form.handleSubmit} className="flex flex-col gap-5" {...cidAttrs(cid, 'ContactForm')}>
      <div className="grid gap-5 sm:grid-cols-2">
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
      </div>
      <FormField id={`${id}-topic`} label={tForms('fields.topic')} required error={errorFor('topic')}>
        {(field) => (
          <Select
            {...field}
            name="topic"
            value={form.values.topic}
            onChange={(event) => form.setValue('topic', event.target.value)}
            onBlur={() => form.handleBlur('topic')}
          >
            <option value="">{tForms('selectPlaceholder')}</option>
            {CONTACT_TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {tForms(`topics.${topic}`)}
              </option>
            ))}
          </Select>
        )}
      </FormField>
      <FormField
        id={`${id}-message`}
        label={tForms('fields.message')}
        required
        hint={tForms('characterCount', {count: form.values.message.length, max: MESSAGE_MAX})}
        error={errorFor('message')}
      >
        {(field) => (
          <Textarea
            {...field}
            name="message"
            rows={6}
            maxLength={MESSAGE_MAX}
            value={form.values.message}
            onChange={(event) => form.setValue('message', event.target.value)}
            onBlur={() => form.handleBlur('message')}
          />
        )}
      </FormField>
      <FormFeedback status={form.status} demoMessage={tForms('demoSuccess')} />
      <Button type="submit" size="lg" className="self-start">
        {t('send')}
      </Button>
    </form>
  );
}

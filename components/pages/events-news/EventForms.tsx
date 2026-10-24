'use client';

import {useTranslations} from 'next-intl';
import {useId, useState} from 'react';
import {Button} from '@/components/ui/Button';
import {FormFeedback} from '@/components/ui/FormFeedback';
import {ChoiceGroup, FormField} from '@/components/ui/FormField';
import {Input, Select, Textarea} from '@/components/ui/Input';
import {Tabs} from '@/components/ui/Tabs';
import {useDemoForm} from '@/lib/forms/useDemoForm';
import {cidAttrs} from '@/lib/utils/cid';
import {EVENT_FORMATS, EVENT_TYPES, hostEventSchema, requestEventSchema} from '@/lib/validation/forms';

function HostEventForm({intro, cid}: {intro: string; cid?: string}) {
  const tForms = useTranslations('Forms');
  const id = useId();
  const {formRef, ...form} = useDemoForm(hostEventSchema, {
    name: '',
    email: '',
    cohort: '',
    eventType: '',
    title: '',
    preferredDate: '',
    format: '',
    description: '',
  });
  const tErrors = useTranslations('Errors');
  const errorFor = (field: keyof typeof form.values) => {
    const key = form.errors[field];
    return key ? tErrors(key) : undefined;
  };
  const text = (field: 'name' | 'email' | 'cohort' | 'title' | 'preferredDate', required: boolean, type = 'text') => (
    <FormField id={`${id}-${field}`} label={tForms(`fields.${field}`)} required={required} error={errorFor(field)}>
      {(a11y) => (
        <Input
          {...a11y}
          name={field}
          type={type}
          value={form.values[field]}
          onChange={(event) => form.setValue(field, event.target.value)}
          onBlur={() => form.handleBlur(field)}
        />
      )}
    </FormField>
  );

  return (
    <form ref={formRef} noValidate onSubmit={form.handleSubmit} className="flex flex-col gap-5" {...cidAttrs(cid, 'HostEventForm')}>
      <p className="max-w-body text-muted">{intro}</p>
      <div className="grid gap-5 sm:grid-cols-2">
        {text('name', true)}
        {text('email', true, 'email')}
        {text('cohort', false)}
        <FormField id={`${id}-eventType`} label={tForms('fields.eventType')} required error={errorFor('eventType')}>
          {(a11y) => (
            <Select
              {...a11y}
              name="eventType"
              value={form.values.eventType}
              onChange={(event) => form.setValue('eventType', event.target.value)}
              onBlur={() => form.handleBlur('eventType')}
            >
              <option value="">{tForms('selectPlaceholder')}</option>
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {tForms(`eventTypes.${type}`)}
                </option>
              ))}
            </Select>
          )}
        </FormField>
        {text('title', true)}
        {text('preferredDate', true)}
      </div>
      <ChoiceGroup legend={tForms('fields.format')} required error={errorFor('format')}>
        <div className="flex flex-wrap gap-3">
          {EVENT_FORMATS.map((format) => (
            <label
              key={format}
              className="flex min-h-11 cursor-pointer items-center gap-2 rounded-button border border-border px-3 has-[:checked]:border-secondary has-[:checked]:bg-background"
            >
              <input
                type="radio"
                name="format"
                value={format}
                checked={form.values.format === format}
                onChange={() => form.setValue('format', format)}
                className="size-4 accent-secondary"
              />
              {tForms(`formats.${format}`)}
            </label>
          ))}
        </div>
      </ChoiceGroup>
      <FormField id={`${id}-description`} label={tForms('fields.description')} required error={errorFor('description')}>
        {(a11y) => (
          <Textarea
            {...a11y}
            name="description"
            maxLength={1000}
            value={form.values.description}
            onChange={(event) => form.setValue('description', event.target.value)}
            onBlur={() => form.handleBlur('description')}
          />
        )}
      </FormField>
      <FormFeedback status={form.status} demoMessage={tForms('demoSuccess')} />
      <Button type="submit" size="lg" className="self-start">
        {tForms('submit')}
      </Button>
    </form>
  );
}

function RequestEventForm({intro, cid}: {intro: string; cid?: string}) {
  const tForms = useTranslations('Forms');
  const id = useId();
  const {formRef, ...form} = useDemoForm(requestEventSchema, {name: '', email: '', topic: '', details: ''});
  const tErrors = useTranslations('Errors');
  const errorFor = (field: keyof typeof form.values) => {
    const key = form.errors[field];
    return key ? tErrors(key) : undefined;
  };

  return (
    <form ref={formRef} noValidate onSubmit={form.handleSubmit} className="flex flex-col gap-5" {...cidAttrs(cid, 'RequestEventForm')}>
      <p className="max-w-body text-muted">{intro}</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id={`${id}-name`} label={tForms('fields.name')} required error={errorFor('name')}>
          {(a11y) => (
            <Input {...a11y} name="name" value={form.values.name} onChange={(event) => form.setValue('name', event.target.value)} onBlur={() => form.handleBlur('name')} />
          )}
        </FormField>
        <FormField id={`${id}-email`} label={tForms('fields.email')} required error={errorFor('email')}>
          {(a11y) => (
            <Input
              {...a11y}
              name="email"
              type="email"
              value={form.values.email}
              onChange={(event) => form.setValue('email', event.target.value)}
              onBlur={() => form.handleBlur('email')}
            />
          )}
        </FormField>
      </div>
      <FormField id={`${id}-topic`} label={tForms('fields.requestTopic')} required error={errorFor('topic')}>
        {(a11y) => (
          <Input {...a11y} name="topic" value={form.values.topic} onChange={(event) => form.setValue('topic', event.target.value)} onBlur={() => form.handleBlur('topic')} />
        )}
      </FormField>
      <FormField id={`${id}-details`} label={tForms('fields.details')} required error={errorFor('details')}>
        {(a11y) => (
          <Textarea
            {...a11y}
            name="details"
            maxLength={1000}
            value={form.values.details}
            onChange={(event) => form.setValue('details', event.target.value)}
            onBlur={() => form.handleBlur('details')}
          />
        )}
      </FormField>
      <FormFeedback status={form.status} demoMessage={tForms('demoSuccess')} />
      <Button type="submit" size="lg" className="self-start">
        {tForms('submit')}
      </Button>
    </form>
  );
}

/** `cid` labels the tabs, `formCid` the active form (both components of the host section). */
export function EventForms({hostIntro, requestIntro, cid, formCid}: {hostIntro: string; requestIntro: string; cid?: string; formCid?: string}) {
  const t = useTranslations('Events');
  const [tab, setTab] = useState<'host' | 'request'>('host');
  return (
    <Tabs
      label={t('formsTabsLabel')}
      items={[
        {id: 'host', label: t('hostTab')},
        {id: 'request', label: t('requestTab')},
      ]}
      value={tab}
      onValueChange={(id) => setTab(id as 'host' | 'request')}
      cid={cid}
    >
      {tab === 'host' ? <HostEventForm intro={hostIntro} cid={formCid} /> : <RequestEventForm intro={requestIntro} cid={formCid} />}
    </Tabs>
  );
}

'use client';

import {useFormatter, useTranslations} from 'next-intl';
import {useId, useState} from 'react';
import {Button} from '@/components/ui/Button';
import {FormFeedback} from '@/components/ui/FormFeedback';
import {ChoiceGroup, FormField} from '@/components/ui/FormField';
import {Input} from '@/components/ui/Input';
import {useDemoForm} from '@/lib/forms/useDemoForm';
import {cidAttrs} from '@/lib/utils/cid';
import {DONATION_FREQUENCIES, donationSchema} from '@/lib/validation/forms';
import type {DonationTier} from '@/types/misc';

const optionClass =
  'flex min-h-12 cursor-pointer items-center justify-center rounded-button border border-border-strong bg-surface px-3 text-center font-semibold text-text transition-colors duration-150 hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-on-primary has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-secondary has-[:focus-visible]:outline';

export function DonationSelector({tiers, cid}: {tiers: DonationTier[]; cid?: string}) {
  const t = useTranslations('Donate');
  const tForms = useTranslations('Forms');
  const tErrors = useTranslations('Errors');
  const format = useFormatter();
  const id = useId();
  const [custom, setCustom] = useState(false);
  const {formRef, ...form} = useDemoForm(donationSchema, {
    frequency: 'one-time',
    amount: String(tiers[1]?.amount ?? 50),
    name: '',
    email: '',
  });

  const money = (value: number) => format.number(value, {style: 'currency', currency: 'CAD', maximumFractionDigits: 0});
  const amount = Number(form.values.amount.trim());
  const validAmount = form.values.amount.trim() !== '' && Number.isInteger(amount) && amount >= 5 && amount <= 10000;
  const tier = tiers.find((item) => item.amount === amount);
  const amountError = form.errors.amount ? tErrors(form.errors.amount) : undefined;

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={form.handleSubmit}
      className="grid gap-8 lg:grid-cols-12"
      {...cidAttrs(cid, 'DonationSelector')}
    >
      <div className="flex flex-col gap-8 lg:col-span-7">
        <ChoiceGroup legend={t('frequency')} required>
          <div className="grid grid-cols-2 gap-3">
            {DONATION_FREQUENCIES.map((frequency) => (
              <label key={frequency} className={optionClass}>
                <input
                  type="radio"
                  name="frequency"
                  value={frequency}
                  checked={form.values.frequency === frequency}
                  onChange={() => form.setValue('frequency', frequency)}
                  className="sr-only"
                />
                {frequency === 'monthly' ? t('monthly') : t('oneTime')}
              </label>
            ))}
          </div>
        </ChoiceGroup>

        <ChoiceGroup legend={t('amount')} required error={custom ? undefined : amountError}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {tiers.map((item) => (
              <label key={item._id} className={optionClass}>
                <input
                  type="radio"
                  name="amountChoice"
                  value={item.amount}
                  checked={!custom && form.values.amount === String(item.amount)}
                  onChange={() => {
                    setCustom(false);
                    form.setValue('amount', String(item.amount));
                  }}
                  className="sr-only"
                />
                {money(item.amount)}
              </label>
            ))}
            <label className={optionClass}>
              <input
                type="radio"
                name="amountChoice"
                value="other"
                checked={custom}
                onChange={() => {
                  setCustom(true);
                  form.setValue('amount', '');
                }}
                className="sr-only"
              />
              {t('other')}
            </label>
          </div>
          {custom ? (
            <FormField id={`${id}-other`} label={t('otherAmount')} required error={amountError} className="mt-3">
              {(field) => (
                <Input
                  {...field}
                  name="amount"
                  inputMode="numeric"
                  value={form.values.amount}
                  onChange={(event) => form.setValue('amount', event.target.value)}
                  onBlur={() => form.handleBlur('amount')}
                />
              )}
            </FormField>
          ) : null}
        </ChoiceGroup>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-1 text-sm font-semibold text-text">{t('optionalDetails')}</legend>
          <FormField id={`${id}-name`} label={tForms('fields.name')}>
            {(field) => (
              <Input {...field} name="name" autoComplete="name" value={form.values.name} onChange={(event) => form.setValue('name', event.target.value)} />
            )}
          </FormField>
          <FormField id={`${id}-email`} label={tForms('fields.email')} error={form.errors.email ? tErrors(form.errors.email) : undefined}>
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
        </fieldset>
      </div>

      <aside className="flex flex-col gap-4 self-start rounded-card border border-border bg-surface p-6 lg:col-span-5">
        <div aria-live="polite" className="flex flex-col gap-2">
          <p className="font-heading text-h3 font-bold text-text">
            {validAmount ? t('summary', {amount: money(amount), frequency: form.values.frequency}) : t('summaryEmpty')}
          </p>
          {validAmount && tier ? <p className="text-muted">{tier.impact}</p> : null}
        </div>
        <FormFeedback status={form.status} demoMessage={t('noPayment')} />
        <Button type="submit" variant="accent" size="lg">
          {t('continue')}
        </Button>
      </aside>
    </form>
  );
}

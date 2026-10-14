'use client';

import {useRef, useState, type FormEvent} from 'react';
import type {z} from 'zod';
import {toFieldErrors, type FormErrorKey} from '@/lib/validation/forms';

export type DemoFormStatus = 'idle' | 'invalid' | 'demo';
type FieldValues = Record<string, string | string[]>;

/**
 * Client-side validation for demo forms. Nothing is ever sent.
 * Phase 3: replace the success branch in `handleSubmit` with a Server Action call.
 */
export function useDemoForm<V extends FieldValues>(schema: z.ZodType, initialValues: V) {
  type Field = keyof V & string;
  const [values, setValues] = useState<V>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<Field, FormErrorKey>>>({});
  const [status, setStatus] = useState<DemoFormStatus>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  function revalidate(field: Field, next: V) {
    const result = schema.safeParse(next);
    const fieldErrors = result.success ? {} : toFieldErrors(result.error);
    const updated = {...errors};
    const error = fieldErrors[field];
    if (error) updated[field] = error;
    else delete updated[field];
    setErrors(updated);
    if (Object.keys(updated).length === 0) setStatus('idle');
  }

  function setValue<K extends Field>(field: K, value: V[K]) {
    const next = {...values, [field]: value};
    setValues(next);
    if (status === 'demo') setStatus('idle');
    if (errors[field]) revalidate(field, next);
  }

  function handleBlur(field: Field) {
    if (errors[field]) revalidate(field, values);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // A second submit right after the demo notice (e.g. a double click) keeps the notice instead of
    // flashing "required" errors on the freshly reset form. Any edit sets the status back to 'idle'.
    if (status === 'demo') return;
    const result = schema.safeParse(values);
    if (!result.success) {
      const fieldErrors = toFieldErrors(result.error) as Partial<Record<Field, FormErrorKey>>;
      setErrors(fieldErrors);
      setStatus('invalid');
      const firstInvalid = (Object.keys(values) as Field[]).find((field) => fieldErrors[field]);
      if (firstInvalid) formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    setErrors({});
    setValues(initialValues);
    setStatus('demo');
  }

  return {values, errors, status, setValue, handleBlur, handleSubmit, formRef};
}

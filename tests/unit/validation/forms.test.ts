import {describe, expect, it} from 'vitest';
import {
  contactSchema,
  donationSchema,
  hostEventSchema,
  menteeApplySchema,
  newsletterSchema,
  requestEventSchema,
  toFieldErrors,
} from '@/lib/validation/forms';

function errorsOf(result: {success: boolean; error?: Parameters<typeof toFieldErrors>[0]}) {
  return result.success ? {} : toFieldErrors(result.error!);
}

describe('contactSchema', () => {
  it('rejects whitespace-only input as required', () => {
    expect(errorsOf(contactSchema.safeParse({name: '   ', email: ' ', topic: '', message: '\n\t'}))).toEqual({
      name: 'required',
      email: 'required',
      topic: 'required',
      message: 'required',
    });
  });

  it('rejects malformed emails and over-long messages', () => {
    expect(errorsOf(contactSchema.safeParse({name: 'A', email: 'nope', topic: 'general', message: 'x'.repeat(2001)}))).toEqual({
      email: 'email',
      message: 'tooLong',
    });
  });

  it('trims accepted values', () => {
    const result = contactSchema.safeParse({name: '  Jiwon ', email: ' a@b.co ', topic: 'mentor', message: ' Hi '});
    expect(result.success && result.data).toEqual({name: 'Jiwon', email: 'a@b.co', topic: 'mentor', message: 'Hi'});
  });
});

describe('donationSchema', () => {
  const base = {frequency: 'one-time', name: '', email: ''};
  it.each([
    ['', 'required'],
    ['abc', 'number'],
    ['3.5', 'integer'],
    ['3', 'min'],
    ['20000', 'max'],
  ])('maps amount %j to %s', (amount, key) => {
    expect(errorsOf(donationSchema.safeParse({...base, amount}))).toEqual({amount: key});
  });

  it('accepts a trimmed whole amount and optional email', () => {
    const result = donationSchema.safeParse({...base, frequency: 'monthly', amount: ' 50 '});
    expect(result.success && result.data.amount).toBe(50);
    expect(errorsOf(donationSchema.safeParse({...base, amount: '50', email: 'bad'}))).toEqual({email: 'email'});
  });
});

describe('other schemas', () => {
  it('requires at least one valid interest', () => {
    const base = {name: 'A', email: 'a@b.co', school: 'Grade 11', motivation: ''};
    expect(errorsOf(menteeApplySchema.safeParse({...base, interests: []}))).toEqual({interests: 'required'});
    expect(errorsOf(menteeApplySchema.safeParse({...base, interests: ['cooking']}))).toEqual({interests: 'required'});
    expect(menteeApplySchema.safeParse({...base, interests: ['technology']}).success).toBe(true);
  });

  it('validates the newsletter, host, and request forms', () => {
    expect(errorsOf(newsletterSchema.safeParse({email: ''}))).toEqual({email: 'required'});
    expect(
      errorsOf(
        hostEventSchema.safeParse({
          name: 'A',
          email: 'a@b.co',
          cohort: '',
          eventType: 'panel',
          title: 'T',
          preferredDate: 'March',
          format: 'online',
          description: 'D',
        }),
      ),
    ).toEqual({eventType: 'required'});
    expect(requestEventSchema.safeParse({name: 'A', email: 'a@b.co', topic: 'Law', details: 'More law talks'}).success).toBe(true);
  });
});

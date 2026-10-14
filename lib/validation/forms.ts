import {z} from 'zod';

/** Every issue message is one of these keys; the UI translates them via messages `Errors.<key>`. */
export const FORM_ERROR_KEYS = ['required', 'email', 'tooLong', 'min', 'max', 'integer', 'number'] as const;
export type FormErrorKey = (typeof FORM_ERROR_KEYS)[number];

export const CONTACT_TOPICS = ['general', 'mentorship', 'mentor', 'donation', 'event', 'partnership'] as const;
export type ContactTopic = (typeof CONTACT_TOPICS)[number];
export const MENTEE_INTERESTS = ['business', 'technology', 'healthcare', 'law', 'finance', 'engineering', 'arts', 'other'] as const;
export const EVENT_TYPES = ['workshop', 'seminar', 'networking', 'other'] as const;
export const EVENT_FORMATS = ['online', 'in-person', 'hybrid'] as const;
export const DONATION_FREQUENCIES = ['one-time', 'monthly'] as const;
export type DonationFrequency = (typeof DONATION_FREQUENCIES)[number];

const requiredText = (max: number) =>
  z.string().trim().min(1, {error: 'required'}).max(max, {error: 'tooLong'});
const optionalText = (max: number) => z.string().trim().max(max, {error: 'tooLong'});
const email = z.string().trim().min(1, {error: 'required'}).pipe(z.email({error: 'email'}));
const optionalEmail = z
  .string()
  .trim()
  .refine((value) => value === '' || z.email().safeParse(value).success, {error: 'email'});
const choice = <T extends readonly [string, ...string[]]>(values: T) => z.enum(values, {error: 'required'});

export const newsletterSchema = z.object({email});

export const contactSchema = z.object({
  name: requiredText(100),
  email,
  topic: choice(CONTACT_TOPICS),
  message: requiredText(2000),
});

export const menteeApplySchema = z.object({
  name: requiredText(100),
  email,
  school: requiredText(150),
  interests: z.array(z.enum(MENTEE_INTERESTS)).min(1, {error: 'required'}),
  motivation: optionalText(500),
});

export const eventRegisterSchema = z.object({
  name: requiredText(100),
  email,
  cohort: optionalText(20),
  question: optionalText(500),
});

export const hostEventSchema = z.object({
  name: requiredText(100),
  email,
  cohort: optionalText(20),
  eventType: choice(EVENT_TYPES),
  title: requiredText(150),
  preferredDate: requiredText(100),
  format: choice(EVENT_FORMATS),
  description: requiredText(1000),
});

export const requestEventSchema = z.object({
  name: requiredText(100),
  email,
  topic: requiredText(150),
  details: requiredText(1000),
});

export const donationSchema = z.object({
  frequency: choice(DONATION_FREQUENCIES),
  amount: z
    .string()
    .trim()
    .min(1, {error: 'required'})
    .pipe(z.coerce.number<string>({error: 'number'}).int({error: 'integer'}).min(5, {error: 'min'}).max(10000, {error: 'max'})),
  name: optionalText(100),
  email: optionalEmail,
});

/** First error per top-level field. Unknown messages (e.g. an invalid array element) map to 'required'. */
export function toFieldErrors(error: z.ZodError): Record<string, FormErrorKey> {
  const result: Record<string, FormErrorKey> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? '');
    if (!field || field in result) continue;
    result[field] = (FORM_ERROR_KEYS as readonly string[]).includes(issue.message)
      ? (issue.message as FormErrorKey)
      : 'required';
  }
  return result;
}

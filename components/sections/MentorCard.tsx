import {GraduationCap, MapPin} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {Avatar} from '@/components/ui/Avatar';
import {Button} from '@/components/ui/Button';
import {FlagBadges} from '@/components/ui/FlagBadges';
import type {Mentor} from '@/types/mentor';

/** Name, job, company, location, and ELCA cohort — no photo or rating (spec D5). Render inside a client component. */
export function MentorCard({mentor, onViewProfile}: {mentor: Mentor; onViewProfile: (mentor: Mentor) => void}) {
  const t = useTranslations('Mentors');
  return (
    <article className="flex h-full flex-col gap-4 rounded-card border border-border bg-surface p-6">
      <div className="flex items-start gap-4">
        <Avatar name={mentor.name} seed={mentor.slug} size="lg" />
        <div className="min-w-0">
          <h3 className="font-heading text-lg font-bold text-text">{mentor.name}</h3>
          <p className="text-sm font-medium text-text">{mentor.jobTitle}</p>
          <p className="text-sm break-words text-muted">{mentor.company}</p>
        </div>
      </div>
      <dl className="flex flex-col gap-1.5 text-sm">
        <div>
          <dt className="sr-only">{t('location')}</dt>
          <dd className="flex items-center gap-1.5 text-muted">
            <MapPin aria-hidden="true" className="size-4 shrink-0" />
            {mentor.location}
          </dd>
        </div>
        {mentor.cohortRole ? (
          <div>
            <dt className="sr-only">{t('cohort')}</dt>
            <dd className="flex items-center gap-1.5 font-medium text-secondary">
              <GraduationCap aria-hidden="true" className="size-4 shrink-0" />
              {mentor.cohortRole}
            </dd>
          </div>
        ) : null}
      </dl>
      <FlagBadges flags={mentor} />
      <Button variant="secondary" className="mt-auto w-full" aria-haspopup="dialog" aria-label={`${t('viewProfile')}: ${mentor.name}`} onClick={() => onViewProfile(mentor)}>
        {t('viewProfile')}
      </Button>
    </article>
  );
}

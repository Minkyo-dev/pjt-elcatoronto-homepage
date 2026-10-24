'use client';

import {useTranslations} from 'next-intl';
import {Avatar} from '@/components/ui/Avatar';
import {Badge} from '@/components/ui/Badge';
import {Button} from '@/components/ui/Button';
import {Dialog} from '@/components/ui/Dialog';
import {FlagBadges} from '@/components/ui/FlagBadges';
import {cidAttrs, subCid} from '@/lib/utils/cid';
import type {Mentor} from '@/types/mentor';

export function MentorProfileDialog({mentor, onClose, cid}: {mentor: Mentor | null; onClose: () => void; cid?: string}) {
  const t = useTranslations('Mentors');
  return (
    <Dialog open={mentor !== null} onClose={onClose} title={mentor?.name ?? ''} size="lg" cid={cid}>
      {mentor ? (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4" {...cidAttrs(subCid(cid, 1), 'ProfileHeader')}>
            <Avatar name={mentor.name} seed={mentor.slug} size="lg" />
            <div>
              <p className="font-semibold text-text">{mentor.jobTitle}</p>
              <p className="break-words text-muted">{mentor.company}</p>
            </div>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2" {...cidAttrs(subCid(cid, 2), 'ProfileDetails')}>
            <div>
              <dt className="text-sm text-muted">{t('location')}</dt>
              <dd className="font-medium">{mentor.location}</dd>
            </div>
            {mentor.cohortRole ? (
              <div>
                <dt className="text-sm text-muted">{t('cohort')}</dt>
                <dd className="font-medium">{mentor.cohortRole}</dd>
              </div>
            ) : null}
          </dl>
          <p className="max-w-body" {...cidAttrs(subCid(cid, 3), 'ProfileBio')}>
            {mentor.bio}
          </p>
          <div {...cidAttrs(subCid(cid, 4), 'ProfileExpertise')}>
            <h3 className="mb-2 text-sm font-semibold text-text">{t('expertise')}</h3>
            <ul className="flex flex-wrap gap-2">
              {mentor.expertise.map((item) => (
                <li key={item}>
                  <Badge className="normal-case tracking-normal">{item}</Badge>
                </li>
              ))}
            </ul>
          </div>
          {mentor.linkedinUrl ? (
            <Button href={mentor.linkedinUrl} variant="secondary" className="self-start" cid={subCid(cid, 5)}>
              {t('linkedin')}
            </Button>
          ) : null}
          <FlagBadges flags={mentor} cid={subCid(cid, 6)} />
        </div>
      ) : null}
    </Dialog>
  );
}

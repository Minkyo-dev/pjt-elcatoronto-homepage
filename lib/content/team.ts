import 'server-only';
import {team} from '@/data/mock/team';
import {resolveLocalized} from '@/lib/i18n/localize';
import type {Locale} from '@/types/common';
import type {TeamMember} from '@/types/people';

export async function getTeamMembers(locale: Locale): Promise<TeamMember[]> {
  'use cache';
  return resolveLocalized([...team].sort((a, b) => a.order - b.order), locale);
}

import {Avatar} from '@/components/ui/Avatar';
import {FlagBadges} from '@/components/ui/FlagBadges';
import {cidAttrs, itemCid} from '@/lib/utils/cid';
import type {TeamMember} from '@/types/people';

export function TeamGrid({members, cid}: {members: TeamMember[]; cid?: string}) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" {...cidAttrs(cid, 'TeamGrid')}>
      {members.map((member) => (
        <li key={member._id} className="flex items-center gap-4 rounded-card border border-border bg-surface p-6" {...cidAttrs(itemCid(cid), 'TeamCard')}>
          <Avatar name={member.name} seed={member._id} size="lg" photo={member.photo} />
          <div className="min-w-0">
            <h3 className="font-heading text-lg font-bold text-text">{member.name}</h3>
            <p className="text-muted">{member.title}</p>
            <FlagBadges flags={member} className="mt-2" />
          </div>
        </li>
      ))}
    </ul>
  );
}

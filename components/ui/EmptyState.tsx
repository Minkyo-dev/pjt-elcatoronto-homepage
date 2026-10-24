import type {ReactNode} from 'react';
import {cidAttrs} from '@/lib/utils/cid';

type EmptyStateProps = {title: string; body?: string; icon?: ReactNode; action?: ReactNode; cid?: string};

export function EmptyState({title, body, icon, action, cid}: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center gap-3 rounded-card border border-dashed border-border-strong bg-surface px-6 py-12 text-center"
      {...cidAttrs(cid, 'EmptyState')}
    >
      {icon}
      <p className="font-heading text-lg font-semibold text-text">{title}</p>
      {body ? <p className="max-w-body text-muted">{body}</p> : null}
      {action}
    </div>
  );
}

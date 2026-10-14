import type {ReactNode} from 'react';

export function EmptyState({title, body, icon, action}: {title: string; body?: string; icon?: ReactNode; action?: ReactNode}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-border-strong bg-surface px-6 py-12 text-center">
      {icon}
      <p className="font-heading text-lg font-semibold text-text">{title}</p>
      {body ? <p className="max-w-body text-muted">{body}</p> : null}
      {action}
    </div>
  );
}

import type { ReactNode } from 'react';
import { PackageSearch } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-navy-400">
        {icon ?? <PackageSearch className="h-6 w-6" />}
      </div>
      <p className="text-base font-medium text-navy-700">{title}</p>
      {description && <p className="max-w-xs text-sm text-navy-400">{description}</p>}
      {action}
    </div>
  );
}

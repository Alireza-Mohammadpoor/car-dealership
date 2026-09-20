import { CAR_STATUS_LABELS, type CarStatus } from '@/types/car';

const STYLES: Record<CarStatus, string> = {
  available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  reserved: 'bg-amber-50 text-amber-700 border-amber-200',
  sold: 'bg-slate-100 text-slate-600 border-slate-200',
};

const DOT: Record<CarStatus, string> = {
  available: 'bg-emerald-500',
  reserved: 'bg-amber-500',
  sold: 'bg-slate-400',
};

export function StatusBadge({ status }: { status: CarStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${STYLES[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOT[status]}`} />
      {CAR_STATUS_LABELS[status]}
    </span>
  );
}

import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'تأیید',
  cancelLabel = 'انصراف',
  danger = true,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/40 p-4">
      <div className="animate-modal-in w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
              danger ? 'bg-red-50 text-red-600' : 'bg-accent-50 text-accent-600'
            }`}
          >
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-navy-900">{title}</h3>
            {description && <p className="mt-1 text-sm text-navy-500">{description}</p>}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-navy-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${
              danger ? 'bg-red-600 hover:bg-red-700' : 'bg-accent-600 hover:bg-accent-700'
            }`}
          >
            {loading ? 'در حال انجام...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

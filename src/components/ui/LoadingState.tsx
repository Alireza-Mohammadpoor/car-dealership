import { Loader2 } from 'lucide-react';

export function LoadingState({ label = 'در حال بارگذاری...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-navy-400">
      <Loader2 className="h-6 w-6 animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

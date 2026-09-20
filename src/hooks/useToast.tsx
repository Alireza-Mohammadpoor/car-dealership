import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 left-1/2 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4 sm:right-4 sm:left-auto sm:translate-x-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`animate-toast-in flex items-start gap-2 rounded-lg border px-4 py-3 shadow-lg ${
              toast.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : toast.type === 'error'
                ? 'border-red-200 bg-red-50 text-red-800'
                : 'border-slate-200 bg-white text-navy-800'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />}
            {toast.type === 'error' && <XCircle className="mt-0.5 h-5 w-5 shrink-0" />}
            {toast.type === 'info' && <Info className="mt-0.5 h-5 w-5 shrink-0" />}
            <p className="flex-1 text-sm leading-6">{toast.message}</p>
            <button onClick={() => dismiss(toast.id)} className="shrink-0 opacity-60 hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

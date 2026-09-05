import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { cn } from '../../lib/utils';

export const ToastContainer = () => {
  const { toasts, removeToast } = useAppContext();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 p-4 rounded-lg shadow-lg border text-sm transition-all duration-200 animate-in slide-in-from-bottom-5",
              isSuccess && "bg-white text-neutral-900 border-[#c8e6c9]",
              isError && "bg-white text-neutral-900 border-[#ffcdd2]",
              !isSuccess && !isError && "bg-white text-neutral-900 border-neutral-200"
            )}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-[#2e7d32]" />}
              {isError && <AlertTriangle className="w-4 h-4 text-[#c62828]" />}
              {isWarning && <AlertTriangle className="w-4 h-4 text-amber-600" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-4 h-4 text-neutral-700" />}
            </div>

            <div className="flex-1">
              <div className="font-semibold text-xs text-neutral-900">{toast.title}</div>
              {toast.message && (
                <div className="text-xs text-neutral-600 mt-0.5">{toast.message}</div>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-neutral-400 hover:text-neutral-900 rounded-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

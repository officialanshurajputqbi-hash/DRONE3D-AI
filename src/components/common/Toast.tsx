import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const borderColors = {
          success: 'border-l-emerald-500 bg-slate-900/95 text-emerald-400',
          error: 'border-l-red-500 bg-slate-900/95 text-red-400',
          info: 'border-l-blue-500 bg-slate-900/95 text-blue-400',
          warning: 'border-l-amber-500 bg-slate-900/95 text-amber-400',
        };

        const Icon = {
          success: CheckCircle,
          error: AlertCircle,
          info: Info,
          warning: AlertTriangle,
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border border-slate-700/60 border-l-4 shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-right-4 duration-200 ${borderColors[toast.type]}`}
          >
            <Icon className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-100">{toast.title}</p>
              {toast.message && (
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

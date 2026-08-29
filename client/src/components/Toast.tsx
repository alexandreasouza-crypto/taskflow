import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium transition-all duration-300 transform translate-y-0 opacity-100 ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border border-emerald-500/30'
              : toast.type === 'error'
              ? 'bg-rose-950/90 text-rose-200 border border-rose-500/30'
              : 'bg-slate-900/90 text-slate-200 border border-slate-700'
          } backdrop-blur-md`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-teal-400 shrink-0" />}
          
          <span>{toast.message}</span>

          <button
            onClick={() => onRemove(toast.id)}
            className="ml-2 p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

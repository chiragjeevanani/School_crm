import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export const ConfirmDialog = ({ isOpen, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel, variant = 'danger' }) => {
  if (!isOpen) return null;

  const variants = {
    danger: { btn: 'bg-rose-500 hover:bg-rose-600 text-white', icon: 'text-rose-500 bg-rose-500/10' },
    primary: { btn: 'bg-primary hover:bg-primary-hover text-white', icon: 'text-primary bg-primary/10' },
    warning: { btn: 'bg-amber-500 hover:bg-amber-600 text-white', icon: 'text-amber-500 bg-amber-500/10' },
  };

  const style = variants[variant] || variants.danger;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />

      {/* Dialog */}
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-in fade-in zoom-in-95 duration-200">
        {/* Close */}
        <button onClick={onCancel} className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <X className="w-4 h-4" />
        </button>

        <div className={cn("p-3 rounded-2xl w-fit mb-4", style.icon)}>
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-sm font-bold text-foreground mb-1.5">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-border text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={cn("flex-1 py-2.5 rounded-xl text-xs font-semibold transition-colors active:scale-95", style.btn)}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

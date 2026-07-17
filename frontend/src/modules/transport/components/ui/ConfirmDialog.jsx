import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const colorVariants = {
    danger: 'bg-rose-650 hover:bg-rose-700 focus:ring-rose-500 text-white',
    warning: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 text-white',
    info: 'bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-500 text-white',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className={cn(
            "p-2 rounded-xl mt-0.5 shrink-0",
            variant === 'danger' ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20" : "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/20"
          )}>
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-850">
          <button
            onClick={onClose}
            className="h-9 px-4 text-xs font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl transition-all duration-150"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={cn(
              "h-9 px-4 text-xs font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2",
              colorVariants[variant] || colorVariants.info
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

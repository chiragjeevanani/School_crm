import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'danger' }) => {
  const isDanger = variant === 'danger';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <div className="flex items-start gap-3.5">
          <div className={`p-3 rounded-2xl shrink-0 ${isDanger ? 'bg-rose-50 text-rose-650 dark:bg-rose-950/20' : 'bg-violet-50 text-violet-605 dark:bg-violet-950/20'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-850/60">
          <button
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-3.5 py-2 text-xs font-bold text-white rounded-xl shadow-sm ${
              isDanger 
                ? 'bg-rose-600 hover:bg-rose-700' 
                : 'bg-violet-600 hover:bg-violet-750'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default ConfirmDialog;

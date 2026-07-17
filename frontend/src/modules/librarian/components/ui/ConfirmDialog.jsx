import React, { useState } from 'react';
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
  variant = 'danger',
  requireInput = false,
  inputPlaceholder = 'Please enter a reason...',
  inputLabel = 'Reason'
}) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(false);

  const handleConfirm = () => {
    if (requireInput && !inputValue.trim()) {
      setError(true);
      return;
    }
    onConfirm(requireInput ? inputValue : null);
    setInputValue('');
    setError(false);
    onClose();
  };

  const colorVariants = {
    danger: 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500 text-white',
    warning: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 text-white',
    info: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 text-white', // Amber theme
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className={cn(
            "p-2 rounded-xl mt-0.5",
            variant === 'danger' ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20" : "bg-amber-50 text-amber-600 dark:bg-amber-950/20"
          )}>
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {requireInput && (
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {inputLabel} <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (e.target.value.trim()) setError(false);
              }}
              placeholder={inputPlaceholder}
              className={cn(
                "w-full px-3 py-2 border rounded-xl text-sm bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500",
                error ? "border-rose-500 focus:ring-rose-500" : "border-slate-200 dark:border-slate-800"
              )}
            />
            {error && (
              <p className="text-xs text-rose-500">
                This field is required to proceed.
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => {
              setInputValue('');
              setError(false);
              onClose();
            }}
            className="h-10 px-4 text-sm font-semibold border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl transition-all duration-150"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={cn(
              "h-10 px-4 text-sm font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2",
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

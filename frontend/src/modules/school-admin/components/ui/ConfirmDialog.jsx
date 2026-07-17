import React from 'react';
import { Modal } from './Modal';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone. Do you wish to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger'
}) => {
  const getButtonClass = () => {
    switch (confirmVariant) {
      case 'danger':
        return 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500';
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500';
      default:
        return 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500';
    }
  };

  const footer = (
    <>
      <button
        onClick={onClose}
        className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
      >
        {cancelText}
      </button>
      <button
        onClick={() => {
          onConfirm();
          onClose();
        }}
        className={`px-4 py-2 text-sm font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${getButtonClass()}`}
      >
        {confirmText}
      </button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer} size="sm">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {message}
      </p>
    </Modal>
  );
};

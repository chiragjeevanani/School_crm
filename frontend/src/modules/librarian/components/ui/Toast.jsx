import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../../utils/cn';

// Simple global toaster event dispatcher
let toastContainerRef = null;

export const useToast = () => {
  const showToast = (message, type = 'success') => {
    if (toastContainerRef) {
      toastContainerRef(message, type);
    } else {
      console.warn("Toast container not mounted yet");
    }
  };

  return {
    success: (msg) => showToast(msg, 'success'),
    error: (msg) => showToast(msg, 'error'),
    info: (msg) => showToast(msg, 'info')
  };
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    toastContainerRef = addToast;
    return () => {
      toastContainerRef = null;
    };
  }, [addToast]);

  return (
    <>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};

const ToastItem = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-900/30',
      icon: CheckCircle2,
      color: 'text-emerald-800 dark:text-emerald-400'
    },
    error: {
      bg: 'bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-900/30',
      icon: AlertCircle,
      color: 'text-rose-800 dark:text-rose-400'
    },
    info: {
      bg: 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-900/30',
      icon: Info,
      color: 'text-amber-800 dark:text-amber-400'
    }
  };

  const current = config[toast.type] || config.info;
  const Icon = current.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={cn(
        "pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg bg-white dark:bg-slate-900",
        current.bg
      )}
    >
      <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", current.color)} />
      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">
          {toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Error' : 'Notification'}
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
          {toast.message}
        </p>
      </div>
      <button
        onClick={onClose}
        className="text-slate-450 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
};

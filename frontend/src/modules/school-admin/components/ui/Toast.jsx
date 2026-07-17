import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-500 shrink-0" />
  };

  const styles = {
    success: "border-emerald-100 bg-emerald-50 dark:bg-slate-900 dark:border-emerald-500/20 text-slate-800 dark:text-emerald-300",
    error: "border-rose-100 bg-rose-50 dark:bg-slate-900 dark:border-rose-500/20 text-slate-800 dark:text-rose-300",
    warning: "border-amber-100 bg-amber-50 dark:bg-slate-900 dark:border-amber-500/20 text-slate-800 dark:text-amber-300",
    info: "border-sky-100 bg-sky-50 dark:bg-slate-900 dark:border-sky-500/20 text-slate-800 dark:text-sky-300"
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 pointer-events-none flex flex-col gap-2 max-w-sm w-full">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              "pointer-events-auto flex items-center justify-between gap-3 border p-4 rounded-xl shadow-lg transition-colors",
              styles[type]
            )}
          >
            <div className="flex items-center gap-3">
              {icons[type]}
              <p className="text-xs font-semibold">{message}</p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Simple global-like hook creator to avoid complex react portal contexts
export const useToast = () => {
  const [toast, setToast] = React.useState(null);

  const showToast = (message, type = 'success', duration = 3000) => {
    setToast({ message, type, duration });
  };

  const hideToast = () => setToast(null);

  const ToastComponent = () => (
    <Toast
      message={toast?.message}
      type={toast?.type}
      duration={toast?.duration}
      onClose={hideToast}
    />
  );

  return { showToast, ToastComponent };
};

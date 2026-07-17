import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const ToastComponent = () => (
    <AnimatePresence>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
          duration={3000}
        />
      )}
    </AnimatePresence>
  );

  return { showToast, ToastComponent };
};

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-450" />,
    error: <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-455" />,
    info: <Info className="w-4 h-4 text-sky-605 dark:text-sky-450" />
  };

  const styles = {
    success: "border-emerald-100 bg-emerald-50/90 dark:bg-emerald-950/20 dark:border-emerald-900/30 text-emerald-900 dark:text-emerald-200",
    error: "border-rose-100 bg-rose-50/90 dark:bg-rose-955/20 dark:border-rose-900/30 text-rose-900 dark:text-rose-200",
    info: "border-sky-100 bg-sky-50/90 dark:bg-sky-955/20 dark:border-sky-900/30 text-sky-900 dark:text-sky-200"
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg backdrop-blur-md max-w-sm ${styles[type]}`}
      >
        <span className="shrink-0">{icons[type]}</span>
        <span className="text-xs font-bold leading-normal">{message}</span>
        <button
          onClick={onClose}
          className="p-0.5 hover:bg-black/5 dark:hover:bg-white/5 rounded text-slate-400 hover:text-slate-600"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </div>
  );
};
export default useToast;

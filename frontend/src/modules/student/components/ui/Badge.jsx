import React from 'react';
import { cn } from '../../utils/cn';

export const Badge = ({ children, variant = 'info', className }) => {
  const styles = {
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
    info: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
    secondary: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20',
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full select-none",
      styles[variant] || styles.info,
      className
    )}>
      {children}
    </span>
  );
};

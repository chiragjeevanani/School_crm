import React from 'react';
import { cn } from '../../utils/cn';

export const Badge = ({ children, variant = 'default', className }) => {
  const variants = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    danger: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    info: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold tracking-wide",
      variants[variant] || variants.default,
      className
    )}>
      {children}
    </span>
  );
};

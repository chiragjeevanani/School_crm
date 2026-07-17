import React from 'react';
import { cn } from '../../utils/cn';

export const Badge = ({ children, variant = 'default', className }) => {
  const styles = {
    default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-350",
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    info: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400",
    warning: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    danger: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide select-none shrink-0",
      styles[variant] || styles.default,
      className
    )}>
      {children}
    </span>
  );
};
export default Badge;

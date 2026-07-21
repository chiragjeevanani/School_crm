import React from 'react';
import { cn } from './Button';

export const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto rounded-lg border border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md">
    <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
  </div>
));

export const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('[&_tr]:border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50', className)} {...props} />
));

export const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
));

export const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b border-slate-200 dark:border-slate-800 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/40 data-[state=selected]:bg-slate-100 dark:data-[state=selected]:bg-slate-800',
      className
    )}
    {...props}
  />
));

export const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-11 px-4 text-left align-middle font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs border-r border-slate-200 dark:border-slate-800/40 last:border-0',
      className
    )}
    {...props}
  />
));

export const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td ref={ref} className={cn('p-4 align-middle text-slate-800 dark:text-slate-200 border-r border-slate-200/50 dark:border-slate-800/20 last:border-0', className)} {...props} />
));

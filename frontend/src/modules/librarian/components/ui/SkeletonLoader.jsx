import React from 'react';
import { cn } from '../../utils/cn';

export const SkeletonLoader = ({ variant = 'card', rows = 3, className }) => {
  if (variant === 'table') {
    return (
      <div className={cn("space-y-4 w-full", className)}>
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-full animate-pulse" />
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-10 bg-slate-100 dark:bg-slate-850 rounded-lg flex-1 animate-pulse" />
            <div className="h-10 bg-slate-100 dark:bg-slate-850 rounded-lg flex-1 animate-pulse" />
            <div className="h-10 bg-slate-100 dark:bg-slate-850 rounded-lg flex-1 animate-pulse" />
            <div className="h-10 bg-slate-100 dark:bg-slate-850 rounded-lg w-20 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'book') {
    return (
      <div className={cn("border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-4 flex gap-4 animate-pulse", className)}>
        <div className="w-16 h-24 bg-slate-200 dark:bg-slate-850 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 bg-slate-200 dark:bg-slate-850 rounded w-3/4" />
          <div className="h-3 bg-slate-200 dark:bg-slate-850 rounded w-1/2" />
          <div className="h-3 bg-slate-200 dark:bg-slate-850 rounded w-1/4" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-6 space-y-4 animate-pulse", className)}>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-slate-200 dark:bg-slate-850 rounded w-1/3" />
        <div className="h-8 w-8 bg-slate-200 dark:bg-slate-850 rounded-full" />
      </div>
      <div className="h-8 bg-slate-200 dark:bg-slate-850 rounded w-1/2" />
      <div className="h-3 bg-slate-200 dark:bg-slate-850 rounded w-2/3" />
    </div>
  );
};

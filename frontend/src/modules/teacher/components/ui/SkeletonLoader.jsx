import React from 'react';
import { cn } from '../../utils/cn';

export const SkeletonLoader = ({ className, lines = 1, type = 'text' }) => {
  if (type === 'card') {
    return (
      <div className={cn("bg-card border border-border rounded-2xl p-5 shadow-card animate-pulse", className)}>
        <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-xl mb-4" />
        <div className="h-3 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-lg mb-2" />
        <div className="h-5 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className={cn("space-y-3 animate-pulse", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl">
            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4" />
              <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'avatar') {
    return (
      <div className={cn("flex items-center gap-3 animate-pulse", className)}>
        <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2" />
          <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("animate-pulse space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn("h-3 bg-slate-200 dark:bg-slate-800 rounded-lg", i === lines - 1 && "w-2/3")}
        />
      ))}
    </div>
  );
};

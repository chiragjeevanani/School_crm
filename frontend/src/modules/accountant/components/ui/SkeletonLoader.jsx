import React from 'react';
import { cn } from '../../utils/cn';

export const SkeletonLoader = ({ variant = 'card', rows = 3, className }) => {
  if (variant === 'table') {
    return (
      <div className={cn("space-y-4 w-full", className)}>
        <div className="h-9 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse w-full"></div>
        <div className="space-y-2">
          {Array.from({ length: rows }).map((_, idx) => (
            <div key={idx} className="flex gap-4 w-full">
              <div className="h-7 bg-slate-105 dark:bg-slate-800/60 rounded-lg animate-pulse flex-1"></div>
              <div className="h-7 bg-slate-105 dark:bg-slate-800/60 rounded-lg animate-pulse flex-1"></div>
              <div className="h-7 bg-slate-105 dark:bg-slate-800/60 rounded-lg animate-pulse flex-1"></div>
              <div className="h-7 bg-slate-105 dark:bg-slate-800/60 rounded-lg animate-pulse flex-1"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={cn("space-y-2 w-full", className)}>
        <div className="h-4 bg-slate-105 dark:bg-slate-800 rounded animate-pulse w-3/4"></div>
        <div className="h-4 bg-slate-105 dark:bg-slate-800 rounded animate-pulse w-1/2"></div>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 animate-pulse w-full",
      className
    )}>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-slate-105 dark:bg-slate-800 rounded w-1/3"></div>
        <div className="w-8 h-8 rounded-full bg-slate-105 dark:bg-slate-800"></div>
      </div>
      <div className="h-6 bg-slate-105 dark:bg-slate-800 rounded w-1/2"></div>
      <div className="h-3 bg-slate-105 dark:bg-slate-800 rounded w-2/3"></div>
    </div>
  );
};
export default SkeletonLoader;

import React from 'react';
import { cn } from '../../utils/cn';

export const SkeletonLoader = ({ variant = 'card', count = 1, className }) => {
  const renderSkeleton = (index) => {
    switch (variant) {
      case 'table-row':
        return (
          <div key={index} className={cn("animate-pulse flex items-center justify-between py-4 border-b border-slate-200 dark:border-slate-800", className)}>
            <div className="flex items-center space-x-3 w-1/3">
              <div className="rounded-full bg-slate-200 dark:bg-slate-800 h-8 w-8 shrink-0"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
            </div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/6"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/6"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/12"></div>
          </div>
        );
      case 'stat':
        return (
          <div key={index} className={cn("animate-pulse p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between", className)}>
            <div className="space-y-3 w-2/3">
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
            </div>
            <div className="rounded-xl bg-slate-200 dark:bg-slate-800 h-12 w-12 shrink-0"></div>
          </div>
        );
      case 'card':
      default:
        return (
          <div key={index} className={cn("animate-pulse p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4", className)}>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
            </div>
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/3"></div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => renderSkeleton(i))}
    </div>
  );
};

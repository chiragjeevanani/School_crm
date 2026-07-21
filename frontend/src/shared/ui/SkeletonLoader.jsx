import React from 'react';
import { cn } from '../lib/cn';

// Canonical merged SkeletonLoader — superset of gen-2 (HR/accountant/
// librarian/principal/school-admin/transport, prop names `variant`/`rows`)
// and gen-1 (student/teacher/parent, prop names `type`/`lines`/`count`).
// Not currently rendered by any page in any module (verified via repo-wide
// grep), so this favors covering every variant key that was ever defined
// over preserving one exact repetition behavior.
export const SkeletonLoader = ({
  variant,
  type,
  rows,
  lines,
  count,
  className,
}) => {
  const kind = variant || type || 'card';
  const repeat = rows ?? lines ?? count ?? 1;

  switch (kind) {
    case 'table':
      return (
        <div className={cn("space-y-4 w-full", className)}>
          <div className="h-9 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse w-full" />
          <div className="space-y-2">
            {Array.from({ length: rows ?? lines ?? count ?? 3 }).map((_, idx) => (
              <div key={idx} className="flex gap-4 w-full">
                <div className="h-7 bg-slate-100 dark:bg-slate-800/60 rounded-lg animate-pulse flex-1" />
                <div className="h-7 bg-slate-100 dark:bg-slate-800/60 rounded-lg animate-pulse flex-1" />
                <div className="h-7 bg-slate-100 dark:bg-slate-800/60 rounded-lg animate-pulse flex-1" />
                <div className="h-7 bg-slate-100 dark:bg-slate-800/60 rounded-lg animate-pulse flex-1" />
              </div>
            ))}
          </div>
        </div>
      );

    case 'table-row':
      return (
        <>
          {Array.from({ length: repeat }).map((_, i) => (
            <div key={i} className={cn("animate-pulse flex items-center justify-between py-4 border-b border-slate-200 dark:border-slate-800", className)}>
              <div className="flex items-center space-x-3 w-1/3">
                <div className="rounded-full bg-slate-200 dark:bg-slate-800 h-8 w-8 shrink-0" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
              </div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/6" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/6" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/12" />
            </div>
          ))}
        </>
      );

    case 'stat':
      return (
        <div className="space-y-4">
          {Array.from({ length: repeat }).map((_, i) => (
            <div key={i} className={cn("animate-pulse p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between", className)}>
              <div className="space-y-3 w-2/3">
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
              </div>
              <div className="rounded-xl bg-slate-200 dark:bg-slate-800 h-12 w-12 shrink-0" />
            </div>
          ))}
        </div>
      );

    case 'text':
      return (
        <div className={cn("space-y-2 w-full", className)}>
          {Array.from({ length: Math.max(repeat, 2) }).map((_, i, arr) => (
            <div key={i} className={cn("h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse", i === arr.length - 1 ? "w-1/2" : "w-3/4")} />
          ))}
        </div>
      );

    case 'list':
      return (
        <div className={cn("space-y-3 animate-pulse", className)}>
          {Array.from({ length: repeat }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4" />
                <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2" />
              </div>
            </div>
          ))}
        </div>
      );

    case 'avatar':
      return (
        <div className={cn("flex items-center gap-3 animate-pulse", className)}>
          <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2" />
            <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3" />
          </div>
        </div>
      );

    case 'book':
      return (
        <div className={cn("border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-4 flex gap-4 animate-pulse", className)}>
          <div className="w-16 h-24 bg-slate-200 dark:bg-slate-800 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
          </div>
        </div>
      );

    case 'vehicle':
      return (
        <div className={cn("border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-5 flex gap-4 animate-pulse", className)}>
          <div className="w-20 h-16 bg-slate-200 dark:bg-slate-800 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
          </div>
        </div>
      );

    case 'bar':
      return (
        <>
          {Array.from({ length: repeat }).map((_, i) => (
            <div
              key={i}
              className={cn("animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl w-full h-16 mb-3", className)}
            />
          ))}
        </>
      );

    case 'card':
    default:
      return (
        <div className={cn(
          "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 animate-pulse w-full",
          className
        )}>
          <div className="flex justify-between items-center">
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800" />
          </div>
          <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-2/3" />
        </div>
      );
  }
};

export default SkeletonLoader;

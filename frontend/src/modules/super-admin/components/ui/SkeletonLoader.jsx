import React from 'react';
import { cn } from './Button';

export const SkeletonLoader = ({ className, count = 1, ...props }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn('animate-pulse rounded bg-slate-800/80 h-4 w-full', className)}
          {...props}
        />
      ))}
    </>
  );
};

export const EmptyState = ({ title, description, icon: Icon, action }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 p-12 text-center bg-slate-950/20 max-w-lg mx-auto">
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-indigo-400 mb-4 animate-bounce">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-100">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-400 max-w-sm">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

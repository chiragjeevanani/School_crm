import React from 'react';
import { cn } from '../../utils/cn';

export const SkeletonLoader = ({ className, count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl w-full h-16 mb-3",
            className
          )}
        />
      ))}
    </>
  );
};

import React from 'react';
import { FileQuestion } from 'lucide-react';

export const EmptyState = ({ title = "No data found", description = "There is nothing to display here right now.", icon: Icon = FileQuestion }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-2xl bg-slate-50/50 dark:bg-slate-950/20">
      <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 dark:text-slate-500 mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-foreground">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">{description}</p>
    </div>
  );
};

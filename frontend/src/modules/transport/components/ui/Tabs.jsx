import React from 'react';
import { cn } from '../../utils/cn';

export const Tabs = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div className={cn("border-b border-slate-200 dark:border-slate-800 flex gap-2 overflow-x-auto no-scrollbar", className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "py-3 px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition-all duration-150 relative -mb-[2px]",
              isActive
                ? "border-cyan-600 text-cyan-600 dark:border-cyan-400 dark:text-cyan-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn(
                "ml-2 px-1.5 py-0.5 rounded-full text-4xs font-bold",
                isActive 
                  ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300"
                  : "bg-slate-100 text-slate-650 dark:bg-slate-800 dark:text-slate-400"
              )}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

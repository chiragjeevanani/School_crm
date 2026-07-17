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
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "px-4 py-2.5 text-xs font-bold tracking-wide border-b-2 transition-all whitespace-nowrap -mb-px shrink-0 select-none",
              isActive 
                ? "border-rose-600 text-rose-600 dark:text-rose-400" 
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-250"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
export default Tabs;

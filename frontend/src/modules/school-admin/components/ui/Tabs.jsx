import React from 'react';
import { cn } from '../../utils/cn';

export const Tabs = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div className={cn("border-b border-slate-200 dark:border-slate-800 mb-6", className)}>
      <nav className="-mb-px flex space-x-8 overflow-x-auto no-scrollbar" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-all duration-150",
              activeTab === tab.id
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300"
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn(
                "ml-2 py-0.5 px-2 rounded-full text-xs font-semibold",
                activeTab === tab.id
                  ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-400"
                  : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-400"
              )}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

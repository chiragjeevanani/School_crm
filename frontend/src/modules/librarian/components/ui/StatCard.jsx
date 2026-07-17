import React from 'react';
import { cn } from '../../utils/cn';

export const StatCard = ({ title, value, subtitle, icon: Icon, trend, className }) => {
  const isPositive = trend && !trend.startsWith('-');

  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 transition-all duration-200 hover:shadow-md hover:border-amber-200 dark:hover:border-amber-900/50 group",
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-350 transition-colors">
            {title}
          </p>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-950 dark:text-white mt-2 tracking-tight">
            {value}
          </h3>
        </div>
        {Icon && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-xl group-hover:scale-110 transition-transform duration-300">
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
      {(subtitle || trend) && (
        <div className="flex items-center gap-2 mt-4 text-xs">
          {trend && (
            <span className={cn(
              "font-semibold px-2 py-0.5 rounded-full",
              isPositive 
                ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20" 
                : "text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/20"
            )}>
              {trend}
            </span>
          )}
          {subtitle && (
            <span className="text-slate-500 dark:text-slate-400">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

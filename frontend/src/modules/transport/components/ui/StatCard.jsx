import React from 'react';
import { cn } from '../../utils/cn';

export const StatCard = ({ title, value, subtitle, icon: Icon, trend, className }) => {
  const isPositive = trend && !trend.startsWith('-');

  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 transition-all duration-200 hover:shadow-md hover:border-cyan-200 dark:hover:border-cyan-900/50 group",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-450 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-350 transition-colors">
            {title}
          </p>
          <h3 className="text-xl md:text-2xl font-black text-slate-950 dark:text-white tracking-tight">
            {value}
          </h3>
        </div>
        {Icon && (
          <div className="p-2.5 bg-cyan-50 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400 rounded-xl group-hover:scale-105 transition-transform duration-200">
            <Icon className="h-5.5 w-5.5" />
          </div>
        )}
      </div>
      {(subtitle || trend) && (
        <div className="flex items-center gap-1.5 mt-3 text-3xs">
          {trend && (
            <span className={cn(
              "font-bold px-1.5 py-0.5 rounded-md",
              isPositive 
                ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20" 
                : "text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/20"
            )}>
              {trend}
            </span>
          )}
          {subtitle && (
            <span className="text-slate-450 dark:text-slate-400 font-medium">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

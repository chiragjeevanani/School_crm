import React from 'react';
import { cn } from '../../utils/cn';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({ title, value, subtitle, icon: Icon, trend, className }) => {
  const isPositive = trend && !trend.startsWith('-');

  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-extrabold text-slate-450 dark:text-slate-400 uppercase tracking-widest block">
            {title}
          </span>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-none pt-1">
            {value}
          </h3>
        </div>
        {Icon && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450 rounded-2xl">
            <Icon className="w-5 h-5 shrink-0" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-slate-100 dark:border-slate-850/60">
          {trend && (
            <span className={cn(
              "flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold leading-none shrink-0",
              isPositive 
                ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-450" 
                : "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-450"
            )}>
              {isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
              <span>{trend}</span>
            </span>
          )}
          {subtitle && (
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 truncate">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
export default StatCard;

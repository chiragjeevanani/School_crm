import React from 'react';
import { Card } from '../ui/Button';

export const StatCard = ({ title, value, change, trend = 'up', icon: Icon }) => {
  return (
    <Card className="flex items-center justify-between hover:scale-[1.01] transition-transform duration-200">
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{value}</h3>
        {change && (
          <div className="flex items-center gap-1">
            <span
              className={`text-xs font-bold ${
                trend === 'up' ? 'text-emerald-500' : 'text-rose-500'
              }`}
            >
              {trend === 'up' ? '+' : '-'}{change}
            </span>
            <span className="text-[10px] text-slate-505 dark:text-slate-500">vs last month</span>
          </div>
        )}
      </div>
      {Icon && (
        <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-indigo-500 dark:text-indigo-400">
          <Icon className="h-5 w-5" />
        </div>
      )}
    </Card>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const StatCard = ({ title, value, icon: Icon, trend, trendType = 'up', className }) => {
  const isUp = trendType === 'up';
  
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
      className={cn(
        "p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex items-center justify-between",
        className
      )}
    >
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
          {title}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            {value}
          </span>
          {trend && (
            <span className={cn(
              "text-xs font-bold px-1.5 py-0.5 rounded-md",
              isUp 
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
            )}>
              {isUp ? '+' : ''}{trend}
            </span>
          )}
        </div>
      </div>
      
      {Icon && (
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
          <Icon className="w-6 h-6" />
        </div>
      )}
    </motion.div>
  );
};

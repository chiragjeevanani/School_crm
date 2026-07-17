import React from 'react';
import { cn } from '../../utils/cn';

export const StatCard = ({ title, value, subtext, icon: Icon, colorClass, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-card border border-border rounded-2xl p-4 shadow-card flex flex-col gap-3",
        onClick && "cursor-pointer hover:border-primary/20 hover:shadow-premium transition-all duration-150 active:scale-[0.98] select-none"
      )}
    >
      <div className={cn("p-2.5 rounded-xl w-fit text-white", colorClass)}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-none mb-1.5">
          {title}
        </p>
        <p className="text-lg font-black text-foreground leading-none">{value}</p>
        {subtext && (
          <p className="text-[10px] text-slate-400 font-medium mt-1">{subtext}</p>
        )}
      </div>
    </div>
  );
};

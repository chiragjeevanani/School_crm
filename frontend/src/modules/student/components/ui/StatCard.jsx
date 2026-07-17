import React from 'react';
import { Card } from './Card';
import { cn } from '../../utils/cn';

export const StatCard = ({ title, value, subtext, icon: Icon, colorClass, onClick, className }) => {
  return (
    <Card 
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 relative overflow-hidden group",
        onClick && "cursor-pointer active:scale-95 duration-100",
        className
      )}
    >
      <div className={cn("p-3 rounded-xl text-white transition-transform group-hover:scale-110", colorClass || "bg-primary")}>
        {Icon && <Icon className="w-5 h-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase truncate">{title}</p>
        <h4 className="text-lg font-bold mt-0.5 truncate">{value}</h4>
        {subtext && <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 block truncate">{subtext}</span>}
      </div>
    </Card>
  );
};

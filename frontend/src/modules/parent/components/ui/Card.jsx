import React from 'react';
import { cn } from '../../utils/cn';

export const Card = ({ children, className, onClick, ...props }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-card border border-border rounded-2xl p-5 shadow-card",
        onClick && "cursor-pointer hover:border-primary/20 hover:shadow-premium transition-all duration-150 active:scale-[0.99]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

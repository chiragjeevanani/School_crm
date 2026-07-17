import React from 'react';
import { cn } from '../../utils/cn';

export const Card = ({ className, children, hoverEffect = true, ...props }) => {
  return (
    <div
      className={cn(
        "bg-card border border-border text-card-foreground rounded-2xl p-5 shadow-card transition-all duration-200",
        hoverEffect && "hover:shadow-premium hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

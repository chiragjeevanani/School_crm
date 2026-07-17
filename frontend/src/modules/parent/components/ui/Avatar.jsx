import React from 'react';
import { cn } from '../../utils/cn';

export const Avatar = ({ src, name, size = 'md', className }) => {
  const initials = name
    ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '??';

  const sizes = {
    xs: 'w-6 h-6 text-[9px]',
    sm: 'w-8 h-8 text-[10px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-16 h-16 text-base',
  };

  return (
    <div className={cn(
      "rounded-2xl overflow-hidden bg-primary/10 text-primary border border-border flex items-center justify-center font-bold shrink-0 select-none",
      sizes[size] || sizes.md,
      className
    )}>
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

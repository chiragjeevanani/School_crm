import React from 'react';
import { cn } from '../../utils/cn';

export const Avatar = ({ src, name, size = 'md', className }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  };

  const initials = name
    ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const colors = [
    'bg-primary text-white',
    'bg-emerald-500 text-white',
    'bg-violet-500 text-white',
    'bg-amber-500 text-white',
    'bg-rose-500 text-white',
    'bg-sky-500 text-white',
  ];

  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("rounded-xl object-cover border border-border", sizes[size], className)}
        onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
      />
    );
  }

  return (
    <div className={cn("rounded-xl flex items-center justify-center font-bold shrink-0", sizes[size], colors[colorIndex], className)}>
      {initials}
    </div>
  );
};

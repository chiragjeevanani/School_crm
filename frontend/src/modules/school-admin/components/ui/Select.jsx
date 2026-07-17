import React from 'react';
import { cn } from '../../utils/cn';

export const Select = ({ label, options, value, onChange, className, error, ...props }) => {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className={cn(
          "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors",
          error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500",
          "appearance-none bg-no-repeat bg-[right_0.875rem_center] bg-[length:1em_1em]",
          // Simple custom styling arrow SVG using inline background image data
          "bg-[image:url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')]"
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-rose-500 font-medium">{error}</p>
      )}
    </div>
  );
};

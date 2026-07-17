import React from 'react';
import { cn } from '../../utils/cn';

export const Select = ({ label, options, value, onChange, className }) => {
  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <label className="block text-[11px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider select-none">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-880 focus:border-rose-600 focus:ring-1 focus:ring-rose-600 focus:outline-none transition-colors cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
export default Select;

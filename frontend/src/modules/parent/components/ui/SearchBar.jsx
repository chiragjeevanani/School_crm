import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export const SearchBar = ({ value, onChange, placeholder = 'Search...', className, onClear }) => {
  return (
    <div className={cn("relative flex items-center", className)}>
      <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-border bg-card text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-slate-400 transition-all"
        id="parent-search-input"
      />
      {value && (
        <button
          onClick={() => { onChange(''); onClear?.(); }}
          className="absolute right-3 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

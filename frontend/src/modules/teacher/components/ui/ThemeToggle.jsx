import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTeacherTheme } from '../../context/TeacherThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTeacherTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
      aria-label="Toggle theme"
      id="teacher-theme-toggle"
    >
      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};

import React, { createContext, useState, useEffect, useContext } from 'react';

const TeacherThemeContext = createContext();

export const TeacherThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('teacher-theme') || 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('teacher-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <TeacherThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </TeacherThemeContext.Provider>
  );
};

export const useTeacherTheme = () => useContext(TeacherThemeContext);

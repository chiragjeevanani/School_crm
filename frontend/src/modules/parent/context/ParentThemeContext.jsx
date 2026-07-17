import React, { createContext, useState, useEffect, useContext } from 'react';

const ParentThemeContext = createContext();

export const ParentThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('parent-theme') || 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('parent-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ParentThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ParentThemeContext.Provider>
  );
};

export const useParentTheme = () => useContext(ParentThemeContext);

import React, { createContext, useContext, useState, useEffect } from 'react';

const SuperAdminThemeContext = createContext(null);

export const SuperAdminThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('super_admin_theme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('super_admin_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <SuperAdminThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </SuperAdminThemeContext.Provider>
  );
};

export const useSuperAdminTheme = () => {
  const context = useContext(SuperAdminThemeContext);
  if (!context) {
    throw new Error('useSuperAdminTheme must be used within a SuperAdminThemeProvider');
  }
  return context;
};

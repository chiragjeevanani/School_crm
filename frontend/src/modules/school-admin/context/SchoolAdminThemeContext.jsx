import React, { createContext, useState, useContext, useEffect } from 'react';

const SchoolAdminThemeContext = createContext();

export const SchoolAdminThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('school-admin-theme') === 'dark' || 
                   (!localStorage.getItem('school-admin-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('school-admin-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('school-admin-theme', 'light');
    }
  };

  return (
    <SchoolAdminThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </SchoolAdminThemeContext.Provider>
  );
};

export const useSchoolAdminTheme = () => useContext(SchoolAdminThemeContext);

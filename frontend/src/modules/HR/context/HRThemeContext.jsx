import React, { createContext, useState, useContext, useEffect } from 'react';

const HRThemeContext = createContext();

export const HRThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('hr-theme');
    return saved ? saved === 'dark' : false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('hr-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('hr-theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <HRThemeContext.Provider value={{ darkMode, toggleTheme, toggleDarkMode }}>
      {children}
    </HRThemeContext.Provider>
  );
};

export const useHRTheme = () => useContext(HRThemeContext);
export default HRThemeContext;

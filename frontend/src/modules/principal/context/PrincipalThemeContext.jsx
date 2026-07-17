import React, { createContext, useState, useContext, useEffect } from 'react';

const PrincipalThemeContext = createContext();

export const PrincipalThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('principal-theme');
    return saved ? saved === 'dark' : false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('principal-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('principal-theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <PrincipalThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </PrincipalThemeContext.Provider>
  );
};

export const usePrincipalTheme = () => useContext(PrincipalThemeContext);
export default PrincipalThemeContext;

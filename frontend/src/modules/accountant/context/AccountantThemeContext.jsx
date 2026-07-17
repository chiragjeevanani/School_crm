import React, { createContext, useState, useContext, useEffect } from 'react';

const AccountantThemeContext = createContext();

export const AccountantThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('accountant-theme');
    return saved ? saved === 'dark' : false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('accountant-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('accountant-theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <AccountantThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </AccountantThemeContext.Provider>
  );
};

export const useAccountantTheme = () => useContext(AccountantThemeContext);
export default AccountantThemeContext;

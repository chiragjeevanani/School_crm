import React, { createContext, useState, useContext, useEffect } from 'react';

const TransportThemeContext = createContext();

export const TransportThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('transport_darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('transport_darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <TransportThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </TransportThemeContext.Provider>
  );
};

export const useTransportTheme = () => {
  const context = useContext(TransportThemeContext);
  if (!context) {
    throw new Error('useTransportTheme must be used within a TransportThemeProvider');
  }
  return context;
};

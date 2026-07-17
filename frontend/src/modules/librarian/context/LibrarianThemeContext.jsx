import React, { createContext, useState, useContext, useEffect } from 'react';

const LibrarianThemeContext = createContext();

export const LibrarianThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('librarian_darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('librarian_darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <LibrarianThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </LibrarianThemeContext.Provider>
  );
};

export const useLibrarianTheme = () => {
  const context = useContext(LibrarianThemeContext);
  if (!context) {
    throw new Error('useLibrarianTheme must be used within a LibrarianThemeProvider');
  }
  return context;
};

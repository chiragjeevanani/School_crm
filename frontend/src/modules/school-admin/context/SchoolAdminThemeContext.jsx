import React, { createContext, useState, useContext, useLayoutEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
  applySchoolAdminAccent,
  DEFAULT_PRIMARY,
  normalizeHex,
} from '../utils/themeColors';
import '../styles/theme.css';

const SchoolAdminThemeContext = createContext();

function applyThemeClass(isDark) {
  if (isDark) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('school-admin-theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('school-admin-theme', 'light');
  }
}

export const SchoolAdminThemeProvider = ({ children }) => {
  const location = useLocation();
  const isSchoolAdmin = location.pathname.startsWith('/school-admin');
  const [darkMode, setDarkMode] = useState(false);
  const [primaryColor, setPrimaryColorState] = useState(() =>
    normalizeHex(localStorage.getItem('school-admin-accent') || DEFAULT_PRIMARY)
  );

  useLayoutEffect(() => {
    const isDark =
      localStorage.getItem('school-admin-theme') === 'dark' ||
      (!localStorage.getItem('school-admin-theme') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    if (isSchoolAdmin) applyThemeClass(isDark);
  }, [isSchoolAdmin]);

  useLayoutEffect(() => {
    applySchoolAdminAccent(primaryColor, isSchoolAdmin);
  }, [primaryColor, isSchoolAdmin]);

  const setTheme = useCallback((theme) => {
    const isDark = theme === 'dark';
    setDarkMode(isDark);
    applyThemeClass(isDark);
  }, []);

  const setAccentColor = useCallback(
    (hex) => {
      const next = normalizeHex(hex);
      setPrimaryColorState(next);
      localStorage.setItem('school-admin-accent', next);
      if (isSchoolAdmin) applySchoolAdminAccent(next, true);
    },
    [isSchoolAdmin]
  );

  const toggleTheme = useCallback(() => {
    setDarkMode((current) => {
      const next = !current;
      applyThemeClass(next);
      return next;
    });
  }, []);

  return (
    <SchoolAdminThemeContext.Provider
      value={{ darkMode, toggleTheme, setTheme, primaryColor, setAccentColor }}
    >
      {children}
    </SchoolAdminThemeContext.Provider>
  );
};

export const useSchoolAdminTheme = () => useContext(SchoolAdminThemeContext);

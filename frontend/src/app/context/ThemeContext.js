"use client";

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

const themeInitializationScript = `
  (() => {
    const storedTheme = localStorage.getItem('theme');
    const isDark = storedTheme
      ? storedTheme === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', isDark);
  })();
`;

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(null);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  useEffect(() => {
    if (isDarkMode === null) return;

    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((currentTheme) => currentTheme === null
      ? !document.documentElement.classList.contains('dark')
      : !currentTheme);
  };

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: themeInitializationScript }} />
      <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    </>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

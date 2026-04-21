import React, { createContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    // Initialize theme from localStorage
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') {
        setTheme(stored);
        applyThemeToDOM(stored);
      } else {
        // Default to dark and apply
        applyThemeToDOM('dark');
      }
    } catch (err) {
      console.error('Failed to read theme from localStorage:', err);
      applyThemeToDOM('dark');
    }
  }, []);

  useEffect(() => {
    // Apply theme to DOM whenever theme state changes
    applyThemeToDOM(theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (err) {
      console.error('Failed to write theme to localStorage:', err);
    }
  }, [theme]);

  function applyThemeToDOM(t: Theme) {
    const htmlElement = document.documentElement;
    if (t === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }

  const value: ThemeContextType = {
    theme,
    toggleTheme: () => setTheme(prev => prev === 'light' ? 'dark' : 'light'),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}


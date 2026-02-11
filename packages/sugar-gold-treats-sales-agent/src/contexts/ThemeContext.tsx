'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeType, ThemeConfig, getTheme, getDefaultTheme } from '@/lib/themes';

interface ThemeContextType {
  currentTheme: ThemeConfig;
  setTheme: (themeId: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'demo-platform-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(getDefaultTheme());

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeType;
    if (savedTheme) {
      setCurrentTheme(getTheme(savedTheme));
    }
  }, []);

  const setTheme = (themeId: ThemeType) => {
    const newTheme = getTheme(themeId);
    setCurrentTheme(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

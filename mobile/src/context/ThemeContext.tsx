import React, { createContext, useContext, useState, useEffect } from 'react';
import { sfx } from '../utils/sfx';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isSfxEnabled: boolean;
  toggleSfx: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
  isSfxEnabled: true,
  toggleSfx: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSfxEnabled, setIsSfxEnabled] = useState<boolean>(() => sfx.isEnabled());

  // Clean up any remaining dark mode classes and preferences
  useEffect(() => {
    document.documentElement.classList.remove('dark-mode');
    document.body.classList.remove('dark-mode');
    localStorage.removeItem('palash_theme');
  }, []);

  const toggleDarkMode = () => {
    // Disabled as per user request
  };

  const toggleSfx = () => {
    const next = sfx.toggleSound();
    setIsSfxEnabled(next);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode: false, toggleDarkMode, isSfxEnabled, toggleSfx }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

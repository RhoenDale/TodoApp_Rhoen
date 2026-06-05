import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type AppColorScheme = 'light' | 'dark';

type ThemeContextValue = {
  colorScheme: AppColorScheme;
  isDarkMode: boolean;
  setDarkMode: (enabled: boolean) => Promise<void>;
};

const DARK_MODE_STORAGE_KEY = 'darkModePreference';

const ThemeContext = createContext<ThemeContextValue>({
  colorScheme: 'light',
  isDarkMode: false,
  setDarkMode: async () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const storedPreference = await AsyncStorage.getItem(DARK_MODE_STORAGE_KEY);
      setIsDarkMode(storedPreference === 'true');
    };

    loadTheme();
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      colorScheme: isDarkMode ? 'dark' : 'light',
      isDarkMode,
      setDarkMode: async (enabled: boolean) => {
        setIsDarkMode(enabled);
        await AsyncStorage.setItem(DARK_MODE_STORAGE_KEY, String(enabled));
      },
    }),
    [isDarkMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useAppTheme = () => useContext(ThemeContext);

export const useAppColorScheme = () => useAppTheme().colorScheme;

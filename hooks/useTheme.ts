import { ThemeMode } from '@/constants';
import { getStorageItem, setStorageItem } from '@/lib/storage';
import { useEffect, useState } from 'react';

const APP_THEME = 'app_theme';

// Премахвам старите функции и използвам новите
// Заменям THEME_STORAGE_KEY с STORAGE_KEYS.APP_THEME

export function useTheme() {
  const [colorMode, setColorMode] = useState<ThemeMode.LIGHT | ThemeMode.DARK>(
    ThemeMode.LIGHT
  );

  // Load theme from storage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await getStorageItem(APP_THEME);
        if (savedTheme === ThemeMode.DARK || savedTheme === ThemeMode.LIGHT) {
          setColorMode(savedTheme as ThemeMode.LIGHT | ThemeMode.DARK);
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    };

    loadTheme();
  }, []);

  // Save theme to storage when it changes
  const handleThemeChange = async (
    newTheme: ThemeMode.LIGHT | ThemeMode.DARK
  ) => {
    try {
      setColorMode(newTheme);
      await setStorageItem(APP_THEME, newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  return {
    colorMode,
    handleThemeChange,
  };
}

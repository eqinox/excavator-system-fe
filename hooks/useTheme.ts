import { ThemeMode } from '@/constants';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

const THEME_STORAGE_KEY = 'app_theme';

// Platform-specific storage functions
const getThemeFromStorage = async (): Promise<string | null> => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } else {
    return SecureStore.getItemAsync(THEME_STORAGE_KEY);
  }
};

const saveThemeToStorage = async (theme: string): Promise<void> => {
  if (Platform.OS === 'web') {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } else {
    await SecureStore.setItemAsync(THEME_STORAGE_KEY, theme);
  }
};

export function useTheme() {
  const [colorMode, setColorMode] = useState<ThemeMode.LIGHT | ThemeMode.DARK>(
    ThemeMode.LIGHT
  );

  // Load theme from storage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await getThemeFromStorage();
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
      await saveThemeToStorage(newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  return {
    colorMode,
    handleThemeChange,
  };
}

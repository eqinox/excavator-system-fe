import { ThemeMode } from "@/constants";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import React, { createContext, useContext, useEffect, useState } from "react";

const APP_THEME = "app_theme";

interface ThemeContextType {
  colorMode: ThemeMode.LIGHT | ThemeMode.DARK;
  handleThemeChange: (
    newTheme: ThemeMode.LIGHT | ThemeMode.DARK
  ) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
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
        console.error("Failed to load theme:", error);
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
      console.error("Failed to save theme:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ colorMode, handleThemeChange }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

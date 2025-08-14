import { Fab, FabIcon } from '@/components/ui/fab';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { MoonIcon, SunIcon } from '@/components/ui/icon';
import { ThemeMode } from '@/constants';
import '@/global.css';
import { useTheme } from '@/hooks/useTheme';
import { AuthProvider } from '@/lib/authContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { colorMode, handleThemeChange } = useTheme();

  return (
    <AuthProvider>
      <GluestackUIProvider mode={colorMode}>
        <ThemeProvider
          value={colorMode === ThemeMode.DARK ? DarkTheme : DefaultTheme}
        >
          <Slot />
          <Fab
            onPress={() =>
              handleThemeChange(
                colorMode === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK
              )
            }
            className='m-6'
            size='lg'
          >
            <FabIcon as={colorMode === ThemeMode.DARK ? MoonIcon : SunIcon} />
          </Fab>
        </ThemeProvider>
      </GluestackUIProvider>
    </AuthProvider>
  );
}

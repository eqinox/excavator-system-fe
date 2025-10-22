import { Center } from "@/components/ui/center";
import { Fab, FabIcon } from "@/components/ui/fab";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { MoonIcon, SunIcon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { ThemeMode } from "@/constants";
import "@/global.css";
import { useTheme } from "@/hooks/useTheme";
import { AppDispatch, RootState, initializeAuth, store } from "@/store";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
// import AppLoading from 'expo-app-loading';
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Provider, useDispatch, useSelector } from "react-redux";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
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

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // if (isLoading) {
  //   return <AppLoading />;
  // }

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <RootLayoutNav />
      </Provider>
    </SafeAreaProvider>
  );
}

function RootLayoutNav() {
  const { colorMode, handleThemeChange } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [authInitialized, setAuthInitialized] = useState(false);
  useEffect(() => {
    // Initialize auth state when the app starts
    dispatch(initializeAuth());
  }, [dispatch]);

  // Track when authentication initialization is complete
  useEffect(() => {
    if (!isLoading && isAuthenticated !== null) {
      setAuthInitialized(true);
    }
  }, [isLoading, isAuthenticated]);

  // Show loading screen while checking authentication or until auth is fully initialized
  if (isLoading || !authInitialized) {
    return (
      <GluestackUIProvider mode={colorMode}>
        <ThemeProvider
          value={colorMode === ThemeMode.DARK ? DarkTheme : DefaultTheme}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <Center className="flex-1">
              <Spinner size="large" />
              <Text className="mt-4">Loading...</Text>
            </Center>
          </SafeAreaView>
        </ThemeProvider>
      </GluestackUIProvider>
    );
  }
  return (
    <GluestackUIProvider mode={colorMode}>
      <ThemeProvider
        value={colorMode === ThemeMode.DARK ? DarkTheme : DefaultTheme}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <Slot />
          <Fab
            onPress={() =>
              handleThemeChange(
                colorMode === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK
              )
            }
            className="m-6"
            size="lg"
          >
            <FabIcon as={colorMode === ThemeMode.DARK ? MoonIcon : SunIcon} />
          </Fab>
        </SafeAreaView>
      </ThemeProvider>
    </GluestackUIProvider>
  );
}

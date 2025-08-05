import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import "react-native-reanimated";

import { AuthProvider } from "@/lib/authContext";

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <AuthProvider>
      <GluestackUIProvider mode="system">
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="categories"
            options={{ headerShown: true, headerTitle: "" }}
          />
          <Stack.Screen
            name="equipments"
            options={{ headerShown: true, headerTitle: "" }}
          />
          <Stack.Screen name="equipment" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </GluestackUIProvider>
    </AuthProvider>
  );
}

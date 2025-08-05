import { OverlayProvider } from "@gluestack-ui/overlay";
import { ToastProvider } from "@gluestack-ui/toast";
import { useColorScheme } from "nativewind";
import React, { useEffect } from "react";
import { View, ViewProps } from "react-native";
import { config } from "./config";

export type ModeType = "light" | "dark" | "system";

export function GluestackUIProvider({
  mode = "system",
  ...props
}: {
  mode?: ModeType;
  children?: React.ReactNode;
  style?: ViewProps["style"];
}) {
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Default to light theme if colorScheme is undefined
  const currentTheme = colorScheme || "light";

  return (
    <View
      style={[
        config[currentTheme],
        {
          flex: 1,
          height: "100%",
          width: "100%",
          backgroundColor: "rgb(var(--color-background-0))",
        },
        props.style,
      ]}
    >
      <OverlayProvider>
        <ToastProvider>{props.children}</ToastProvider>
      </OverlayProvider>
    </View>
  );
}

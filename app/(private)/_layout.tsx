import BottomNavigation from "@/components/BottomNavigation";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { RootState } from "@/store";
import { Redirect, Slot } from "expo-router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function PrivateLayout() {
  const isAuthenticated = useSelector((state: RootState) => {
    return state.auth.isAuthenticated;
  });

  useEffect(() => {
    // This effect will trigger re-renders when auth state changes
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    // If not authenticated, redirect to auth screen
    return <Redirect href="/(public)/auth" />;
  }

  return (
    <Box className="flex-1 relative max-w-7xl lg:mx-auto">
      <VStack className="flex-1 items-center justify-start px-4 pb-20">
        <Slot />
      </VStack>
      <BottomNavigation />
    </Box>
  );
}

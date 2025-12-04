import UserMenu from "@/components/UserMenu";
import { Box } from "@/components/ui/box";
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
    <Box className="flex-1 relative">
      <UserMenu />
      <Slot />
    </Box>
  );
}

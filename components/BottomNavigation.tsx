import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { MaterialIcons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import UserMenu from "./UserMenu";

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isCategoriesActive =
    pathname?.includes("/categories") || pathname === "/";

  const handleCategoriesPress = () => {
    router.push("/categories");
  };

  return (
    <Box
      className="absolute bottom-0 left-0 right-0 bg-background-0 border-t border-outline-200 shadow-lg z-30"
      style={{ paddingBottom: insets.bottom }}
    >
      <HStack className="justify-around items-center" style={{ minHeight: 60 }}>
        {/* Categories Tab */}
        <Pressable
          onPress={handleCategoriesPress}
          className="flex-1 items-center justify-center py-2"
        >
          <VStack space="xs" className="items-center">
            <MaterialIcons
              name="category"
              size={24}
              color={isCategoriesActive ? "#3b82f6" : "#6b7280"}
            />
            <Text
              className={`text-xs ${
                isCategoriesActive
                  ? "text-primary-600 font-semibold"
                  : "text-typography-500"
              }`}
            >
              Категории
            </Text>
          </VStack>
        </Pressable>

        {/* User Tab */}
        <Box className="flex-1 items-center justify-center py-2 relative">
          <UserMenu />
        </Box>
      </HStack>
    </Box>
  );
}

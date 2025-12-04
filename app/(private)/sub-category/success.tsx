import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function SubCategorySuccess() {
  const router = useRouter();
  const { type, categoryId } = useLocalSearchParams<{
    type: string;
    categoryId: string;
  }>();

  const handleGoToSubCategories = () => {
    if (categoryId) {
      router.replace(`/sub-category?id=${categoryId}`);
    } else {
      router.replace("/categories");
    }
  };

  return (
    <Box className="min-h-screen flex-1 bg-background-300">
      <Box className="flex-1 items-center justify-center px-4 py-4">
        <Card className="w-full max-w-md bg-background-0 p-6 shadow-lg">
          <VStack space="lg" className="w-full items-center">
            {/* Success Icon */}
            <Box className="mb-4">
              <Text className="text-6xl">✓</Text>
            </Box>

            {/* Success Message */}
            <VStack space="sm" className="items-center">
              <Text className="text-2xl font-bold text-typography-900 text-center">
                Подкатегорията е създадена успешно
              </Text>
              {type && (
                <Text className="text-lg text-typography-600 text-center">
                  {type}
                </Text>
              )}
            </VStack>

            {/* Navigation Button */}
            <Button className="w-full mt-4" onPress={handleGoToSubCategories}>
              <ButtonText>Назад към списъка</ButtonText>
            </Button>
          </VStack>
        </Card>
      </Box>
    </Box>
  );
}

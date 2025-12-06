import MyEquipmentsList from "@/components/lists/MyEquipmentsList";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { AppDispatch, RootState, fetchEquipmentsByOwnerId } from "@/store";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function MyEquipments() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { equipments, isLoading, error } = useSelector(
    (state: RootState) => state.equipments
  );

  const userId = user?.id;

  useEffect(() => {
    console.log("MyEquipments useEffect triggered");
    console.log("User:", user);
    console.log("User ID:", userId);

    if (userId) {
      console.log("Dispatching fetchEquipmentsByOwnerId with ownerId:", userId);
      dispatch(fetchEquipmentsByOwnerId(userId));
    } else {
      console.warn("User ID not available - cannot fetch equipments");
    }
  }, [dispatch, userId]);

  return (
    <ScrollView
      className="flex-1 w-full"
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={true}
    >
      <VStack space="xl" className="w-full max-w-4xl">
        <VStack space="md" className="mb-4 mt-4">
          <HStack className="justify-between items-center">
            <Text className="text-2xl font-bold text-typography-900">
              Моите оборудвания
            </Text>
            <Button variant="outline" onPress={() => router.back()}>
              <ButtonText>← Назад</ButtonText>
            </Button>
          </HStack>
        </VStack>

        <VStack space="xl" className="w-full max-w-4xl">
          <VStack space="lg" className="w-full">
            {!user?.id && (
              <Text className="text-center text-lg font-medium text-yellow-600">
                Зареждане на потребителска информация...
              </Text>
            )}

            {user?.id && isLoading && (
              <Text className="text-center text-lg font-medium">
                Зареждане на оборудвания...
              </Text>
            )}

            {error && (
              <Text className="text-center text-lg font-medium text-red-500">
                Грешка: {error}
              </Text>
            )}

            {user?.id && !isLoading && !error && <MyEquipmentsList />}
          </VStack>
        </VStack>
      </VStack>
    </ScrollView>
  );
}

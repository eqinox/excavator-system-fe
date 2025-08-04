import ProtectedRoute from "@/components/ProtectedRoute";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { BASE_URL } from "@/constants";
import { apiClient, EquipmentResponse } from "@/lib/api";
import { useAuth } from "@/lib/authContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image } from "react-native";

export default function Equipments() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { accessToken } = useAuth();
  const [equipments, setEquipments] = useState<EquipmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.authenticatedRequest<
          EquipmentResponse[]
        >(`/equipment/category/${id}`, { method: "GET" }, accessToken || "");
        console.log("equipments", response);
        setEquipments(response);
      } catch (error) {
        console.error(error);
        setError("Failed to load equipments");
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchEquipments();
    }
  }, [accessToken]);

  const handleCreateEquipment = () => {
    router.push({
      pathname: "/equipment/create",
      params: {
        categoryId: id,
      },
    });
  };

  return (
    <ProtectedRoute>
      <VStack className="flex-1 px-4 justify-start">
        <VStack space="xl" className="w-full max-w-4xl">
          <VStack space="md" className="mt-4 mb-4">
            <HStack className="justify-end">
              <Button variant="outline" onPress={() => handleCreateEquipment()}>
                <Text>Публикувай оборудване</Text>
              </Button>
            </HStack>
          </VStack>

          <VStack space="xl" className="w-full max-w-4xl">
            <VStack space="lg" className="w-full">
              <HStack space="md" className="flex-wrap justify-center">
                {equipments.map((equipment, index) => (
                  <VStack key={index} space="sm" className="items-center">
                    <Box className="w-48 h-48 bg-primary rounded-lg flex items-center justify-center shadow-md overflow-hidden">
                      {equipment.images && (
                        <Image
                          source={{
                            uri: `${BASE_URL}/images/${equipment.images[0].small}`,
                          }}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      )}
                    </Box>
                    <Text className="text-center font-medium text-sm max-w-24">
                      {equipment.name}
                    </Text>
                  </VStack>
                ))}

                {equipments.length === 0 && (
                  <Text className="text-center font-medium text-lg">
                    Няма налично оборудване
                  </Text>
                )}
              </HStack>
            </VStack>
          </VStack>
        </VStack>
      </VStack>
    </ProtectedRoute>
  );
}

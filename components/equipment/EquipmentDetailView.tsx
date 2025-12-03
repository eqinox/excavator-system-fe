import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { BASE_URL } from "@/constants";
import { EquipmentResponseDto } from "@/dto/equipment.dto";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native";

interface EquipmentDetailViewProps {
  equipment: EquipmentResponseDto;
}

export default function EquipmentDetailView({
  equipment,
}: EquipmentDetailViewProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <Box className="min-h-screen flex-1 bg-background-300">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Box className="flex-1 items-center justify-center px-4 py-4">
          <Card className="w-full max-w-2xl bg-background-0 p-6 shadow-lg">
            <VStack space="lg" className="w-full">
              {/* Header with Back Button */}
              <HStack className="items-center justify-between mb-4">
                <Button variant="ghost" size="sm" onPress={handleBack}>
                  <ButtonText>← Назад</ButtonText>
                </Button>
                <Text className="text-2xl font-bold text-typography-900 flex-1 text-center">
                  Детайли за оборудване
                </Text>
                <Box className="w-16" />
              </HStack>

              {/* Image Gallery */}
              {equipment.images && equipment.images.length > 0 && (
                <VStack space="sm" className="w-full mb-4">
                  <Text className="text-lg font-semibold text-typography-900">
                    Изображения
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="w-full"
                  >
                    <HStack space="md" className="px-1">
                      {equipment.images.map((image, index) => (
                        <Box
                          key={index}
                          className="h-64 w-64 rounded-lg overflow-hidden mr-2"
                        >
                          <Image
                            source={{
                              uri: `${BASE_URL}/${image.original}`,
                            }}
                            alt={`${equipment.name} - Image ${index + 1}`}
                            className="h-full w-full"
                            resizeMode="cover"
                          />
                        </Box>
                      ))}
                    </HStack>
                  </ScrollView>
                </VStack>
              )}

              {/* Equipment Details */}
              <VStack space="md" className="w-full">
                {/* Name */}
                <VStack space="xs">
                  <Text className="text-sm font-medium text-typography-600">
                    Име на оборудването
                  </Text>
                  <Text className="text-2xl font-bold text-typography-900">
                    {equipment.name}
                  </Text>
                </VStack>

                {/* Description */}
                <VStack space="xs">
                  <Text className="text-sm font-medium text-typography-600">
                    Описание
                  </Text>
                  <Text className="text-base text-typography-700 leading-6">
                    {equipment.description}
                  </Text>
                </VStack>

                {/* Price and Availability */}
                <HStack space="lg" className="flex-wrap">
                  <VStack space="xs" className="flex-1 min-w-[150px]">
                    <Text className="text-sm font-medium text-typography-600">
                      Цена на ден
                    </Text>
                    <Text className="text-xl font-bold text-primary-600">
                      {equipment.pricePerDay} лв/ден
                    </Text>
                  </VStack>

                  <VStack space="xs" className="flex-1 min-w-[150px]">
                    <Text className="text-sm font-medium text-typography-600">
                      Наличност
                    </Text>
                    <Box
                      className={`px-3 py-1 rounded-full self-start ${
                        equipment.available ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      <Text
                        className={`text-sm font-semibold ${
                          equipment.available
                            ? "text-green-800"
                            : "text-red-800"
                        }`}
                      >
                        {equipment.available ? "Налично" : "Не е налично"}
                      </Text>
                    </Box>
                  </VStack>
                </HStack>

                {/* Location */}
                <VStack space="xs">
                  <Text className="text-sm font-medium text-typography-600">
                    Локация
                  </Text>
                  <Text className="text-base text-typography-700">
                    {equipment.locationId}
                  </Text>
                </VStack>
              </VStack>

              {/* Back Button */}
              <HStack className="items-center justify-center mt-4">
                <Button
                  variant="outline"
                  size="lg"
                  onPress={handleBack}
                  className="min-w-[200px]"
                >
                  <ButtonText>Назад към списъка</ButtonText>
                </Button>
              </HStack>
            </VStack>
          </Card>
        </Box>
      </ScrollView>
    </Box>
  );
}

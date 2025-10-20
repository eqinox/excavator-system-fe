import { BASE_URL } from "@/constants";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { HStack } from "../ui/hstack";
import { Image } from "../ui/image";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

export default function EquipmentsList() {
  const { equipments } = useSelector((state: RootState) => state.equipments);
  return (
    <VStack className="p-2">
      {equipments.map((equipment, index) => (
        <HStack
          key={index}
          className="bg-background-100 m-2 p-3 rounded-lg transition-colors duration-200 hover:bg-background-200 cursor-pointer"
        >
          <VStack className="h-48 w-48">
            <Image
              source={{
                uri: `${BASE_URL}/${equipment.images[0].original}`,
              }}
              alt={equipment.name}
              className="h-full w-full"
              //   style={{ width: 100, height: 100 }}
              resizeMode="cover"
            />
          </VStack>
          <VStack className="pl-2">
            <Text className="text-lg font-bold">{equipment.name}</Text>
            <Text>{equipment.price_per_day} лв/ден</Text>
            <Text className="text-sm text-gray-300 pt-2">
              {equipment.description}
            </Text>
          </VStack>
        </HStack>
      ))}
    </VStack>
  );
}

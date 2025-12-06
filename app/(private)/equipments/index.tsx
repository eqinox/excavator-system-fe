import EquipmentsList from "@/components/lists/EquipmentsList";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import {
  AppDispatch,
  RootState,
  fetchEquipmentsBySubCategoryId,
} from "@/store";
// import { useEquipment } from '@/redux/useReduxHooks';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Equipments() {
  const { id, categoryId } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { equipments, isLoading, error } = useSelector(
    (state: RootState) => state.equipments
  );

  useEffect(() => {
    if (id && typeof id === "string") {
      dispatch(fetchEquipmentsBySubCategoryId(id));
    }
  }, [dispatch, id]);
  // const {
  //   getEquipmentById,
  //   equipmentLoading: loading,
  //   equipmentError: error,
  //   selectedEquipment,
  // } = useEquipment();

  // Fetch equipment when component mounts or category ID changes
  // useEffect(() => {
  //   if (id && typeof id === 'string') {
  //     getEquipmentById(id);
  //   }
  // }, [id]);

  const handleBackToSubCategories = () => {
    if (categoryId && typeof categoryId === "string") {
      router.push({
        pathname: "/sub-category",
        params: { id: categoryId },
      });
    } else {
      router.back();
    }
  };

  return (
    <>
      <VStack space="xl" className="w-full max-w-4xl">
        <VStack space="md" className="mb-4 mt-4">
          <HStack className="justify-between">
            <Button variant="outline" onPress={handleBackToSubCategories}>
              <ButtonText>← Назад към подкатегории</ButtonText>
            </Button>
          </HStack>
        </VStack>

        <VStack space="xl" className="w-full max-w-4xl">
          <VStack space="lg" className="w-full">
            {isLoading && (
              <Text className="text-center text-lg font-medium">
                Зареждане...
              </Text>
            )}

            {error && (
              <Text className="text-center text-lg font-medium text-red-500">
                Грешка: {error}
              </Text>
            )}
            <EquipmentsList />

            {/* {!isLoading && !error && selectedEquipment && (
              <HStack space='md' className='flex-wrap justify-center'>
                <VStack space='sm' className='items-center'>
                  <Box className='bg-primary flex h-48 w-48 items-center justify-center overflow-hidden rounded-lg shadow-md'>
                    {selectedEquipment.images &&
                      selectedEquipment.images.length > 0 && (
                        <Image
                          source={{
                            uri: `${BASE_URL}/images/${selectedEquipment.images[0]}`,
                          }}
                          className='h-full w-full'
                          resizeMode='cover'
                        />
                      )}
                  </Box>
                  <Text className='max-w-24 text-center text-sm font-medium'>
                    {selectedEquipment.name}
                  </Text>
                  <Text className='max-w-48 text-center text-xs text-gray-600'>
                    {selectedEquipment.description}
                  </Text>
                  <Text className='text-center text-sm font-bold text-green-600'>
                    {selectedEquipment.pricePerDay} лв/ден
                  </Text>
                </VStack>
              </HStack>
            )} */}

            {!isLoading && !error && equipments.length === 0 && (
              <Text className="text-center text-lg font-medium">
                Няма налично оборудване
              </Text>
            )}
          </VStack>
        </VStack>
      </VStack>
    </>
  );
}

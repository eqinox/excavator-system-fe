import ProtectedRoute from '@/components/ProtectedRoute';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { BASE_URL } from '@/constants';
import { apiClient, EquipmentResponse } from '@/lib/api';
import { useAuth } from '@/redux/useReduxHooks';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image } from 'react-native';

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
        >(`/equipment/category/${id}`, { method: 'GET' }, accessToken || '');

        setEquipments(response);
      } catch (error) {
        console.error(error);
        setError('Failed to load equipments');
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
      pathname: '/equipment/create',
      params: {
        categoryId: id,
      },
    });
  };

  return (
    <ProtectedRoute>
      <VStack className='flex-1 justify-start px-4'>
        <VStack space='xl' className='w-full max-w-4xl'>
          <VStack space='md' className='mb-4 mt-4'>
            <HStack className='justify-end'>
              <Button variant='outline' onPress={() => handleCreateEquipment()}>
                <Text>Публикувай оборудване</Text>
              </Button>
            </HStack>
          </VStack>

          <VStack space='xl' className='w-full max-w-4xl'>
            <VStack space='lg' className='w-full'>
              <HStack space='md' className='flex-wrap justify-center'>
                {equipments.map((equipment, index) => (
                  <VStack key={index} space='sm' className='items-center'>
                    <Box className='bg-primary flex h-48 w-48 items-center justify-center overflow-hidden rounded-lg shadow-md'>
                      {equipment.images && (
                        <Image
                          source={{
                            uri: `${BASE_URL}/images/${equipment.images[0].small}`,
                          }}
                          className='h-full w-full'
                          resizeMode='cover'
                        />
                      )}
                    </Box>
                    <Text className='max-w-24 text-center text-sm font-medium'>
                      {equipment.name}
                    </Text>
                  </VStack>
                ))}

                {equipments.length === 0 && (
                  <Text className='text-center text-lg font-medium'>
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

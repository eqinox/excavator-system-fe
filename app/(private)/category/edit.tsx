import CategoryForm from '@/components/CategoryForm';
import { Button, ButtonText } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { BASE_URL } from '@/constants';
import { findCategoryById } from '@/lib/categories';
import { CategoryResponseDataDto } from '@/lib/dto/server/category.dto';
import { useAuth } from '@/redux/useReduxHooks';
import { CategoryUpdateData } from '@/validation/category';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

export default function EditCategory() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const [category, setCategory] = useState<CategoryResponseDataDto | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get category data from params (you might want to fetch this from API)
  const categoryId = params.id as string;

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const category = await findCategoryById(categoryId);
        setCategory(category.data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, []);

  if (loading) {
    return (
      <Center className='flex-1'>
        <Text>Зареждане на категории...</Text>
      </Center>
    );
  }

  if (error) {
    throw new Error(error);
  }

  const handleGoBack = () => {
    router.back();
  };

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <VStack className='flex-1 p-4'>
        <VStack space='md'>
          <Heading size='xl'>Достъп отказан</Heading>
          <Text>Само администратори могат да редактират категории</Text>

          <Button onPress={handleGoBack} variant='outline'>
            <ButtonText>Назад</ButtonText>
          </Button>
        </VStack>
      </VStack>
    );
  }
  if (!category) {
    throw new Error('Категория не е намерена');
  }

  // Mock initial data - in real app, you'd fetch this from API
  const initialData: CategoryUpdateData = {
    name: category.name || '',
    image: BASE_URL + '/' + category.image.original || null,
    id: category.id,
  };

  return <CategoryForm mode='edit' initialData={initialData} />;
}

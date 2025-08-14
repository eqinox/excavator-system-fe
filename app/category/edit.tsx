import CategoryForm from '@/components/CategoryForm';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useAuth } from '@/lib/authContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';

export default function EditCategory() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams();

  // Get category data from params (you might want to fetch this from API)
  const categoryId = params.id as string;
  const categoryName = params.name as string;

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

  // Mock initial data - in real app, you'd fetch this from API
  const initialData = {
    name: categoryName || '',
    image: null, // Add image field to satisfy the type requirement
  };

  return (
    <ProtectedRoute>
      <CategoryForm mode='edit' initialData={initialData} />
    </ProtectedRoute>
  );
}

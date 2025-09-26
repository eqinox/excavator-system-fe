import CategoryForm from '@/components/CategoryForm';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useAuth } from '@/redux/useReduxHooks';
import { useRouter } from 'expo-router';
import React from 'react';

export default function AddCategory() {
  const router = useRouter();
  const { user } = useAuth();

  const handleGoBack = () => {
    router.back();
  };

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <VStack className='flex-1 p-4'>
        <VStack space='md'>
          <Heading size='xl'>Достъп отказан</Heading>
          <Text>Само администратори могат да добавят категории</Text>

          <Button onPress={handleGoBack} variant='outline'>
            <ButtonText>Назад</ButtonText>
          </Button>
        </VStack>
      </VStack>
    );
  }

  return <CategoryForm mode='create' />;
}

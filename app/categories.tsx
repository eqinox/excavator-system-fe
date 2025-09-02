import CategoriesList from '@/components/CategoriesList';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { useApp } from '@/store/appContext';
import { useEffect } from 'react';

export default function CategoriesRoute() {
  const { categoriesLoading, categoriesError, refreshCategories } = useApp();

  useEffect(() => {
    refreshCategories();
  }, []);

  if (categoriesLoading) {
    return (
      <ProtectedRoute>
        <Center className='flex-1'>
          <Text>Зареждане на категории...</Text>
        </Center>
      </ProtectedRoute>
    );
  }

  if (categoriesError) {
    return (
      <ProtectedRoute>
        <Center className='flex-1 px-4'>
          <Text className='mb-4 text-red-500'>{categoriesError}</Text>
          <Text onPress={refreshCategories}>Retry</Text>
        </Center>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <CategoriesList />
    </ProtectedRoute>
  );
}

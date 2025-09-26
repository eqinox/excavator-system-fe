import CategoriesList from '@/components/CategoriesList';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { useCategories } from '@/redux/useReduxHooks';
import { useEffect } from 'react';

export default function CategoriesRoute() {
  const { categoriesLoading, categoriesError, refreshCategories } =
    useCategories();

  useEffect(() => {
    refreshCategories();
  }, []);

  if (categoriesLoading) {
    return (
      <Center className='flex-1'>
        <Text>Зареждане на категории...</Text>
      </Center>
    );
  }

  if (categoriesError) {
    return (
      <Center className='flex-1 px-4'>
        <Text className='mb-4 text-red-500'>{categoriesError}</Text>
        <Text onPress={refreshCategories}>Retry</Text>
      </Center>
    );
  }

  return <CategoriesList />;
}

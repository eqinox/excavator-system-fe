import CategoriesList from '@/components/CategoriesList';
import { AppDispatch, fetchCategories } from '@/store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
// import { useCategories } from '@/redux/useReduxHooks';

export default function CategoriesRoute() {
  const dispatch = useDispatch<AppDispatch>();
  // const { categoriesLoading, categoriesError, refreshCategories } =
  //   useCategories();
  
  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  // if (categoriesLoading) {
  //   return (
  //     <Center className='flex-1'>
  //       <Text>Зареждане на категории...</Text>
  //     </Center>
  //   );
  // }

  // if (categoriesError) {
  //   return (
  //     <Center className='flex-1 px-4'>
  //       <Text className='mb-4 text-red-500'>{categoriesError}</Text>
  //       <Text onPress={refreshCategories}>Retry</Text>
  //     </Center>
  //   );
  // }

  return <CategoriesList />;
}

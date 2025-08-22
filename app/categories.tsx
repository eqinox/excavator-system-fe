import Categories from '@/components/Categories';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { loadAllCategories } from '@/lib/categories';
import { CategoryResponseDataDto } from '@/lib/dto/server/category.dto';
import { useEffect, useState } from 'react';

export default function CategoriesRoute() {
  const [categories, setCategories] = useState<CategoryResponseDataDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await loadAllCategories();
        setCategories(categories.data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Unknown error');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
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

  return (
    <ProtectedRoute>
      <Categories categories={categories} />
    </ProtectedRoute>
  );
}

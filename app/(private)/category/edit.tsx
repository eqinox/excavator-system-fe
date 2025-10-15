import CategoryForm from "@/components/forms/CategoryForm";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import { BASE_URL } from "@/constants";
import { AppDispatch, RootState } from "@/store";
import { findCategoryById } from "@/store/thunks/fetchCategories";
import { CategoryUpdateData } from "@/validation/category";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function EditCategory() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const params = useLocalSearchParams();
  const category = useSelector(
    (state: RootState) => state.categories.selectedCategory
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get category data from params (you might want to fetch this from API)
  const categoryId = params.id as string;

  useEffect(() => {
    const loadCategory = async () => {
      setLoading(true);
      await dispatch(findCategoryById(categoryId));
      setLoading(false);
    };
    loadCategory();
  }, [dispatch, categoryId]);

  if (loading) {
    return (
      <Center className="flex-1">
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
  // if (user?.role !== 'admin') {
  //   return (
  //     <VStack className='flex-1 p-4'>
  //       <VStack space='md'>
  //         <Heading size='xl'>Достъп отказан</Heading>
  //         <Text>Само администратори могат да редактират категории</Text>

  //         <Button onPress={handleGoBack} variant='outline'>
  //           <ButtonText>Назад</ButtonText>
  //         </Button>
  //       </VStack>
  //     </VStack>
  //   );
  // }
  if (!category) {
    throw new Error("Категория не е намерена");
  }

  // Mock initial data - in real app, you'd fetch this from API
  const initialData: CategoryUpdateData = {
    name: category.name || "",
    image: category.image
      ? { uri: `${BASE_URL}/${category.image.original}`, isExisting: true }
      : null,
    id: category.id,
  };

  return <CategoryForm mode="edit" initialData={initialData} />;
}

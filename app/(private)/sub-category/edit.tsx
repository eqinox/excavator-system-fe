import SubCategoryForm from "@/components/forms/SubCategoryForm";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import { BASE_URL } from "@/constants";
import { AppDispatch, RootState } from "@/store";
import { findSubCategoryById } from "@/store/thunks/fetchSubCategories";
import { SubCategoryUpdateData } from "@/validation/subCategory";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function EditSubCategory() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const params = useLocalSearchParams();
  const subCategory = useSelector(
    (state: RootState) => state.subCategories.selectedSubCategory
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const subCategoryId = params.id as string;

  useEffect(() => {
    const loadSubCategory = async () => {
      setLoading(true);
      try {
        await dispatch(findSubCategoryById(subCategoryId));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load subcategory"
        );
      } finally {
        setLoading(false);
      }
    };
    if (subCategoryId) {
      loadSubCategory();
    }
  }, [dispatch, subCategoryId]);

  if (loading) {
    return (
      <Center className="flex-1">
        <Text>Зареждане на подкатегория...</Text>
      </Center>
    );
  }

  if (error) {
    throw new Error(error);
  }

  if (!subCategory) {
    throw new Error("Подкатегория не е намерена");
  }

  const initialData: SubCategoryUpdateData = {
    id: subCategory.id,
    type: subCategory.type || "",
    minRange: subCategory.minRange || 0,
    maxRange: subCategory.maxRange || 0,
    image: subCategory.image
      ? { uri: `${BASE_URL}/${subCategory.image.original}`, isExisting: true }
      : null,
  };

  return (
    <SubCategoryForm
      mode="edit"
      initialData={initialData}
      categoryId={subCategory.categoryId}
    />
  );
}





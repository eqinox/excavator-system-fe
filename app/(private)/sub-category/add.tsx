import SubCategoryForm from "@/components/forms/SubCategoryForm";
import { useLocalSearchParams } from "expo-router";

export default function AddSubCategory() {
  const { categoryId } = useLocalSearchParams();

  return (
    <SubCategoryForm
      mode="create"
      categoryId={
        categoryId && typeof categoryId === "string" ? categoryId : undefined
      }
    />
  );
}


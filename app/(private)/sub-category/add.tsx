import SubCategoryForm from "@/components/forms/SubCategoryForm";
import { useLocalSearchParams } from "expo-router";

export default function AddSubCategory() {
  const { categoryId } = useLocalSearchParams();

  if (!categoryId || typeof categoryId !== "string") {
    return null;
  }

  return <SubCategoryForm mode="create" categoryId={categoryId} />;
}


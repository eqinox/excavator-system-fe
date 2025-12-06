import SubCategoriesList from "@/components/lists/SubCategoriesList";
import { AppDispatch, fetchSubCategories } from "@/store";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function SubCategoryPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    dispatch(fetchSubCategories(id as string));
  }, [dispatch, id]);

  return <SubCategoriesList />;
}

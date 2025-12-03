import SubCategoriesList from "@/components/lists/SubCategoriesList";
import { AppDispatch, fetchSubCategories } from "@/store";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function SubCategoryPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useLocalSearchParams();
  console.log("sub category page", id);
  useEffect(() => {
    console.log("fetching sub categories use effect");
    dispatch(fetchSubCategories(id as string));
  }, [dispatch, id]);

  return <SubCategoriesList />;
}

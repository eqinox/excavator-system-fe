import Categories from "@/components/Categories";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CategoriesRoute() {
  return (
    <ProtectedRoute>
      <Categories />
    </ProtectedRoute>
  );
}

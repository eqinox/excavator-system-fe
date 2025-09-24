import EquipmentForm from "@/components/EquipmentForm";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useLocalSearchParams } from "expo-router";

export default function CreateEquipment() {
  const { categoryId } = useLocalSearchParams();

  return (
    <ProtectedRoute>
      <EquipmentForm categoryId={categoryId as string} />
    </ProtectedRoute>
  );
}

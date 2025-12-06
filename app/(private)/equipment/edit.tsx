import EquipmentForm from "@/components/forms/EquipmentForm";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import { EquipmentResponseDto } from "@/dto/equipment.dto";
import { AppDispatch, RootState } from "@/store";
import { findEquipmentById } from "@/store/thunks/fetchEquipments";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function EditEquipment() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const params = useLocalSearchParams();
  const equipment = useSelector(
    (state: RootState) => state.equipments.selectedEquipment
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const equipmentId = params.id as string;

  useEffect(() => {
    const loadEquipment = async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(findEquipmentById(equipmentId));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load equipment"
        );
      } finally {
        setLoading(false);
      }
    };
    if (equipmentId) {
      loadEquipment();
    }
  }, [dispatch, equipmentId]);

  if (loading) {
    return (
      <Center className="flex-1">
        <Text>Зареждане на оборудване...</Text>
      </Center>
    );
  }

  if (error) {
    return (
      <Center className="flex-1">
        <Text className="text-red-500">Грешка: {error}</Text>
      </Center>
    );
  }

  if (!equipment) {
    return (
      <Center className="flex-1">
        <Text>Оборудването не е намерено</Text>
      </Center>
    );
  }

  // Prepare initial data for the form
  const initialData: EquipmentResponseDto = {
    ...equipment,
    images: equipment.images || [],
  };

  return <EquipmentForm mode="edit" initialData={initialData} />;
}

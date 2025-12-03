import EquipmentDetailView from "@/components/equipment/EquipmentDetailView";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import { AppDispatch, RootState } from "@/store";
import { findEquipmentById } from "@/store/thunks/fetchEquipments";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function EquipmentDetail() {
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
    throw new Error(error);
  }

  if (!equipment) {
    throw new Error("Оборудването не е намерено");
  }

  return <EquipmentDetailView equipment={equipment} />;
}

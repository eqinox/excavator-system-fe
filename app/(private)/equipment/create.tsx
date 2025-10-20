import EquipmentForm from "@/components/forms/EquipmentForm";
import { useLocalSearchParams } from "expo-router";

const CreateEquipment = () => {
  const { categoryId } = useLocalSearchParams();
  return <EquipmentForm categoryId={categoryId as string} />;
};

export default CreateEquipment;

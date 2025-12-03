import EquipmentForm from "@/components/forms/EquipmentForm";
import { useLocalSearchParams } from "expo-router";

const CreateEquipment = () => {
  const { subCategoryId } = useLocalSearchParams();
  return <EquipmentForm subCategoryId={subCategoryId as string} />;
};

export default CreateEquipment;

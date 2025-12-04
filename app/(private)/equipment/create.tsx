import EquipmentForm from "@/components/forms/EquipmentForm";
import { useLocalSearchParams } from "expo-router";

const CreateEquipment = () => {
  const { subCategoryId } = useLocalSearchParams();
  return (
    <EquipmentForm
      subCategoryId={
        subCategoryId && typeof subCategoryId === "string"
          ? subCategoryId
          : undefined
      }
    />
  );
};

export default CreateEquipment;

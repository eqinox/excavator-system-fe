import EquipmentForm from '@/components/EquipmentForm';
import { useLocalSearchParams } from 'expo-router';

export default function CreateEquipment() {
  const { categoryId } = useLocalSearchParams();

  return <EquipmentForm categoryId={categoryId as string} />;
}

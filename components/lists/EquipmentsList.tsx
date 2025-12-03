import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { BASE_URL } from "@/constants";
import { AppDispatch, RootState, deleteEquipment } from "@/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { HStack } from "../ui/hstack";
import { TrashIcon } from "../ui/icon";
import { Image } from "../ui/image";
import { Text } from "../ui/text";
import { Toast, ToastTitle, useToast } from "../ui/toast";
import { VStack } from "../ui/vstack";

export default function EquipmentsList() {
  const { equipments } = useSelector((state: RootState) => state.equipments);
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState<string | null>(
    null
  );
  const handleRemoveEquipment = (equipmentId: string) => {
    setEquipmentToDelete(equipmentId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteEquipment = async () => {
    if (!equipmentToDelete) return;

    dispatch(
      deleteEquipment({
        equipmentId: equipmentToDelete,
        onSuccess: (message: string) => {
          toast.show({
            placement: "top",
            duration: 3000,
            render: ({ id }) => (
              <Toast action="success" variant="solid">
                <ToastTitle>{message}</ToastTitle>
              </Toast>
            ),
          });
          cancelDeleteEquipment();
        },
        onError: (message: string) => {
          toast.show({
            placement: "top",
            duration: 3000,
            render: ({ id }) => (
              <Toast action="error" variant="solid">
                <ToastTitle>{message}</ToastTitle>
              </Toast>
            ),
          });
        },
      })
    );
  };

  const cancelDeleteEquipment = () => {
    setShowDeleteDialog(false);
    setEquipmentToDelete(null);
  };
  return (
    <VStack className="p-2">
      {equipments.map((equipment, index) => (
        <HStack
          key={index}
          className="bg-background-100 m-2 p-3 rounded-lg transition-colors duration-200 hover:bg-background-200 cursor-pointer"
        >
          {equipment.images && equipment.images.length > 0 && (
            <VStack className="h-48 w-48">
              <Image
                source={{
                  uri: `${BASE_URL}/${equipment.images[0].original}`,
                }}
                alt={equipment.name}
                className="h-full w-full"
                resizeMode="cover"
              />
            </VStack>
          )}
          <VStack className="pl-2">
            <Text className="text-lg font-bold">{equipment.name}</Text>
            <Text>{equipment.pricePerDay} лв/ден</Text>
            <Text className="text-sm text-gray-300 pt-2">
              {equipment.description}
            </Text>
            <Button
              variant="ghost"
              size="sm"
              onPress={() => handleRemoveEquipment(equipment.id)}
              className="bg-red-500 p-2 text-white"
            >
              <TrashIcon width={16} height={16} className="text-white" />
            </Button>
          </VStack>
        </HStack>
      ))}

      {/* Delete Confirmation Dialog */}
      <AlertDialog isOpen={showDeleteDialog} onClose={cancelDeleteEquipment}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Text className="text-lg font-semibold text-typography-900">
              Изтриване на оборудване
            </Text>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text className="text-typography-600">
              Сигурни ли сте, че искате да изтриете това оборудване? Това
              действие не може да бъде отменено.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onPress={cancelDeleteEquipment}
              className="mr-2"
            >
              <Text>Отказ</Text>
            </Button>
            <Button
              variant="solid"
              onPress={confirmDeleteEquipment}
              className="bg-red-500"
            >
              <Text className="text-white">Изтрий</Text>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </VStack>
  );
}

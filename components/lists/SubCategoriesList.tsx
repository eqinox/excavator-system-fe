import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { BASE_URL } from "@/constants";
import { AppDispatch, RootState, deleteSubCategory } from "@/store";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, ButtonText } from "../ui/button";
import { EditIcon, TrashIcon } from "../ui/icon";
import { Image } from "../ui/image";
import { Pressable } from "../ui/pressable";
import { Toast, ToastTitle, useToast } from "../ui/toast";

export default function SubCategoriesList() {
  const router = useRouter();
  const toast = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const params = useLocalSearchParams();

  const user = useSelector((state: RootState) => state.auth.user);
  const subCategories = useSelector(
    (state: RootState) => state.subCategories.subCategories
  );
  const categoryId = params.id as string;

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [subCategoryToDelete, setSubCategoryToDelete] = useState<string | null>(
    null
  );

  const handleSubCategoryPress = (subCategoryId: string) => {
    router.push({
      pathname: "/equipments",
      params: { id: subCategoryId, categoryId: categoryId },
    });
  };

  const handleBackToCategories = () => {
    router.push("/categories");
  };

  const handleEditSubCategory = (subCategoryId: string) => {
    router.push({
      pathname: "/sub-category/edit",
      params: { id: subCategoryId },
    });
  };

  const handleRemoveSubCategory = (subCategoryId: string) => {
    setSubCategoryToDelete(subCategoryId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteSubCategory = async () => {
    if (!subCategoryToDelete) return;

    dispatch(
      deleteSubCategory({
        subCategoryId: subCategoryToDelete,
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
          cancelDeleteSubCategory();
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

  const cancelDeleteSubCategory = () => {
    setShowDeleteDialog(false);
    setSubCategoryToDelete(null);
  };

  return (
    <>
      <VStack space="xl" className="w-full max-w-4xl">
        <VStack space="md">
          <HStack className="items-center justify-between">
            <Button variant="outline" onPress={handleBackToCategories}>
              <ButtonText>← Назад към Категории</ButtonText>
            </Button>

            <Heading size="xl" className="flex-1 text-center">
              Подкатегории
            </Heading>
          </HStack>
        </VStack>

        <VStack space="lg" className="w-full">
          <HStack space="md" className="flex-wrap justify-between">
            {subCategories.map((subCategory, index) => (
              <VStack key={index} space="sm" className="items-center">
                <Pressable
                  className="bg-primary flex h-48 w-48 cursor-pointer items-center justify-center overflow-hidden rounded-lg shadow-md"
                  onPress={() => handleSubCategoryPress(subCategory.id)}
                >
                  {subCategory.image && (
                    <Image
                      source={{
                        uri: `${BASE_URL}/${subCategory.image.small}`,
                      }}
                      alt={subCategory.type}
                      className="h-full w-full"
                      resizeMode="cover"
                    />
                  )}
                </Pressable>
                {user?.role === "admin" && (
                  <HStack space="md">
                    <Button
                      variant="ghost"
                      size="sm"
                      onPress={() => handleEditSubCategory(subCategory.id)}
                      className="bg-yellow-500 p-2"
                    >
                      <EditIcon width={16} height={16} className="text-white" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onPress={() => handleRemoveSubCategory(subCategory.id)}
                      className="bg-red-500 p-2 text-white"
                    >
                      <TrashIcon
                        width={16}
                        height={16}
                        className="text-white"
                      />
                    </Button>
                  </HStack>
                )}
                <Text className="max-w-24 text-center text-sm font-medium">
                  {subCategory.type}
                </Text>
                <Text className="max-w-24 text-center text-xs text-gray-400">
                  {subCategory.minRange} - {subCategory.maxRange}
                </Text>
              </VStack>
            ))}
            {subCategories.length === 0 && (
              <Text className="text-center text-sm">
                Няма налични подкатегории
              </Text>
            )}
          </HStack>
        </VStack>
      </VStack>

      {/* Delete Confirmation Dialog */}
      <AlertDialog isOpen={showDeleteDialog} onClose={cancelDeleteSubCategory}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Text className="text-lg font-semibold text-typography-900">
              Изтриване на подкатегория
            </Text>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text className="text-typography-600">
              Сигурни ли сте, че искате да изтриете тази подкатегория? Това
              действие не може да бъде отменено.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onPress={cancelDeleteSubCategory}
              className="mr-2"
            >
              <Text>Отказ</Text>
            </Button>
            <Button
              variant="solid"
              onPress={confirmDeleteSubCategory}
              className="bg-red-500"
            >
              <Text className="text-white">Изтрий</Text>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

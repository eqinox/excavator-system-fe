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
// import { useAuth, useCategories } from '@/redux/useReduxHooks';
import { BASE_URL } from "@/constants";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, deleteCategory, logout } from "../store";
import { Button } from "./ui/button";
import { EditIcon, TrashIcon } from "./ui/icon";
import { Image } from "./ui/image";
import { Pressable } from "./ui/pressable";
import { Toast, ToastTitle, useToast } from "./ui/toast";

export default function CategoriesList() {
  const router = useRouter();
  const toast = useToast();
  const dispatch = useDispatch<AppDispatch>();
  // const { deleteCategory, categories } = useCategories();

  const user = useSelector((state: RootState) => state.auth.user);
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const handleCategoryPress = (categoryId: string) => {
    router.push({
      pathname: "/equipments",
      params: { id: categoryId.toString() },
    });
  };

  const handleLogout = async () => {
    dispatch(
      logout({
        onSuccess: (message: string) => {
          router.replace("/auth");
        },
      })
    );
  };

  const handleAddCategory = () => {
    router.push("/category/add");
  };

  const handleEditCategory = (categoryId: string) => {
    router.push({
      pathname: "/category/edit",
      params: { id: categoryId },
    });
  };

  const handleRemoveCategory = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    dispatch(
      deleteCategory({
        categoryId: categoryToDelete,
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
          cancelDeleteCategory();
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

  const cancelDeleteCategory = () => {
    setShowDeleteDialog(false);
    setCategoryToDelete(null);
  };

  return (
    <VStack className="flex-1 justify-start bg-background-100 px-4">
      <VStack space="xl" className="w-full max-w-4xl">
        <VStack space="md">
          <HStack className="items-center justify-between">
            <Heading size="xl" className="flex-1 text-center">
              Категории
            </Heading>
            <Button variant="outline" onPress={handleLogout} className="ml-4">
              <Text>Излез</Text>
            </Button>
          </HStack>
        </VStack>

        <VStack space="lg" className="w-full">
          <HStack space="md" className="flex-wrap justify-center">
            {categories.map((category, index) => (
              <VStack key={index} space="sm" className="items-center">
                <Pressable
                  className="bg-primary flex h-48 w-48 cursor-pointer items-center justify-center overflow-hidden rounded-lg shadow-md"
                  onPress={() => handleCategoryPress(category.id)}
                >
                  {category.image && (
                    <Image
                      source={{
                        uri: `${BASE_URL}/${category.image.small}`,
                      }}
                      alt={category.name}
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
                      onPress={() => handleEditCategory(category.id)}
                      className="bg-yellow-500 p-2"
                    >
                      <EditIcon width={16} height={16} className="text-white" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onPress={() => handleRemoveCategory(category.id)}
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
                  {category.name}
                </Text>
              </VStack>
            ))}
            {categories.length === 0 && (
              <Text className="text-center text-sm">
                Няма налични категории
              </Text>
            )}
            {user?.role === "admin" && (
              <Button
                variant="outline"
                onPress={handleAddCategory}
                className="ml-4"
              >
                <Text>Добавяне на категория</Text>
              </Button>
            )}
          </HStack>
        </VStack>
      </VStack>

      {/* Delete Confirmation Dialog */}
      <AlertDialog isOpen={showDeleteDialog} onClose={cancelDeleteCategory}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Text className="text-lg font-semibold text-typography-900">
              Изтриване на категория
            </Text>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text className="text-typography-600">
              Сигурни ли сте, че искате да изтриете тази категория? Това
              действие не може да бъде отменено.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onPress={cancelDeleteCategory}
              className="mr-2"
            >
              <Text>Отказ</Text>
            </Button>
            <Button
              variant="solid"
              onPress={confirmDeleteCategory}
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

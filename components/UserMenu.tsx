import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { AppDispatch, RootState, fetchCategories, logout } from "@/store";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "./ui/alert-dialog";

export default function UserMenu() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );

  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  useEffect(() => {
    // Fetch categories when component mounts
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleLogout = async () => {
    dispatch(
      logout({
        onSuccess: (message: string) => {
          router.replace("/auth");
        },
      })
    );
  };

  const handleAddEquipment = () => {
    router.push("/equipment/create");
  };

  const handleAddCategory = () => {
    router.push("/category/add");
  };

  const handleAddSubCategoryClick = () => {
    if (categories.length === 0) {
      // If no categories, fetch them first
      dispatch(fetchCategories());
    }
    setShowCategoryDialog(true);
  };

  const handleCategorySelected = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setShowCategoryDialog(false);
    router.push({
      pathname: "/sub-category/add",
      params: { categoryId: categoryId },
    });
  };

  const displayName = user?.email || "Потребител";

  if (!user) {
    return null;
  }

  return (
    <>
      {showMenu && (
        <Pressable
          className="absolute inset-0 z-40"
          onPress={() => setShowMenu(false)}
        />
      )}
      <Box className="absolute top-4 right-4 z-50">
        <Button variant="outline" onPress={() => setShowMenu(!showMenu)}>
          <ButtonText>{displayName}</ButtonText>
        </Button>
        {showMenu && (
          <Card className="absolute top-12 right-0 mt-2 min-w-[200px] bg-background-0 border border-outline-100 shadow-lg">
            <VStack space="xs" className="p-1">
              <Pressable
                onPress={() => {
                  setShowMenu(false);
                  handleAddEquipment();
                }}
                className="p-3 rounded active:bg-background-50"
              >
                <Text className="text-typography-700">
                  Добавяне на оборудване
                </Text>
              </Pressable>
              {user.role === "admin" && (
                <>
                  <Box className="h-px w-full bg-background-200" />
                  <Pressable
                    onPress={() => {
                      setShowMenu(false);
                      handleAddCategory();
                    }}
                    className="p-3 rounded active:bg-background-50"
                  >
                    <Text className="text-typography-700">
                      Добавяне на категория
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setShowMenu(false);
                      handleAddSubCategoryClick();
                    }}
                    className="p-3 rounded active:bg-background-50"
                  >
                    <Text className="text-typography-700">
                      Добавяне на подкатегория
                    </Text>
                  </Pressable>
                </>
              )}
              <Box className="h-px w-full bg-background-200" />
              <Pressable
                onPress={() => {
                  setShowMenu(false);
                  handleLogout();
                }}
                className="p-3 rounded active:bg-background-50"
              >
                <Text className="text-typography-700">Излез</Text>
              </Pressable>
            </VStack>
          </Card>
        )}
      </Box>

      {/* Category Selection Dialog for SubCategory */}
      <AlertDialog
        isOpen={showCategoryDialog}
        onClose={() => setShowCategoryDialog(false)}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Text className="text-lg font-semibold text-typography-900">
              Избери категория
            </Text>
          </AlertDialogHeader>
          <AlertDialogBody>
            <VStack space="md" className="w-full">
              <Text className="text-typography-600">
                Избери категория за новата подкатегория:
              </Text>
              <VStack space="xs" className="w-full max-h-64">
                {categories.length === 0 ? (
                  <Text className="text-typography-500 text-center py-4">
                    Няма налични категории
                  </Text>
                ) : (
                  categories.map((category) => (
                    <Pressable
                      key={category.id}
                      onPress={() => handleCategorySelected(category.id)}
                      className={`p-3 rounded border ${
                        selectedCategoryId === category.id
                          ? "bg-primary-100 border-primary-500"
                          : "bg-background-0 border-outline-200"
                      } active:bg-primary-50`}
                    >
                      <Text
                        className={
                          selectedCategoryId === category.id
                            ? "text-primary-900 font-medium"
                            : "text-typography-700"
                        }
                      >
                        {category.name}
                      </Text>
                    </Pressable>
                  ))
                )}
              </VStack>
            </VStack>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onPress={() => setShowCategoryDialog(false)}
            >
              <ButtonText>Отказ</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

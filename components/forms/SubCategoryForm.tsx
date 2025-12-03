import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import {
  AppDispatch,
  RootState,
  createSubCategory,
  editSubCategory,
  fetchSubCategories,
} from "@/store";
import {
  subCategoryCreateSchema,
  subCategoryUpdateSchema,
  type SubCategoryCreateData,
  type SubCategoryUpdateData,
} from "@/validation/subCategory";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Input, InputField } from "../ui/input";
import { Toast, ToastTitle, useToast } from "../ui/toast";

interface SubCategoryFormProps {
  mode?: "create" | "edit";
  initialData?: SubCategoryUpdateData | SubCategoryCreateData;
  categoryId: string;
}

export default function SubCategoryForm({
  mode = "create",
  initialData,
  categoryId,
}: SubCategoryFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const params = useLocalSearchParams();
  const router = useRouter();
  const toast = useToast();
  const isLoading = useSelector(
    (state: RootState) => state.subCategories.isLoading
  );
  const isEditMode = mode === "edit" || params.mode === "edit";
  const schema = isEditMode ? subCategoryUpdateSchema : subCategoryCreateSchema;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<SubCategoryUpdateData | SubCategoryCreateData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      type: "",
      minRange: 0,
      maxRange: 0,
      categoryId: categoryId,
      image: null,
    },
  });

  const selectedImage = watch("image");

  // Set initial values if editing
  useEffect(() => {
    if (initialData) {
      setValue("type", initialData.type);
      setValue("minRange", initialData.minRange);
      setValue("maxRange", initialData.maxRange);
      if (isEditMode && "id" in initialData) {
        setValue("id", initialData.id);
      }
      if (initialData.image) {
        setValue("image", initialData.image);
      }
    } else {
      // Set categoryId for create mode
      setValue("categoryId", categoryId);
    }
  }, [initialData, setValue, isEditMode, categoryId]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        setValue("image", result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const onSubmit = async (
    data: SubCategoryUpdateData | SubCategoryCreateData
  ) => {
    if (isEditMode) {
      const updateData = data as SubCategoryUpdateData;
      const img: any = (updateData as any).image;
      const payload: any = {
        id: updateData.id,
        type: updateData.type,
        minRange: updateData.minRange,
        maxRange: updateData.maxRange,
      };

      // Only add image if user selected a new one (has base64)
      if (img && img.base64) {
        payload.image = img.base64;
      }

      dispatch(
        editSubCategory({
          data: payload,
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
            reset();
            dispatch(fetchSubCategories(categoryId));
            router.replace(`/sub-category?id=${categoryId}`);
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
    } else {
      const createdSubCategory = data as SubCategoryCreateData;
      const img: any = (createdSubCategory as any).image;

      let base64Image: string | null = null;
      if (img && typeof img === "object" && img.base64) {
        base64Image = img.base64 as string;
      } else if (
        img &&
        typeof img === "object" &&
        typeof img.uri === "string" &&
        img.uri.startsWith("data:")
      ) {
        const commaIndex = img.uri.indexOf(",");
        if (commaIndex !== -1) base64Image = img.uri.substring(commaIndex + 1);
      } else if (typeof img === "string" && img.startsWith("data:")) {
        const commaIndex = img.indexOf(",");
        if (commaIndex !== -1) base64Image = img.substring(commaIndex + 1);
      }

      dispatch(
        createSubCategory({
          data: {
            ...createdSubCategory,
            categoryId: categoryId,
            image: base64Image,
          },
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
            reset();
            dispatch(fetchSubCategories(categoryId));
            router.replace(`/sub-category?id=${categoryId}`);
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
    }
  };

  const getFieldError = (fieldName: string) => {
    return (errors as any)[fieldName]?.message;
  };

  return (
    <Box className="min-h-screen flex-1 bg-background-300">
      <Box className="flex-1 items-center justify-center px-4 py-4">
        <Card className="w-full max-w-md bg-background-0 p-6 shadow-lg">
          <VStack space="md" className="w-full">
            {/* Header */}
            <Box className="mb-6 items-center">
              <Text className="mb-2 text-2xl font-bold text-typography-900">
                {isEditMode
                  ? "Редактиране на подкатегория"
                  : "Добавяне на подкатегория"}
              </Text>
              <Text className="text-center text-typography-500">
                {isEditMode
                  ? "Редактирайте данните на подкатегорията"
                  : "Въведете данните за новата подкатегория"}
              </Text>
            </Box>

            <VStack space="md" className="w-full">
              {/* Type Field */}
              <FormControl isInvalid={!!getFieldError("type")}>
                <FormControlLabel>
                  <FormControlLabelText>Тип *</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={control}
                  name="type"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input>
                      <InputField
                        placeholder="Напр. Mini Excavator"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        autoCapitalize="words"
                        returnKeyType="next"
                      />
                    </Input>
                  )}
                />
                {getFieldError("type") && (
                  <FormControlError>
                    <FormControlErrorText>
                      {getFieldError("type")}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              {/* Min Range Field */}
              <FormControl isInvalid={!!getFieldError("minRange")}>
                <FormControlLabel>
                  <FormControlLabelText>
                    Минимален обхват *
                  </FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={control}
                  name="minRange"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input>
                      <InputField
                        placeholder="0"
                        value={value === 0 ? "" : value.toString()}
                        onChangeText={(text) => {
                          const numericText = text.replace(/[^0-9.]/g, "");
                          const parts = numericText.split(".");
                          const cleanText =
                            parts.length > 2
                              ? parts[0] + "." + parts.slice(1).join("")
                              : numericText;
                          const numericValue =
                            cleanText === "" ? 0 : parseFloat(cleanText);
                          onChange(numericValue);
                        }}
                        onBlur={onBlur}
                        keyboardType="numeric"
                        returnKeyType="next"
                      />
                    </Input>
                  )}
                />
                {getFieldError("minRange") && (
                  <FormControlError>
                    <FormControlErrorText>
                      {getFieldError("minRange")}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              {/* Max Range Field */}
              <FormControl isInvalid={!!getFieldError("maxRange")}>
                <FormControlLabel>
                  <FormControlLabelText>
                    Максимален обхват *
                  </FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={control}
                  name="maxRange"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input>
                      <InputField
                        placeholder="10"
                        value={value === 0 ? "" : value.toString()}
                        onChangeText={(text) => {
                          const numericText = text.replace(/[^0-9.]/g, "");
                          const parts = numericText.split(".");
                          const cleanText =
                            parts.length > 2
                              ? parts[0] + "." + parts.slice(1).join("")
                              : numericText;
                          const numericValue =
                            cleanText === "" ? 0 : parseFloat(cleanText);
                          onChange(numericValue);
                        }}
                        onBlur={onBlur}
                        keyboardType="numeric"
                        returnKeyType="next"
                      />
                    </Input>
                  )}
                />
                {getFieldError("maxRange") && (
                  <FormControlError>
                    <FormControlErrorText>
                      {getFieldError("maxRange")}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              {/* Image Upload Field */}
              <FormControl isInvalid={!!getFieldError("image")}>
                <FormControlLabel>
                  <FormControlLabelText>
                    Снимка на подкатегорията
                  </FormControlLabelText>
                </FormControlLabel>

                <VStack space="sm">
                  {selectedImage ? (
                    <Box className="items-center">
                      <Image
                        source={{
                          uri:
                            typeof selectedImage === "string"
                              ? selectedImage
                              : selectedImage.uri,
                        }}
                        className="h-32 w-32 rounded-lg"
                        resizeMode="cover"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onPress={() => setValue("image", null)}
                      >
                        <ButtonText>Премахни снимката</ButtonText>
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      variant="outline"
                      onPress={pickImage}
                      className="h-32 items-center justify-center"
                    >
                      <ButtonText>Избери снимка</ButtonText>
                    </Button>
                  )}
                </VStack>

                {getFieldError("image") && (
                  <FormControlError>
                    <FormControlErrorText>
                      {getFieldError("image")}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              {/* Submit Button */}
              <Button
                size="lg"
                className="mt-4 bg-primary-500"
                onPress={handleSubmit(onSubmit)}
                isDisabled={isLoading}
              >
                <ButtonText>
                  {isLoading
                    ? "Обработване..."
                    : isEditMode
                      ? "Запази промените"
                      : "Създай подкатегория"}
                </ButtonText>
              </Button>
            </VStack>

            {/* Back Button */}
            <HStack className="items-center justify-center">
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onPress={() => {
                  reset();
                  router.replace(`/sub-category?id=${categoryId}`);
                }}
              >
                <ButtonText>Отказ</ButtonText>
              </Button>
            </HStack>
          </VStack>
        </Card>
      </Box>
    </Box>
  );
}


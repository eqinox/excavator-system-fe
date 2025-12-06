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
import { Input, InputField } from "@/components/ui/input";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { BASE_URL } from "@/constants";
import { EquipmentResponseDto } from "@/dto/equipment.dto";
import {
  AppDispatch,
  RootState,
  createEquipment,
  fetchCategories,
  fetchSubCategories,
  updateEquipment,
} from "@/store";
import {
  equipmentSchema,
  type EquipmentFormData,
} from "@/validation/equipment";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Image as RNImage, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Toast, ToastTitle, useToast } from "../ui/toast";

interface EquipmentFormProps {
  subCategoryId?: string;
  mode?: "create" | "edit";
  initialData?: EquipmentResponseDto;
}

export default function EquipmentForm({
  subCategoryId,
  mode = "create",
  initialData,
}: EquipmentFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const toast = useToast();
  const isLoading = useSelector(
    (state: RootState) => state.equipments.isLoading
  );
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const subCategories = useSelector(
    (state: RootState) => state.subCategories.subCategories
  );

  // Local state for category selection (used only for filtering subcategories)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  const isEditMode = mode === "edit";

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
    mode: "onSubmit",
    defaultValues: {
      subCategoryId: initialData?.subCategoryId || subCategoryId || "",
      name: initialData?.name || "",
      description: initialData?.description || "",
      pricePerDay: initialData?.pricePerDay || 0,
      locationId: initialData?.locationId || "",
      available: initialData?.available ?? true,
      images:
        initialData?.images?.map((img) => ({
          uri: `${BASE_URL}/${img.original}`,
          isExisting: true,
        })) || [],
    },
  });

  const selectedImages = watch("images");
  const selectedSubCategoryId = watch("subCategoryId");

  // Filter subcategories by selected category
  const filteredSubCategories = subCategories.filter(
    (subCat) => subCat.categoryId === selectedCategoryId
  );

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Fetch subcategories when category is selected
  useEffect(() => {
    if (selectedCategoryId) {
      dispatch(fetchSubCategories(selectedCategoryId));
      // Clear subcategory selection when category changes
      setValue("subCategoryId", "");
    } else {
      // Clear subcategory selection if no category is selected
      setValue("subCategoryId", "");
    }
  }, [selectedCategoryId, dispatch, setValue]);

  // If subCategoryId prop is provided, find its category and set it
  useEffect(() => {
    if (subCategoryId && subCategories.length > 0) {
      const subCat = subCategories.find((sc) => sc.id === subCategoryId);
      if (subCat && subCat.categoryId) {
        setSelectedCategoryId(subCat.categoryId);
      }
    }
  }, [subCategoryId, subCategories]);

  // Set initial category when in edit mode
  useEffect(() => {
    if (isEditMode && initialData?.subCategoryId && subCategories.length > 0) {
      const subCat = subCategories.find(
        (sc) => sc.id === initialData.subCategoryId
      );
      if (subCat && subCat.categoryId) {
        setSelectedCategoryId(subCat.categoryId);
      }
    }
  }, [isEditMode, initialData, subCategories]);

  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map((asset: any) => asset);
        setValue("images", [...(selectedImages || []), ...newImages]);
      }
    } catch (error) {
      console.error("Error picking images:", error);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = (selectedImages || []).filter((_, i) => i !== index);
    setValue("images", updatedImages);
  };

  const onSubmit = async (data: EquipmentFormData) => {
    const equipmentData = data as EquipmentFormData;
    const images: any = (equipmentData as any).images;

    let processedImages: string[] = [];
    if (images && images.length > 0) {
      images.forEach((img: any) => {
        let base64Image: string | null = null;

        // Skip existing images (they have isExisting flag)
        if (img && typeof img === "object" && img.isExisting) {
          // Don't include existing images in the update - they're already on the server
          return;
        }

        if (img && typeof img === "object" && img.base64) {
          base64Image = img.base64 as string;
        } else if (
          img &&
          typeof img === "object" &&
          typeof img.uri === "string" &&
          img.uri.startsWith("data:")
        ) {
          const commaIndex = img.uri.indexOf(",");
          if (commaIndex !== -1)
            base64Image = img.uri.substring(commaIndex + 1);
        } else if (typeof img === "string" && img.startsWith("data:")) {
          const commaIndex = img.indexOf(",");
          if (commaIndex !== -1) base64Image = img.substring(commaIndex + 1);
        }

        if (base64Image) {
          processedImages.push(base64Image);
        }
      });
    }

    if (isEditMode && initialData) {
      // Update equipment
      dispatch(
        updateEquipment({
          equipmentId: initialData.id,
          data: { ...equipmentData, images: processedImages },
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
            router.back();
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
      // Create equipment
      dispatch(
        createEquipment({
          data: { ...equipmentData, images: processedImages },
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
            router.push({
              pathname: "/equipment/success",
              params: {
                name: data.name,
                subCategoryId: data.subCategoryId || "",
              },
            });
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

  // Type-safe error access
  const getFieldError = (fieldName: string) => {
    return (errors as any)[fieldName]?.message;
  };

  return (
    <Box className="min-h-screen flex-1 bg-background-300">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Box className="flex-1 items-center justify-center px-4 py-4">
          <Card className="w-full max-w-md bg-background-0 p-6 shadow-lg">
            <VStack space="md" className="w-full">
              {/* Header */}
              <Box className="mb-6 items-center">
                <Text className="mb-2 text-2xl font-bold text-typography-900">
                  {isEditMode
                    ? "Редактирай оборудване"
                    : "Публикувай оборудване"}
                </Text>
                <Text className="text-center text-typography-500">
                  {isEditMode
                    ? "Обновете данните за оборудването"
                    : "Въведете данните за новото оборудване"}
                </Text>
              </Box>

              <VStack space="md" className="w-full">
                {/* Name Field */}
                <FormControl isInvalid={!!getFieldError("name")}>
                  <FormControlLabel>
                    <FormControlLabelText>
                      Име на оборудването *
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input>
                        <InputField
                          placeholder="Напр. CAT 320 Excavator"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          autoCapitalize="words"
                          returnKeyType="next"
                        />
                      </Input>
                    )}
                  />
                  {getFieldError("name") && (
                    <FormControlError>
                      <FormControlErrorText>
                        {getFieldError("name")}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>

                {/* Description Field */}
                <FormControl isInvalid={!!getFieldError("description")}>
                  <FormControlLabel>
                    <FormControlLabelText>Описание *</FormControlLabelText>
                  </FormControlLabel>
                  <Controller
                    control={control}
                    name="description"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input>
                        <InputField
                          placeholder="Описание на оборудването..."
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          multiline
                          numberOfLines={3}
                          returnKeyType="next"
                        />
                      </Input>
                    )}
                  />
                  {getFieldError("description") && (
                    <FormControlError>
                      <FormControlErrorText>
                        {getFieldError("description")}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>

                {/* Price Field */}
                <FormControl isInvalid={!!getFieldError("pricePerDay")}>
                  <FormControlLabel>
                    <FormControlLabelText>
                      Цена на ден (лв.) *
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Controller
                    control={control}
                    name="pricePerDay"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input>
                        <InputField
                          placeholder="150.00"
                          value={value === 0 ? "" : value.toString()}
                          onChangeText={(text) => {
                            // Only allow numeric input with decimal point
                            const numericText = text.replace(/[^0-9.]/g, "");
                            // Prevent multiple decimal points
                            const parts = numericText.split(".");
                            const cleanText =
                              parts.length > 2
                                ? parts[0] + "." + parts.slice(1).join("")
                                : numericText;
                            // Convert to number, default to 0 if empty
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
                  {getFieldError("pricePerDay") && (
                    <FormControlError>
                      <FormControlErrorText>
                        {getFieldError("pricePerDay")}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>

                {/* Category Field */}
                <FormControl>
                  <FormControlLabel>
                    <FormControlLabelText>Категория *</FormControlLabelText>
                  </FormControlLabel>
                  <Select
                    selectedValue={selectedCategoryId}
                    onValueChange={(selectedValue) => {
                      setSelectedCategoryId(selectedValue);
                    }}
                  >
                    <SelectTrigger>
                      <SelectInput
                        placeholder="Избери категория"
                        value={
                          categories.find(
                            (cat) => cat.id === selectedCategoryId
                          )?.name || ""
                        }
                      />
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent>
                        <SelectDragIndicatorWrapper>
                          <SelectDragIndicator />
                        </SelectDragIndicatorWrapper>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            label={category.name}
                            value={category.id}
                          />
                        ))}
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                </FormControl>

                {/* SubCategory Field */}
                <FormControl isInvalid={!!getFieldError("subCategoryId")}>
                  <FormControlLabel>
                    <FormControlLabelText>Подкатегория *</FormControlLabelText>
                  </FormControlLabel>
                  <Controller
                    control={control}
                    name="subCategoryId"
                    render={({ field: { onChange, value } }) => (
                      <Select
                        key={selectedCategoryId || "no-category"}
                        selectedValue={value}
                        onValueChange={(selectedValue) => {
                          onChange(selectedValue);
                        }}
                        isDisabled={!selectedCategoryId}
                      >
                        <SelectTrigger>
                          <SelectInput
                            placeholder={
                              !selectedCategoryId
                                ? "Първо изберете категория"
                                : filteredSubCategories.length === 0
                                  ? "Зареждане..."
                                  : "Избери подкатегория"
                            }
                            value={
                              filteredSubCategories.find(
                                (subCat) => subCat.id === value
                              )?.type || ""
                            }
                          />
                        </SelectTrigger>
                        <SelectPortal>
                          <SelectBackdrop />
                          <SelectContent>
                            <SelectDragIndicatorWrapper>
                              <SelectDragIndicator />
                            </SelectDragIndicatorWrapper>
                            {filteredSubCategories.map((subCategory) => (
                              <SelectItem
                                key={subCategory.id}
                                label={subCategory.type}
                                value={subCategory.id}
                              />
                            ))}
                          </SelectContent>
                        </SelectPortal>
                      </Select>
                    )}
                  />
                  {getFieldError("subCategoryId") && (
                    <FormControlError>
                      <FormControlErrorText>
                        {getFieldError("subCategoryId")}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>

                {/* Location Field */}
                <FormControl isInvalid={!!getFieldError("locationId")}>
                  <FormControlLabel>
                    <FormControlLabelText>Локация *</FormControlLabelText>
                  </FormControlLabel>
                  <Controller
                    control={control}
                    name="locationId"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input variant="outline" size="md">
                        <InputField
                          placeholder="Напр. София, България"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          returnKeyType="done"
                          onSubmitEditing={() => handleSubmit(onSubmit)()}
                        />
                      </Input>
                    )}
                  />
                  <FormControlError>
                    <FormControlErrorText>
                      {getFieldError("locationId")}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>

                {/* Images Field */}
                <FormControl isInvalid={!!getFieldError("images")}>
                  <FormControlLabel>
                    <FormControlLabelText>Изображения *</FormControlLabelText>
                  </FormControlLabel>

                  <VStack space="sm">
                    {selectedImages && selectedImages.length > 0 ? (
                      <VStack space="sm">
                        <Text className="text-sm text-gray-600">
                          Избрани изображения ({selectedImages.length})
                        </Text>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          className="max-h-24"
                        >
                          <HStack space="sm" className="px-1">
                            {selectedImages.map((image: any, index: number) => (
                              <Box key={index} className="relative">
                                <RNImage
                                  source={{ uri: image.uri || image }}
                                  className="h-20 w-20 rounded-lg"
                                  resizeMode="cover"
                                />
                                <Pressable
                                  onPress={() => removeImage(index)}
                                  className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full bg-red-500"
                                >
                                  <Text className="text-xs text-white">×</Text>
                                </Pressable>
                              </Box>
                            ))}
                          </HStack>
                        </ScrollView>
                        <Button
                          variant="outline"
                          size="sm"
                          onPress={() => setValue("images", [])}
                        >
                          <ButtonText>Премахни всички изображения</ButtonText>
                        </Button>
                      </VStack>
                    ) : (
                      <Button
                        variant="outline"
                        onPress={pickImages}
                        disabled={isLoading}
                        className="h-24 items-center justify-center"
                      >
                        <ButtonText>Избери изображения</ButtonText>
                      </Button>
                    )}
                  </VStack>

                  {getFieldError("images") && (
                    <FormControlError>
                      <FormControlErrorText>
                        {getFieldError("images")}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>

                {/* Availability Field */}
                <FormControl>
                  <FormControlLabel>
                    <FormControlLabelText>Наличност</FormControlLabelText>
                  </FormControlLabel>
                  <Controller
                    control={control}
                    name="available"
                    render={({ field: { onChange, value } }) => (
                      <Button
                        variant={value ? "solid" : "outline"}
                        onPress={() => onChange(!value)}
                        className="justify-start"
                      >
                        <Text>{value ? "✓ Налично" : "✗ Не е налично"}</Text>
                      </Button>
                    )}
                  />
                </FormControl>

                {/* Submit Button */}
                <Button
                  size="lg"
                  className="mt-4 bg-primary-500"
                  onPress={handleSubmit(onSubmit)}
                  isDisabled={isLoading}
                >
                  <ButtonText>
                    {isLoading ? "Обработване..." : "Публикувай оборудване"}
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
                    router.back();
                  }}
                >
                  <ButtonText>Отказ</ButtonText>
                </Button>
              </HStack>
            </VStack>
          </Card>
        </Box>
      </ScrollView>
    </Box>
  );
}

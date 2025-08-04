import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/lib/authContext";
import {
  equipmentSchema,
  type EquipmentFormData,
} from "@/validation/equipment";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Platform,
  Pressable,
  Image as RNImage,
  ScrollView,
} from "react-native";

interface EquipmentFormProps {
  categoryId: string;
}

interface ImageFile {
  uri: string;
  type: string;
  name: string;
  file?: File; // For web file input
}

export default function EquipmentForm({ categoryId }: EquipmentFormProps) {
  const router = useRouter();
  const { accessToken, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
    mode: "onChange",
  });

  const pickImages = async () => {
    try {
      console.log("📸 Starting image picker...");
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        aspect: [4, 3],
        base64: false, // Don't use base64
        allowsEditing: false, // Don't allow editing
      });

      console.log("📸 ImagePicker result:", result);

      if (!result.canceled && result.assets) {
        console.log("📸 ImagePicker result:", result.assets);
        const newImages = result.assets.map((asset: any) => {
          // Determine file type from asset or URI extension
          let fileType = asset.type || "image/jpeg";
          let fileName =
            asset.fileName ||
            `image_${Date.now()}_${Math.random()
              .toString(36)
              .substr(2, 9)}.jpg`;

          // If no file type is provided, try to determine from URI
          if (!asset.type) {
            const uri = asset.uri.toLowerCase();
            if (uri.includes(".png")) {
              fileType = "image/png";
              fileName = fileName.replace(".jpg", ".png");
            } else if (uri.includes(".jpeg") || uri.includes(".jpg")) {
              fileType = "image/jpeg";
            }
          }

          console.log("📸 Processing asset:", {
            uri: asset.uri,
            type: fileType,
            name: fileName,
            asset: asset,
          });

          return {
            uri: asset.uri,
            type: fileType,
            name: fileName,
          };
        });
        setSelectedImages((prev) => [...prev, ...newImages]);
      } else {
        console.log("📸 ImagePicker was canceled or no assets");
      }
    } catch (error) {
      console.error("ImagePicker error:", error);
      Alert.alert("Грешка", "Неуспешно избиране на изображения");
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateImages = (): boolean => {
    if (selectedImages.length === 0) {
      Alert.alert("Грешка", "Моля, изберете поне едно изображение");
      return false;
    }
    return true;
  };

  const onSubmit = async (data: EquipmentFormData) => {
    if (!validateImages()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();

      // Add equipment data
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("category_id", categoryId);
      formData.append("price_per_day", data.price_per_day);
      formData.append("location_id", data.location_id);
      formData.append("available", data.available.toString());
      if (user?.id) {
        formData.append("owner", user.id);
      }

      // Add images
      console.log("📸 Adding images to FormData:", selectedImages.length);
      selectedImages.forEach((image, index) => {
        console.log(`📸 Image ${index}:`, {
          uri: image.uri,
          type: image.type,
          name: image.name,
        });

        // For web, use the actual File object if available
        if (image.file) {
          console.log(
            `📸 Appending File object ${index} to FormData:`,
            image.file
          );
          formData.append("images", image.file);
        } else {
          // For React Native/Expo, we need to create a proper file object
          // The server expects Express.Multer.File[] which has these properties
          const imageFile = {
            uri: image.uri,
            type: image.type,
            name: image.name,
          };

          console.log(`📸 Appending image ${index} to FormData:`, imageFile);
          formData.append("images", imageFile as any);
        }
      });

      console.log("📤 FormData created with images");

      await apiClient.authenticatedRequest(
        "/equipment",
        {
          method: "POST",
          body: formData,
          // Don't set Content-Type for FormData - let the browser set it automatically
        },
        accessToken || ""
      );

      Alert.alert("Успех", "Оборудването е създадено успешно!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.error("Failed to create equipment:", error);
      setError(error.message || "Неуспешно създаване на оборудване");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Type-safe error access
  const getFieldError = (fieldName: string) => {
    return (errors as any)[fieldName]?.message;
  };

  return (
    <ScrollView className="flex-1">
      <VStack space="lg" className="flex-1 px-4 py-6">
        <VStack space="md">
          <Text className="text-xl font-bold text-center">
            Публикувай оборудване
          </Text>
        </VStack>

        {/* Global error message */}
        {error && (
          <VStack className="bg-error-50 border border-error-200 rounded-md p-3">
            <Text className="text-error-600 text-sm">{error}</Text>
          </VStack>
        )}

        <VStack space="md" className="flex-1">
          {/* Name Field */}
          <FormControl isInvalid={!!getFieldError("name")}>
            <FormControlLabel>
              <FormControlLabelText>Име на оборудването *</FormControlLabelText>
            </FormControlLabel>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input variant="outline" size="md">
                  <InputField
                    placeholder="Напр. CAT 320 Excavator"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    returnKeyType="next"
                  />
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorText>
                {getFieldError("name")}
              </FormControlErrorText>
            </FormControlError>
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
                <Input variant="outline" size="md">
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
            <FormControlError>
              <FormControlErrorText>
                {getFieldError("description")}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          {/* Price Field */}
          <FormControl isInvalid={!!getFieldError("price_per_day")}>
            <FormControlLabel>
              <FormControlLabelText>Цена на ден (лв.) *</FormControlLabelText>
            </FormControlLabel>
            <Controller
              control={control}
              name="price_per_day"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input variant="outline" size="md">
                  <InputField
                    placeholder="150.00"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    returnKeyType="next"
                  />
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorText>
                {getFieldError("price_per_day")}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          {/* Location Field */}
          <FormControl isInvalid={!!getFieldError("location_id")}>
            <FormControlLabel>
              <FormControlLabelText>Локация *</FormControlLabelText>
            </FormControlLabel>
            <Controller
              control={control}
              name="location_id"
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
                {getFieldError("location_id")}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          {/* Images Field */}
          <FormControl isInvalid={selectedImages.length === 0}>
            <FormControlLabel>
              <FormControlLabelText>Изображения *</FormControlLabelText>
            </FormControlLabel>
            <VStack space="md">
              <VStack space="sm">
                <Button
                  variant="outline"
                  onPress={pickImages}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  <ButtonText>Избери изображения (Expo)</ButtonText>
                </Button>

                {/* Web fallback file input */}
                {Platform.OS === "web" && (
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) {
                        console.log("📸 Web file input files:", files);
                        const newImages = Array.from(files).map((file) => ({
                          uri: URL.createObjectURL(file),
                          type: file.type,
                          name: file.name,
                          file: file, // Store the actual File object
                        }));
                        console.log("📸 Web files processed:", newImages);
                        setSelectedImages((prev) => [...prev, ...newImages]);
                      }
                    }}
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                )}
              </VStack>

              {selectedImages.length > 0 && (
                <VStack space="sm">
                  <Text className="text-sm text-gray-600">
                    Избрани изображения ({selectedImages.length})
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <HStack space="sm">
                      {selectedImages.map((image, index) => (
                        <Box key={index} className="relative">
                          <RNImage
                            source={{ uri: image.uri }}
                            className="w-20 h-20 rounded-lg"
                            resizeMode="cover"
                          />
                          <Pressable
                            onPress={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                          >
                            <Text className="text-white text-xs">×</Text>
                          </Pressable>
                        </Box>
                      ))}
                    </HStack>
                  </ScrollView>
                </VStack>
              )}

              {selectedImages.length === 0 && (
                <FormControlError>
                  <FormControlErrorText>
                    Поне едно изображение е задължително
                  </FormControlErrorText>
                </FormControlError>
              )}
            </VStack>
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
        </VStack>

        <VStack space="md">
          <Button
            onPress={handleSubmit(onSubmit)}
            action="primary"
            variant="solid"
            size="md"
            className="w-full"
            disabled={!isValid || isSubmitting || selectedImages.length === 0}
          >
            <ButtonText>
              {isSubmitting ? "Създаване..." : "Публикувай оборудване"}
            </ButtonText>
          </Button>

          <Button
            variant="outline"
            onPress={() => router.back()}
            disabled={isSubmitting}
            className="w-full"
          >
            <ButtonText>Отказ</ButtonText>
          </Button>
        </VStack>
      </VStack>
    </ScrollView>
  );
}

import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/redux/useReduxHooks';
import {
  equipmentSchema,
  type EquipmentFormData,
} from '@/validation/equipment';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, Image as RNImage, ScrollView } from 'react-native';

interface EquipmentFormProps {
  categoryId: string;
}

export default function EquipmentForm({ categoryId }: EquipmentFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      price_per_day: '',
      location_id: '',
      available: true,
      images: [],
    },
  });

  const selectedImages = watch('images');

  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map((asset: any) => asset);
        setValue('images', [...(selectedImages || []), ...newImages]);
      }
    } catch (error) {
      console.error('Error picking images:', error);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = (selectedImages || []).filter((_, i) => i !== index);
    setValue('images', updatedImages);
  };

  const validateImages = (): boolean => {
    if (!selectedImages || selectedImages.length === 0) {
      Alert.alert('Грешка', 'Моля, изберете поне едно изображение');
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
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('category_id', categoryId);
      formData.append('price_per_day', data.price_per_day);
      formData.append('location_id', data.location_id);
      formData.append('available', data.available.toString());
      if (user?.id) {
        formData.append('owner', user.id);
      }

      // Process images the same way as CategoryForm
      if (selectedImages && selectedImages.length > 0) {
        selectedImages.forEach((img: any) => {
          let base64Image: string | null = null;

          if (img && typeof img === 'object' && img.base64) {
            base64Image = img.base64 as string;
          } else if (
            img &&
            typeof img === 'object' &&
            typeof img.uri === 'string' &&
            img.uri.startsWith('data:')
          ) {
            const commaIndex = img.uri.indexOf(',');
            if (commaIndex !== -1)
              base64Image = img.uri.substring(commaIndex + 1);
          } else if (typeof img === 'string' && img.startsWith('data:')) {
            const commaIndex = img.indexOf(',');
            if (commaIndex !== -1) base64Image = img.substring(commaIndex + 1);
          }

          if (base64Image) {
            formData.append('images', base64Image);
          }
        });
      }

      await apiClient.authenticatedRequest('/equipment', {
        method: 'POST',
        body: formData,
      });

      Alert.alert('Успех', 'Оборудването е създадено успешно!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.error('Failed to create equipment:', error);
      setError(error.message || 'Неуспешно създаване на оборудване');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Type-safe error access
  const getFieldError = (fieldName: string) => {
    return (errors as any)[fieldName]?.message;
  };

  return (
    <ScrollView className='flex-1'>
      <VStack space='lg' className='flex-1 px-4 py-6'>
        <VStack space='md'>
          <Text className='text-center text-xl font-bold'>
            Публикувай оборудване
          </Text>
        </VStack>

        {/* Global error message */}
        {error && (
          <VStack className='rounded-md border border-error-200 bg-error-50 p-3'>
            <Text className='text-sm text-error-600'>{error}</Text>
          </VStack>
        )}

        <VStack space='md' className='flex-1'>
          {/* Name Field */}
          <FormControl isInvalid={!!getFieldError('name')}>
            <FormControlLabel>
              <FormControlLabelText>Име на оборудването *</FormControlLabelText>
            </FormControlLabel>
            <Controller
              control={control}
              name='name'
              render={({ field: { onChange, onBlur, value } }) => (
                <Input variant='outline' size='md'>
                  <InputField
                    placeholder='Напр. CAT 320 Excavator'
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    returnKeyType='next'
                  />
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorText>
                {getFieldError('name')}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          {/* Description Field */}
          <FormControl isInvalid={!!getFieldError('description')}>
            <FormControlLabel>
              <FormControlLabelText>Описание *</FormControlLabelText>
            </FormControlLabel>
            <Controller
              control={control}
              name='description'
              render={({ field: { onChange, onBlur, value } }) => (
                <Input variant='outline' size='md'>
                  <InputField
                    placeholder='Описание на оборудването...'
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    multiline
                    numberOfLines={3}
                    returnKeyType='next'
                  />
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorText>
                {getFieldError('description')}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          {/* Price Field */}
          <FormControl isInvalid={!!getFieldError('price_per_day')}>
            <FormControlLabel>
              <FormControlLabelText>Цена на ден (лв.) *</FormControlLabelText>
            </FormControlLabel>
            <Controller
              control={control}
              name='price_per_day'
              render={({ field: { onChange, onBlur, value } }) => (
                <Input variant='outline' size='md'>
                  <InputField
                    placeholder='150.00'
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType='numeric'
                    returnKeyType='next'
                  />
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorText>
                {getFieldError('price_per_day')}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          {/* Location Field */}
          <FormControl isInvalid={!!getFieldError('location_id')}>
            <FormControlLabel>
              <FormControlLabelText>Локация *</FormControlLabelText>
            </FormControlLabel>
            <Controller
              control={control}
              name='location_id'
              render={({ field: { onChange, onBlur, value } }) => (
                <Input variant='outline' size='md'>
                  <InputField
                    placeholder='Напр. София, България'
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    returnKeyType='done'
                    onSubmitEditing={() => handleSubmit(onSubmit)()}
                  />
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorText>
                {getFieldError('location_id')}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          {/* Images Field */}
          <FormControl isInvalid={selectedImages.length === 0}>
            <FormControlLabel>
              <FormControlLabelText>Изображения *</FormControlLabelText>
            </FormControlLabel>
            <VStack space='md'>
              <VStack space='sm'>
                <Button
                  variant='outline'
                  onPress={pickImages}
                  disabled={isSubmitting}
                  className='w-full'
                >
                  <ButtonText>Избери изображения</ButtonText>
                </Button>
              </VStack>

              {selectedImages && selectedImages.length > 0 && (
                <VStack space='sm'>
                  <Text className='text-sm text-gray-600'>
                    Избрани изображения ({selectedImages.length})
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <HStack space='sm'>
                      {selectedImages.map((image: any, index: number) => (
                        <Box key={index} className='relative'>
                          <RNImage
                            source={{ uri: image.uri || image }}
                            className='h-20 w-20 rounded-lg'
                            resizeMode='cover'
                          />
                          <Pressable
                            onPress={() => removeImage(index)}
                            className='absolute -right-2 -top-2 h-6 w-6 items-center justify-center rounded-full bg-red-500'
                          >
                            <Text className='text-xs text-white'>×</Text>
                          </Pressable>
                        </Box>
                      ))}
                    </HStack>
                  </ScrollView>
                </VStack>
              )}

              {(!selectedImages || selectedImages.length === 0) && (
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
              name='available'
              render={({ field: { onChange, value } }) => (
                <Button
                  variant={value ? 'solid' : 'outline'}
                  onPress={() => onChange(!value)}
                  className='justify-start'
                >
                  <Text>{value ? '✓ Налично' : '✗ Не е налично'}</Text>
                </Button>
              )}
            />
          </FormControl>
        </VStack>

        <VStack space='md'>
          <Button
            onPress={handleSubmit(onSubmit)}
            action='primary'
            variant='solid'
            size='md'
            className='w-full'
            disabled={
              !isValid ||
              isSubmitting ||
              !selectedImages ||
              selectedImages.length === 0
            }
          >
            <ButtonText>
              {isSubmitting ? 'Създаване...' : 'Публикувай оборудване'}
            </ButtonText>
          </Button>

          <Button
            variant='outline'
            onPress={() => router.back()}
            disabled={isSubmitting}
            className='w-full'
          >
            <ButtonText>Отказ</ButtonText>
          </Button>
        </VStack>
      </VStack>
    </ScrollView>
  );
}

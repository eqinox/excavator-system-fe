import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { useAuth } from '@/lib/authContext';
import { categorySchema, type CategoryFormData } from '@/validation/category';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Image } from 'react-native';

interface CategoryFormProps {
  mode?: 'create' | 'edit';
  initialData?: CategoryFormData;
}

export default function CategoryForm({
  mode = 'create',
  initialData,
}: CategoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useLocalSearchParams();
  const router = useRouter();
  const { accessToken } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const isEditMode = mode === 'edit' || params.mode === 'edit';

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData || {
      name: '',
      image: null,
    },
  });

  const selectedImage = watch('image');

  // Set initial values if editing
  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name);
    }
  }, [initialData, setValue]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        setValue('image', result.assets[0]);
      }
    } catch (error) {
      setError('Грешка при избор на снимка');
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (isEditMode) {
        // TODO: Implement edit API call
        // await updateCategory(categoryId, data);
      } else {
        // Validate that image is selected
        if (!data.image) {
          throw new Error('Снимката е задължителна');
        }

        // Create FormData exactly like Postman
        const formData = new FormData();

        // Text field (like Postman form-data text field)
        formData.append('name', data.name);

        // File field (like Postman form-data file field)
        // For web browsers, we need to convert base64 to a Blob
        if (data.image.uri.startsWith('data:')) {
          // Convert base64 to Blob
          const response = await fetch(data.image.uri);
          const blob = await response.blob();

          // Create a File object from the Blob
          const file = new File(
            [blob],
            data.image.fileName || 'category-image.jpg',
            {
              type: data.image.mimeType || 'image/jpeg',
            }
          );

          formData.append('image', file);
        } else {
          // For non-base64 URIs (native React Native)
          const imageFile = {
            uri: data.image.uri,
            type: data.image.type || 'image/jpeg',
            name: data.image.fileName || 'category-image.jpg',
          };
          formData.append('image', imageFile as any);
        }

        const response = await apiClient.authenticatedRequest(
          '/categories',
          {
            method: 'POST',
            body: formData,
          },
          accessToken || ''
        );

        router.replace('/categories');
      }

      reset();
    } catch (error: any) {
      setError(error.message || 'Възникна грешка при създаване на категорията');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (fieldName: string) => {
    return (errors as any)[fieldName]?.message;
  };

  return (
    <Box className='min-h-screen flex-1 bg-background-300'>
      <Box className='py-safe flex-1 items-center justify-center px-4'>
        <Card className='w-full max-w-md bg-background-0 p-6 shadow-lg'>
          <VStack space='md' className='w-full'>
            {/* Header */}
            <Box className='mb-6 items-center'>
              <Text className='mb-2 text-2xl font-bold text-typography-900'>
                {isEditMode
                  ? 'Редактиране на категория'
                  : 'Добавяне на категория'}
              </Text>
              <Text className='text-center text-typography-500'>
                {isEditMode
                  ? 'Редактирайте данните на категорията'
                  : 'Въведете данните за новата категория'}
              </Text>
            </Box>

            <VStack space='md' className='w-full'>
              {/* Global error message */}
              {error && (
                <Box className='rounded-md border border-error-200 bg-error-50 p-3'>
                  <Text className='text-sm text-error-600'>{error}</Text>
                </Box>
              )}

              {/* Category Name Field */}
              <FormControl isInvalid={!!getFieldError('name')}>
                <FormControlLabel>
                  <FormControlLabelText>
                    Име на категорията
                  </FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={control}
                  name='name'
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input>
                      <InputField
                        placeholder='Въведете име на категорията'
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        autoCapitalize='words'
                        onSubmitEditing={() => handleSubmit(onSubmit)()}
                      />
                    </Input>
                  )}
                />
                {getFieldError('name') && (
                  <FormControlError>
                    <FormControlErrorText>
                      {getFieldError('name')}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              {/* Image Upload Field */}
              <FormControl isInvalid={!!getFieldError('image')}>
                <FormControlLabel>
                  <FormControlLabelText>
                    Снимка на категорията
                  </FormControlLabelText>
                </FormControlLabel>

                <VStack space='sm'>
                  {selectedImage ? (
                    <Box className='items-center'>
                      <Image
                        source={{ uri: selectedImage.uri }}
                        className='h-32 w-32 rounded-lg'
                        resizeMode='cover'
                      />
                      <Button
                        variant='outline'
                        size='sm'
                        className='mt-2'
                        onPress={() => setValue('image', null)}
                      >
                        <ButtonText>Премахни снимката</ButtonText>
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      variant='outline'
                      onPress={pickImage}
                      className='h-32 items-center justify-center'
                    >
                      <ButtonText>Избери снимка</ButtonText>
                    </Button>
                  )}
                </VStack>

                {getFieldError('image') && (
                  <FormControlError>
                    <FormControlErrorText>
                      {getFieldError('image')}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              {/* Submit Button */}
              <Button
                size='lg'
                className='mt-4 bg-primary-500'
                onPress={handleSubmit(onSubmit)}
                isDisabled={isSubmitting}
              >
                <ButtonText>
                  {isSubmitting
                    ? 'Обработване...'
                    : isEditMode
                      ? 'Запази промените'
                      : 'Създай категория'}
                </ButtonText>
              </Button>
            </VStack>

            {/* Back Button */}
            <HStack className='items-center justify-center'>
              <Button
                variant='outline'
                size='sm'
                className='mt-2'
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
    </Box>
  );
}

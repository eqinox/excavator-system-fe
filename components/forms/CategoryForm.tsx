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
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
// import { useCategories } from '@/redux/useReduxHooks';
import {
  categoryCreateSchema,
  categoryUpdateSchema,
  type CategoryCreateData,
  type CategoryUpdateData,
} from '@/validation/category';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Image } from 'react-native';

interface CategoryFormProps {
  mode?: 'create' | 'edit';
  initialData?: CategoryUpdateData | CategoryCreateData;
}

export default function CategoryForm({
  mode = 'create',
  initialData,
}: CategoryFormProps) {
  const params = useLocalSearchParams();
  const router = useRouter();
  // const {
  //   addCategory,
  //   editCategory,
  //   categoriesLoading,
  //   categoriesError,
  //   clearCategoriesError,
  // } = useCategories();
  const isEditMode = mode === 'edit' || params.mode === 'edit';

  // Use different schemas based on mode
  const schema = isEditMode ? categoryUpdateSchema : categoryCreateSchema;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CategoryUpdateData | CategoryCreateData>({
    resolver: zodResolver(schema),
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
      if (isEditMode && 'id' in initialData) {
        setValue('id', initialData.id);
      }
    }
  }, [initialData, setValue, isEditMode]);

  // Clear error when component mounts
  // useEffect(() => {
  //   clearCategoriesError();
  // }, [clearCategoriesError]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        setValue('image', result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  // const onSubmit = async (data: CategoryUpdateData | CategoryCreateData) => {
  //   try {
  //     if (isEditMode) {
  //       const updateData = data as CategoryUpdateData;

  //       const img: any = (updateData as any).image;
  //       const payload: any = { name: updateData.name };

  //       if (img) {
  //         if (typeof img === 'object' && img.base64) {
  //           payload.image = img.base64 as string;
  //         } else if (
  //           typeof img === 'object' &&
  //           typeof img.uri === 'string' &&
  //           img.uri.startsWith('data:')
  //         ) {
  //           const commaIndex = img.uri.indexOf(',');
  //           if (commaIndex !== -1)
  //             payload.image = img.uri.substring(commaIndex + 1);
  //         } else if (typeof img === 'string' && img.startsWith('data:')) {
  //           const commaIndex = img.indexOf(',');
  //           if (commaIndex !== -1)
  //             payload.image = img.substring(commaIndex + 1);
  //         }
  //       }

  //       await editCategory(updateData.id, payload);
  //     } else {
  //       const createdCategory = data as CategoryCreateData;
  //       const img: any = (createdCategory as any).image;

  //       let base64Image: string | null = null;
  //       if (img && typeof img === 'object' && img.base64) {
  //         base64Image = img.base64 as string;
  //       } else if (
  //         img &&
  //         typeof img === 'object' &&
  //         typeof img.uri === 'string' &&
  //         img.uri.startsWith('data:')
  //       ) {
  //         const commaIndex = img.uri.indexOf(',');
  //         if (commaIndex !== -1)
  //           base64Image = img.uri.substring(commaIndex + 1);
  //       } else if (typeof img === 'string' && img.startsWith('data:')) {
  //         const commaIndex = img.indexOf(',');
  //         if (commaIndex !== -1) base64Image = img.substring(commaIndex + 1);
  //       }

  //       const result = await addCategory({
  //         name: createdCategory.name,
  //         image: base64Image || '',
  //       });
  //     }

  //     router.replace('/categories');
  //     reset();
  //   } catch (error: any) {
  //     console.log('❌ Error caught:', error);
  //     console.log('❌ Error message:', error.message);
  //   }
  // };

  const getFieldError = (fieldName: string) => {
    return (errors as any)[fieldName]?.message;
  };

  return (
    <Box className='min-h-screen flex-1 bg-background-300'>
      <Box className='flex-1 items-center justify-center px-4 py-4'>
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
              {/* {categoriesError && (
                <Box className='rounded-md border border-error-200 bg-error-50 p-3'>
                  <Text className='text-sm text-error-600'>
                    {categoriesError}
                  </Text>
                </Box>
              )} */}

              {/* Category Name Field */}
              {/* <FormControl isInvalid={!!getFieldError('name')}>
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
              </FormControl> */}

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
                      {/* <AuthenticatedImage uri={selectedImage} /> */}
                      <Image
                        source={{ uri: selectedImage.uri || selectedImage }}
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
              {/* <Button
                size='lg'
                className='mt-4 bg-primary-500'
                onPress={handleSubmit(onSubmit)}
                isDisabled={categoriesLoading}
              >
                <ButtonText>
                  {categoriesLoading
                    ? 'Обработване...'
                    : isEditMode
                      ? 'Запази промените'
                      : 'Създай категория'}
                </ButtonText>
              </Button> */}
            </VStack>

            {/* Back Button */}
            <HStack className='items-center justify-center'>
              <Button
                variant='outline'
                size='sm'
                className='mt-2'
                onPress={() => {
                  reset();
                  router.replace('/categories');
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

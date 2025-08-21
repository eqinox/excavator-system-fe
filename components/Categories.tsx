import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { EditIcon, TrashIcon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { BASE_URL } from '@/constants';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/lib/authContext';
import {
  CategoriesResponseDto,
  CategoryResponseDataDto,
} from '@/lib/dto/server/category.dto';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { Button } from './ui/button';
import { Toast, ToastTitle, useToast } from './ui/toast';

export default function Categories() {
  const router = useRouter();
  const toast = useToast();
  const { user, accessToken, logout } = useAuth();
  const [categories, setCategories] = useState<CategoryResponseDataDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const handleImageError = (index: number) => {
    setFailedImages(prev => new Set(prev).add(index));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        // Make authenticated request to /categories
        const response =
          await apiClient.authenticatedRequest<CategoriesResponseDto>(
            '/categories',
            { method: 'GET' },
            accessToken || ''
          );

        setCategories(response.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchCategories();
    } else {
      console.log('⚠️ No accessToken available, skipping fetch');
    }
  }, [accessToken]);

  const handleCategoryPress = (categoryId: string) => {
    router.push({
      pathname: '/equipments',
      params: { id: categoryId.toString() },
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAddCategory = () => {
    router.push('/category/add');
  };

  const handleEditCategory = (categoryId: string) => {
    router.push({
      pathname: '/category/edit',
      params: { id: categoryId },
    });
  };

  const handleRemoveCategory = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      const response = await apiClient.authenticatedRequest<{
        message: string;
      }>(
        `/categories/${categoryToDelete}`,
        { method: 'DELETE' },
        accessToken || ''
      );

      // Remove from local state
      setCategories(prev => prev.filter(cat => cat.id !== categoryToDelete));
      toast.show({
        placement: 'top',
        duration: 3000,
        render: ({ id }) => {
          return (
            <Toast action='muted' variant='solid'>
              <ToastTitle>{response.message}</ToastTitle>
            </Toast>
          );
        },
      });
    } catch (error) {
      console.error('Failed to remove category:', error);
      toast.show({
        placement: 'top',
        duration: 3000,
        render: ({ id }) => {
          return (
            <Toast action='muted' variant='solid'>
              <ToastTitle>
                {error instanceof Error
                  ? error.message
                  : 'Failed to remove category'}
              </ToastTitle>
            </Toast>
          );
        },
      });
    } finally {
      setShowDeleteDialog(false);
      setCategoryToDelete(null);
    }
  };

  const cancelDeleteCategory = () => {
    setShowDeleteDialog(false);
    setCategoryToDelete(null);
  };

  if (loading) {
    return (
      <Center className='flex-1'>
        <Text>Зареждане на категории...</Text>
      </Center>
    );
  }

  if (error) {
    return (
      <Center className='flex-1'>
        <VStack space='md'>
          <Button variant='outline' onPress={handleLogout} className='w-full'>
            <Text>Излез от системата</Text>
          </Button>
          <Text className='text-red-500'>{error}</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <VStack className='flex-1 justify-start px-4'>
      <VStack space='xl' className='w-full max-w-4xl'>
        <VStack space='md'>
          <HStack className='items-center justify-between'>
            <Heading size='xl' className='flex-1 text-center'>
              Категории
            </Heading>
            <Button variant='outline' onPress={handleLogout} className='ml-4'>
              <Text>Излез</Text>
            </Button>
          </HStack>
        </VStack>

        <VStack space='lg' className='w-full'>
          <HStack space='md' className='flex-wrap justify-center'>
            {categories.map((category, index) => (
              <VStack key={index} space='sm' className='items-center'>
                <Pressable
                  className='bg-primary flex h-48 w-48 cursor-pointer items-center justify-center overflow-hidden rounded-lg shadow-md'
                  onPress={() => handleCategoryPress(category.id)}
                >
                  {category.image && (
                    <Image
                      source={{
                        uri: `${BASE_URL}/images/${category.image.small}`,
                      }}
                      className='h-full w-full'
                      resizeMode='cover'
                      onError={() => handleImageError(index)}
                    />
                  )}
                </Pressable>
                {user?.role === 'admin' && (
                  <HStack space='md'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onPress={() => handleEditCategory(category.id)}
                      className='bg-yellow-500 p-2'
                    >
                      <EditIcon className='h-4 w-4 text-white' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onPress={() => handleRemoveCategory(category.id)}
                      className='bg-red-500 p-2 text-white'
                    >
                      <TrashIcon className='h-4 w-4 text-white' />
                    </Button>
                  </HStack>
                )}
                <Text className='max-w-24 text-center text-sm font-medium'>
                  {category.name}
                </Text>
              </VStack>
            ))}
            {categories.length === 0 && (
              <Text className='text-center text-sm'>
                Няма налични категории
              </Text>
            )}
            {user?.role === 'admin' && (
              <Button
                variant='outline'
                onPress={handleAddCategory}
                className='ml-4'
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
            <Text className='text-lg font-semibold text-typography-900'>
              Изтриване на категория
            </Text>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text className='text-typography-600'>
              Сигурни ли сте, че искате да изтриете тази категория? Това
              действие не може да бъде отменено.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              variant='outline'
              onPress={cancelDeleteCategory}
              className='mr-2'
            >
              <Text>Отказ</Text>
            </Button>
            <Button
              variant='solid'
              onPress={confirmDeleteCategory}
              className='bg-red-500'
            >
              <Text className='text-white'>Изтрий</Text>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </VStack>
  );
}

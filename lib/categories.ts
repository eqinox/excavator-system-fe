import { CategoryUpdateData } from '@/validation/category';
import { apiClient } from './api';
import {
  CategoriesResponseDto,
  CategoryResponseDto,
} from './dto/server/category.dto';

export const loadAllCategories = async () => {
  const categories =
    await apiClient.authenticatedRequest<CategoriesResponseDto>('/categories', {
      method: 'GET',
    });
  return categories;
};

export const findCategoryById = async (id: string) => {
  const category = await apiClient.authenticatedRequest<CategoryResponseDto>(
    `/categories/${id}`,
    {
      method: 'GET',
    }
  );
  return category;
};

export const createCategory = async (data: { name: string; image: string }) => {
  const category = await apiClient.authenticatedRequest<CategoryResponseDto>(
    '/categories',
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
  return category;
};

export const updateCategory = async (id: string, data: CategoryUpdateData) => {
  const category = await apiClient.authenticatedRequest<CategoryResponseDto>(
    `/categories/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    }
  );
  return category;
};

export const deleteCategory = async (id: string) => {
  const response = await apiClient.authenticatedRequest<{ message: string }>(
    `/categories/${id}`,
    {
      method: 'DELETE',
    }
  );
  return response;
};

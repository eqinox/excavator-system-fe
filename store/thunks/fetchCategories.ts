import {
  CategoriesResponseDto,
  CategoryDeleteResponseDto,
  CategoryResponseDto,
} from '@/dto/server/category.dto';
import { assertNoError } from '@/lib/helpers';
import { CategoryCreateData, CategoryUpdateData } from '@/validation/category';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { apiSlice } from '../slices/apiSlice';

const fetchCategories = createAsyncThunk(
  'categories/fetch',
  async (_, { dispatch }) => {
    const result = (await dispatch(
      apiSlice.endpoints.authenticatedGet.initiate('/categories')
    )) as { data: CategoriesResponseDto } | { error: FetchBaseQueryError };

    assertNoError(result, 'An error occurred during fetch categories');
    if (result.data.statusCode >= 200 || result.data.statusCode < 300) {
      return result.data.data;
    } else {
      throw new Error(result.data.message);
    }
  }
);

const createCategory = createAsyncThunk(
  'categories/create',
  async (
    {
      data,
      onSuccess,
      onError,
    }: {
      data: CategoryCreateData;
      onSuccess?: (message: string) => void;
      onError?: (message: string) => void;
    },
    { dispatch }
  ) => {
    try {
      const result = (await dispatch(
        apiSlice.endpoints.authenticatedPost.initiate({
          url: '/categories',
          data: data,
        })
      )) as { data: CategoryResponseDto } | { error: FetchBaseQueryError };

      assertNoError(result, 'Възникна грешка при създаване на категория');

      if (result.data.statusCode >= 200 && result.data.statusCode < 300) {
        onSuccess?.(result.data.message);
        return {
          message: result.data.message,
          data: result.data.data,
        };
      } else {
        onError?.(result.data.message);
        throw new Error(result.data.message);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Грешка при създаване на категория';
      onError?.(errorMessage);
      throw error;
    }
  }
);

const editCategory = createAsyncThunk(
  'categories/edit',
  async (
    {
      data,
      onSuccess,
      onError,
    }: {
      data: CategoryUpdateData;
      onSuccess?: (message: string) => void;
      onError?: (message: string) => void;
    },
    { dispatch }
  ) => {
    try {
      const result = (await dispatch(
        apiSlice.endpoints.authenticatedPut.initiate({
          url: '/categories',
          data: data,
        })
      )) as { data: CategoryResponseDto } | { error: FetchBaseQueryError };

      assertNoError(result, 'Възникна грешка при редактиране на категория');

      if (result.data.statusCode >= 200 && result.data.statusCode < 300) {
        onSuccess?.(result.data.message);
        return { message: result.data.message, data: result.data.data };
      } else {
        onError?.(result.data.message);
        throw new Error(result.data.message);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Грешка при редактиране на категория';
      onError?.(errorMessage);
      throw error;
    }
  }
);

const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (
    {
      categoryId,
      onSuccess,
      onError,
    }: {
      categoryId: string;
      onSuccess?: (message: string) => void;
      onError?: (message: string) => void;
    },
    { dispatch }
  ) => {
    try {
      const result = (await dispatch(
        apiSlice.endpoints.authenticatedDelete.initiate(
          `/categories/${categoryId}`
        )
      )) as
        | { data: CategoryDeleteResponseDto }
        | { error: FetchBaseQueryError };

      assertNoError(result, 'Възникна грешка при изтриване на категория');

      if (result.data.statusCode >= 200 && result.data.statusCode < 300) {
        onSuccess?.(result.data.message);
        return { id: categoryId, message: result.data.message };
      } else {
        onError?.(result.data.message);
        throw new Error(result.data.message);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Грешка при изтриване на категория';
      onError?.(errorMessage);
      throw error;
    }
  }
);

export { createCategory, deleteCategory, editCategory, fetchCategories };

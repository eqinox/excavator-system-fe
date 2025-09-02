import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createCategory,
  deleteCategory as deleteCategoryAPI,
  findCategoryById,
  loadAllCategories,
  updateCategory,
} from '../lib/categories';
import {
  CategoryResponseDataDto,
  CategoryResponseDto,
} from '../lib/dto/server/category.dto';
import { useAuth } from './authContext';

interface AppContextType {
  // Categories
  categories: CategoryResponseDataDto[];
  categoriesLoading: boolean;
  categoriesError: string | null;

  // Category operations
  refreshCategories: () => Promise<void>;
  addCategory: (data: {
    name: string;
    image: string;
  }) => Promise<CategoryResponseDto>;
  editCategory: (id: string, data: any) => Promise<CategoryResponseDto>;
  deleteCategory: (id: string) => Promise<void>;
  getCategoryById: (id: string) => Promise<CategoryResponseDto>;

  // Global app state
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();

  // Categories state
  const [categories, setCategories] = useState<CategoryResponseDataDto[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // Global app state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear categories when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setCategories([]);
      setCategoriesError(null);
    }
  }, [isAuthenticated]);

  const refreshCategories = async () => {
    if (!isAuthenticated) return;

    setCategoriesLoading(true);
    setCategoriesError(null);

    try {
      const response = await loadAllCategories();
      setCategories(response.data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load categories';
      setCategoriesError(errorMessage);
      console.error('Failed to load categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const addCategory = async (data: {
    name: string;
    image: string;
  }): Promise<CategoryResponseDto> => {
    setIsLoading(true);
    setError(null);

    try {
      const newCategory = await createCategory(data);

      // Add the new category to the local state
      setCategories(prev => [...prev, newCategory.data]);

      return newCategory;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create category';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const editCategory = async (
    id: string,
    data: any
  ): Promise<CategoryResponseDto> => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedCategory = await updateCategory(id, data);

      // Update the category in local state
      setCategories(prev =>
        prev.map(cat => (cat.id === id ? updatedCategory.data : cat))
      );

      return updatedCategory;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update category';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteCategoryAPI(id);

      // Remove the category from local state
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete category';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryById = async (id: string): Promise<CategoryResponseDto> => {
    try {
      const response = await findCategoryById(id);
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to get category';
      setError(errorMessage);
      throw error;
    }
  };

  const clearError = () => {
    setError(null);
    setCategoriesError(null);
  };

  const value: AppContextType = {
    // Categories
    categories,
    categoriesLoading,
    categoriesError,

    // Category operations
    refreshCategories,
    addCategory,
    editCategory,
    deleteCategory,
    getCategoryById,

    // Global app state
    isLoading,
    error,
    clearError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

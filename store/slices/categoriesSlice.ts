import { createSlice } from '@reduxjs/toolkit';
import { CategoryResponseDataDto } from '../../dto/server/category.dto';
import {
  createCategory,
  deleteCategory,
  editCategory,
  fetchCategories,
  findCategoryById,
} from '../thunks/fetchCategories';

export interface CategoriesState {
  categories: CategoryResponseDataDto[];
  isLoading: boolean;
  error: string | null;
  selectedCategory: CategoryResponseDataDto | null;
  message: string;
}

const initialState: CategoriesState = {
  categories: [],
  isLoading: false,
  error: null,
  selectedCategory: null,
  message: '',
};

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers(builder) {
    // Fetch categories
    builder.addCase(fetchCategories.pending, (state, action) => {
      state.isLoading = true;
      state.categories = [];
      state.error = null;
      state.message = '';
    });
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.isLoading = false;
      state.categories = action.payload;
      state.error = null;
    });
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to fetch categories';
      state.message = '';
    });

    // Create category
    builder.addCase(createCategory.pending, (state, action) => {
      state.isLoading = true;
      state.categories = [];
      state.error = null;
      state.message = '';
    });
    builder.addCase(createCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.categories.push(action.payload.data);
      state.message = action.payload.message;
      state.error = null;
    });
    builder.addCase(createCategory.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to create category';
      state.message = '';
    });

    // Edit category
    builder.addCase(editCategory.pending, (state, action) => {
      state.isLoading = true;
      state.categories = [];
      state.error = null;
      state.message = '';
    });
    builder.addCase(editCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.message = action.payload.message;
      state.error = null;
    });
    builder.addCase(editCategory.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to edit category';
      state.message = '';
    });

    // Delete category
    builder.addCase(deleteCategory.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
      state.message = '';
    });
    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.categories = state.categories.filter(
        category => category.id !== action.payload.id
      );
      state.message = action.payload.message;
      state.error = null;
    });
    builder.addCase(deleteCategory.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to delete category';
      state.message = '';
    });

    // Find category by id
    builder.addCase(findCategoryById.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
      state.message = '';
    });
    builder.addCase(findCategoryById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.selectedCategory = action.payload;
      state.error = null;
    });
    builder.addCase(findCategoryById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to find category by id';
      state.message = '';
    });
  },
});

export const categoriesReducer = categoriesSlice.reducer;

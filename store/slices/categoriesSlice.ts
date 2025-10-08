import { createSlice } from '@reduxjs/toolkit';
import { CategoryResponseDataDto } from '../../dto/server/category.dto';
import { fetchCategories } from '../thunks/fetchCategories';

interface CategoriesState {
  categories: CategoryResponseDataDto[];
  isLoading: boolean;
  error: string | null;
  selectedCategory: CategoryResponseDataDto | null;
}

const initialState: CategoriesState = {
  categories: [],
  isLoading: false,
  error: null,
  selectedCategory: null,
};

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchCategories.pending, (state, action) => {
      state.isLoading = true;
      state.categories = [];
      state.error = null;
    });
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.isLoading = false;
      state.categories = action.payload;
      state.error = null;
    });
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to fetch categories';
    });
  },
});

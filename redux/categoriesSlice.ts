import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  createCategory,
  deleteCategory,
  findCategoryById,
  loadAllCategories,
  updateCategory,
} from '../lib/categories';
import { CategoryResponseDataDto } from '../lib/dto/server/category.dto';

// Action type constants
const FETCH_CATEGORIES = 'FETCH_CATEGORIES';
const ADD_CATEGORY = 'ADD_CATEGORY';
const UPDATE_CATEGORY = 'UPDATE_CATEGORY';
const DELETE_CATEGORY = 'DELETE_CATEGORY';
const FETCH_CATEGORY_BY_ID = 'FIND_CATEGORY_BY_ID';

// Async thunks for API calls
export const fetchCategories = createAsyncThunk(FETCH_CATEGORIES, async () => {
  const response = await loadAllCategories();
  return response.data;
});

export const addCategory = createAsyncThunk(
  ADD_CATEGORY,
  async (data: { name: string; image: string }) => {
    const response = await createCategory(data);
    return response.data;
  }
);

export const updateCategoryById = createAsyncThunk(
  UPDATE_CATEGORY,
  async ({ id, data }: { id: string; data: any }) => {
    const response = await updateCategory(id, data);
    return response.data;
  }
);

export const deleteCategoryById = createAsyncThunk(
  DELETE_CATEGORY,
  async (id: string) => {
    await deleteCategory(id);
    return id;
  }
);

export const fetchCategoryById = createAsyncThunk(
  FETCH_CATEGORY_BY_ID,
  async (id: string) => {
    const response = await findCategoryById(id);
    return response.data;
  }
);

interface CategoriesState {
  categories: CategoryResponseDataDto[];
  loading: boolean;
  error: string | null;
  selectedCategory: CategoryResponseDataDto | null;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
  selectedCategory: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategoriesError: state => {
      state.error = null;
    },
    clearSelectedCategory: state => {
      state.selectedCategory = null;
    },
    setSelectedCategory: (
      state,
      action: PayloadAction<CategoryResponseDataDto>
    ) => {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: builder => {
    // Fetch categories
    builder
      .addCase(fetchCategories.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      });

    // Add category
    builder
      .addCase(addCategory.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add category';
      });

    // Update category
    builder
      .addCase(updateCategoryById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(
          cat => cat.id === action.payload.id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update category';
      });

    // Delete category
    builder
      .addCase(deleteCategoryById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          cat => cat.id !== action.payload
        );
      })
      .addCase(deleteCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete category';
      });

    // Fetch category by ID
    builder
      .addCase(fetchCategoryById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch category';
      });
  },
});

export const {
  clearCategoriesError,
  clearSelectedCategory,
  setSelectedCategory,
} = categoriesSlice.actions;
export default categoriesSlice.reducer;

import {
  addCategory,
  clearCategoriesError,
  clearSelectedCategory,
  deleteCategoryById,
  fetchCategories,
  fetchCategoryById,
  setSelectedCategory,
  updateCategoryById,
} from './categoriesSlice';
import { useAppDispatch, useAppSelector } from './hooks';
import {
  clearUser,
  clearUserError,
  initializeAuth,
  loginUser,
  logoutUser,
  refreshUserToken,
  registerUser,
  setTokenExpiry,
  setUser,
  validateUserToken,
} from './userSlice';

// Categories hooks
export const useCategories = () => {
  const dispatch = useAppDispatch();
  const { categories, loading, error, selectedCategory } = useAppSelector(
    state => state.categories
  );

  return {
    // State
    categories,
    categoriesLoading: loading,
    categoriesError: error,
    selectedCategory,

    // Actions
    refreshCategories: () => dispatch(fetchCategories()),
    addCategory: (data: { name: string; image: string }) =>
      dispatch(addCategory(data)),
    editCategory: (id: string, data: any) =>
      dispatch(updateCategoryById({ id, data })),
    deleteCategory: (id: string) => dispatch(deleteCategoryById(id)),
    getCategoryById: (id: string) => dispatch(fetchCategoryById(id)),
    clearCategoriesError: () => dispatch(clearCategoriesError()),
    clearSelectedCategory: () => dispatch(clearSelectedCategory()),
    setSelectedCategory: (category: any) =>
      dispatch(setSelectedCategory(category)),
  };
};

// User/Auth hooks
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading, error, tokenExpiry } = useAppSelector(
    state => state.user
  );

  return {
    // State
    user,
    isAuthenticated,
    loading,
    error,
    tokenExpiry,

    // Actions
    login: (credentials: { email: string; password: string }) =>
      dispatch(loginUser(credentials)),
    register: (credentials: {
      email: string;
      password: string;
      username?: string;
    }) => dispatch(registerUser(credentials)),
    logout: () => dispatch(logoutUser()),
    initialize: () => dispatch(initializeAuth()),
    refreshToken: () => dispatch(refreshUserToken()),
    validateToken: () => dispatch(validateUserToken()),
    clearError: () => dispatch(clearUserError()),
    setUser: (user: any) => dispatch(setUser(user)),
    clearUser: () => dispatch(clearUser()),
    setTokenExpiry: (expiry: number) => dispatch(setTokenExpiry(expiry)),
  };
};

// App-level hooks (for backward compatibility)
export const useApp = () => {
  const dispatch = useAppDispatch();
  const { loading: userLoading, error: userError } = useAppSelector(
    state => state.user
  );
  const { loading: categoriesLoading, error: categoriesError } = useAppSelector(
    state => state.categories
  );

  return {
    // Global app state
    isLoading: userLoading || categoriesLoading,
    error: userError || categoriesError,
    clearError: () => {
      dispatch(clearUserError());
      dispatch(clearCategoriesError());
    },
  };
};

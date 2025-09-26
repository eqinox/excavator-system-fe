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
import { fetchEquipmentById } from './equipmentSlice';
import { useAppDispatch, useAppSelector } from './hooks';
import {
  clearUser,
  clearUserError,
  initializeAuth,
  loginUser,
  logoutUser,
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

// Equipment hooks
export const useEquipment = () => {
  const dispatch = useAppDispatch();
  const { equipments, loading, error, selectedEquipment } = useAppSelector(
    state => state.equipment
  );

  return {
    // State
    equipments,
    equipmentLoading: loading,
    equipmentError: error,
    selectedEquipment,

    // Actions
    getEquipmentById: (id: string) => dispatch(fetchEquipmentById(id)),
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
  const { loading: equipmentLoading, error: equipmentError } = useAppSelector(
    state => state.equipment
  );

  return {
    // Global app state
    isLoading: userLoading || categoriesLoading || equipmentLoading,
    error: userError || categoriesError || equipmentError,
    clearError: () => {
      dispatch(clearUserError());
      dispatch(clearCategoriesError());
      // Note: Add equipment error clearing when implemented
    },
  };
};

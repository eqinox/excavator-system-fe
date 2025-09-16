import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from './categoriesSlice';
import equipmentReducer from './equipmentSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    user: userReducer,
    equipment: equipmentReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import { AuthState, authReducer } from './slices/authSlice';

export interface AppState {
  auth: AuthState;
  [apiSlice.reducerPath]: ReturnType<typeof apiSlice.reducer>;
}

export type RootState = AppState;

const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export * from './slices/authSlice';
export * from './thunks/fetchAuthentication';
export { store };
export type AppDispatch = typeof store.dispatch;

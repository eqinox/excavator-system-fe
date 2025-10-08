import { createSlice } from '@reduxjs/toolkit';
import { initializeAuth, login, logout } from '../thunks/fetchAuthentication';

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
  },
  extraReducers: builder => {
    // Initialize auth cases
    builder.addCase(initializeAuth.pending, state => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(initializeAuth.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.token = action.payload;
    });
    builder.addCase(initializeAuth.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.token = null;
      // state.error =
      //   action.error.message || 'Failed to initialize authentication';
    });

    // Login cases
    builder.addCase(login.pending, state => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.error = null;
      state.token = action.payload;
    });
    builder.addCase(login.rejected, (state, action) => {
      console.log('login rejected', action);
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.error.message || 'Login failed';
    });

    // Logout cases
    builder.addCase(logout.pending, state => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(logout.fulfilled, state => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.token = null;
      state.error = null;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.error.message || 'Logout failed';
    });
  },
});

export const authReducer = authSlice.reducer;
export const { setCredentials } = authSlice.actions;

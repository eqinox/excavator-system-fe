import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authService } from '../lib/auth';
import { LoginDto, RegisterDto, UserDto } from '../lib/dto/client/auth.dto';

// Action type constants
const LOGIN_USER = 'LOGIN_USER';
const REGISTER_USER = 'REGISTER_USER';
const LOGOUT_USER = 'LOGOUT';
const INITIALIZE_AUTH = 'INITIALIZE_AUTH';
const REFRESH_USER_TOKEN = 'REFRESH_TOKEN';
const VALIDATE_USER_TOKEN = 'VALIDATE_TOKEN';

// Async thunks for authentication
export const loginUser = createAsyncThunk(
  LOGIN_USER,
  async (credentials: LoginDto) => {
    const response = await authService.login(credentials);
    return response.data;
  }
);

export const registerUser = createAsyncThunk(
  REGISTER_USER,
  async (credentials: RegisterDto) => {
    const response = await authService.register(credentials);
    return response.data;
  }
);

export const logoutUser = createAsyncThunk(LOGOUT_USER, async () => {
  await authService.logout();
});

export const initializeAuth = createAsyncThunk(INITIALIZE_AUTH, async () => {
  await authService.initialize();
  return {
    user: authService.getUser(),
    isAuthenticated: authService.isAuthenticated(),
  };
});

export const refreshUserToken = createAsyncThunk(
  REFRESH_USER_TOKEN,
  async () => {
    const newToken = await authService.refreshToken();
    return newToken;
  }
);

export const validateUserToken = createAsyncThunk(
  VALIDATE_USER_TOKEN,
  async () => {
    const isValid = await authService.validateToken();
    return isValid;
  }
);

interface UserState {
  user: UserDto | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  tokenExpiry: number | null;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  tokenExpiry: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: state => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<UserDto>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: state => {
      state.user = null;
      state.isAuthenticated = false;
      state.tokenExpiry = null;
    },
    setTokenExpiry: (state, action: PayloadAction<number>) => {
      state.tokenExpiry = action.payload;
    },
  },
  extraReducers: builder => {
    // Initialize auth
    builder
      .addCase(initializeAuth.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = action.payload.isAuthenticated;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to initialize auth';
      });

    // Login user
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      });

    // Register user
    builder
      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, state => {
        state.loading = false;
        // Registration successful, but user might need to login
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      });

    // Logout user
    builder
      .addCase(logoutUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, state => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.tokenExpiry = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Logout failed';
        // Still clear user data even if logout API fails
        state.user = null;
        state.isAuthenticated = false;
        state.tokenExpiry = null;
      });

    // Refresh token
    builder
      .addCase(refreshUserToken.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshUserToken.fulfilled, (state, action) => {
        state.loading = false;
        // Token refreshed successfully
      })
      .addCase(refreshUserToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Token refresh failed';
        // Clear user data if token refresh fails
        state.user = null;
        state.isAuthenticated = false;
        state.tokenExpiry = null;
      });

    // Validate token
    builder
      .addCase(validateUserToken.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateUserToken.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload) {
          // Token is invalid, clear user data
          state.user = null;
          state.isAuthenticated = false;
          state.tokenExpiry = null;
        }
      })
      .addCase(validateUserToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Token validation failed';
        // Clear user data if validation fails
        state.user = null;
        state.isAuthenticated = false;
        state.tokenExpiry = null;
      });
  },
});

export const { clearUserError, setUser, clearUser, setTokenExpiry } =
  userSlice.actions;
export default userSlice.reducer;

import {
  LoginResponseDto,
  RefreshTokenResponseDto,
} from '@/dto/server/auth.dto';
import { assertNoError } from '@/lib/helpers';
import { LoginFormData } from '@/validation/authentication';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { apiSlice } from '../slices/apiSlice';

const login = createAsyncThunk(
  'auth/login',
  async (loginData: LoginFormData, { dispatch }) => {
    const result = (await dispatch(
      apiSlice.endpoints.post.initiate({
        url: '/auth/signin',
        data: loginData,
      })
    )) as { data: LoginResponseDto } | { error: FetchBaseQueryError };

    console.log('singin result', result);

    // This assertion function will throw if there's an error, otherwise TypeScript knows result is { data: LoginResponseDto }
    assertNoError(result, 'An error occurred during login');

    return result.data.data;
  }
);

const logout = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  const result = (await dispatch(
    apiSlice.endpoints.authenticatedGet.initiate('/auth/logout')
  )) as { data: LoginResponseDto } | { error: FetchBaseQueryError };

  // This assertion function will throw if there's an error, otherwise TypeScript knows result is { data: any }
  assertNoError(result, 'An error occurred during logout');

  return result.data.data.access_token;
});

export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { dispatch }) => {
    try {
      // Use the apiSlice's refresh endpoint to get a new token
      // This will use the HTTP-only cookie to refresh the token
      const result = (await dispatch(
        apiSlice.endpoints.get.initiate('/auth/refresh')
      )) as { data: RefreshTokenResponseDto } | { error: FetchBaseQueryError };

      assertNoError(result, 'An error occurred during initialize auth');

      if (result.data.statusCode >= 200 || result.data.statusCode < 300) {
        return result.data.data;
      } else {
        throw new Error(result.data.message);
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      throw error;
    }
  }
);

export { login, logout };

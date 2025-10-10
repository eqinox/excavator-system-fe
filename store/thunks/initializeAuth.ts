import { RefreshTokenResponseDto } from '@/dto/server/auth.dto';
import { assertNoError } from '@/lib/helpers';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { apiSlice } from '../slices/apiSlice';

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
      console.log('initializeAuth result', result);
      return result.data.data.access_token;
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      throw error;
    }
  }
);

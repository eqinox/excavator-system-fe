import { BASE_URL } from '@/constants';
import { CommonResponse } from '@/dto/common.dto';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { RootState, logout, setCredentials } from '../index';
// Custom base query that gets token from Redux store
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include', // Include cookies for refresh token
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    headers.set('content-type', 'application/json');
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error?.status === 403) {
    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh',
        method: 'GET',
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      api.dispatch(setCredentials(refreshResult.data));
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Category', 'Equipment', 'User'],
  endpoints: builder => ({
    // Generic GET request
    get: builder.query<CommonResponse<any>, string>({
      query: url => url,
    }),

    // Generic POST request
    post: builder.mutation<CommonResponse<any>, { url: string; data: any }>({
      query: ({ url, data }) => ({
        url,
        method: 'POST',
        body: data,
      }),
    }),

    // Generic PUT request
    put: builder.mutation<any, { url: string; data: any }>({
      query: ({ url, data }) => ({
        url,
        method: 'PUT',
        body: data,
      }),
    }),

    // Generic DELETE request
    delete: builder.mutation<any, string>({
      query: url => ({
        url,
        method: 'DELETE',
      }),
    }),

    // Authenticated GET request
    authenticatedGet: builder.query<any, string>({
      query: url => url,
      providesTags: (result, error, url) => {
        if (url.includes('/categories'))
          return [{ type: 'Category', id: 'LIST' }];
        if (url.includes('/equipment'))
          return [{ type: 'Equipment', id: 'LIST' }];
        return [];
      },
    }),

    // Authenticated POST request
    authenticatedPost: builder.mutation<any, { url: string; data: any }>({
      query: ({ url, data }) => ({
        url,
        method: 'POST',
        body: JSON.stringify(data),
      }),
      invalidatesTags: (result, error, { url }) => {
        if (url.includes('/categories'))
          return [{ type: 'Category', id: 'LIST' }];
        if (url.includes('/equipment'))
          return [{ type: 'Equipment', id: 'LIST' }];
        return [];
      },
    }),

    // Authenticated PUT request
    authenticatedPut: builder.mutation<any, { url: string; data: any }>({
      query: ({ url, data }) => ({
        url,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { url }) => {
        if (url.includes('/categories'))
          return [{ type: 'Category', id: 'LIST' }];
        if (url.includes('/equipment'))
          return [{ type: 'Equipment', id: 'LIST' }];
        return [];
      },
    }),

    // Authenticated DELETE request
    authenticatedDelete: builder.mutation<any, string>({
      query: url => ({
        url,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, url) => {
        if (url.includes('/categories'))
          return [{ type: 'Category', id: 'LIST' }];
        if (url.includes('/equipment'))
          return [{ type: 'Equipment', id: 'LIST' }];
        return [];
      },
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetQuery,
  usePostMutation,
  usePutMutation,
  useDeleteMutation,
  useAuthenticatedGetQuery,
  useAuthenticatedPostMutation,
  useAuthenticatedPutMutation,
  useAuthenticatedDeleteMutation,
} = apiSlice;

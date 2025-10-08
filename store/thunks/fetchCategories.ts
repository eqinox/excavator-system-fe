import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiSlice } from '../slices/apiSlice';

const fetchCategories = createAsyncThunk(
  'categories/fetch',
  async (_, { dispatch }) => {
    const result = await dispatch(
      apiSlice.endpoints.authenticatedGet.initiate('/categories')
    );
    console.log(result);
    if ('error' in result) {
      throw new Error('test err');
    }

    return (result as any).data.data;
  }
);

export { fetchCategories };

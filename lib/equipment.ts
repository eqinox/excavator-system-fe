import { apiClient } from './api';

export const deleteCategory = async (id: string) => {
  const response = await apiClient.authenticatedRequest<{ message: string }>(
    `/equipment/${id}`,
    {
      method: 'GET',
    }
  );
  return response;
};

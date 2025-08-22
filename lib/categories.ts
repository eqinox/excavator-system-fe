import { apiClient } from './api';
import { CategoriesResponseDto } from './dto/server/category.dto';

export const loadAllCategories = async () => {
  const categories =
    await apiClient.authenticatedRequest<CategoriesResponseDto>('/categories', {
      method: 'GET',
    });
  return categories;
};

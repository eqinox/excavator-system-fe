import { CommonResponse } from '../common.dto';

export interface CategoryResponseDataDto {
  id: string;
  name: string;
  equipment: string[];
  created_by: string;
  image: {
    small: string;
    original: string;
  };
}

interface CategoryDeleteResponseDataDto {
  message: string;
}

export interface CategoryDeleteResponseDto
  extends CommonResponse<CategoryDeleteResponseDataDto> {}

export interface CategoryResponseDto
  extends CommonResponse<CategoryResponseDataDto> {}

export interface CategoriesResponseDto
  extends CommonResponse<CategoryResponseDataDto[]> {}

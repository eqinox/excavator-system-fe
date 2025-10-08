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

export interface CategoryResponseDto
  extends CommonResponse<CategoryResponseDataDto> {}

export interface CategoriesResponseDto
  extends CommonResponse<CategoryResponseDataDto[]> {}

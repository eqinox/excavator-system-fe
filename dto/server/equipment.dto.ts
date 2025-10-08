import { CommonResponse } from '../common.dto';

export interface EquipmentReponseDataDto {
  name: string;
  description: string;
  category_id: string;
  price_per_day: number;
  available?: boolean;
  location_id: string;
  owner: string;
  images: string[];
}

export interface EquipmentReponseDto
  extends CommonResponse<EquipmentReponseDataDto> {}

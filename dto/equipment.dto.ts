import { ImageDto } from "./common.dto";

export interface EquipmentResponseDto {
  id: string;
  name: string;
  description: string;
  category_id: string;
  price_per_day: number;
  available?: boolean;
  location_id: string;
  owner: string;
  images: ImageDto[];
}

export interface EquipmentDeleteResponseDto {
  message: string;
}

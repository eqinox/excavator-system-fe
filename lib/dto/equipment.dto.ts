export interface EquipmentResponse {
  id: string;
  name: string;
  description: string;
  category_id: string;
  images: Array<{ original: string; small: string }>;
  price_per_day: number;
  available: boolean;
  location_id: string;
  owner: string;
  created_at: string; // ISO string
  updated_at: string; // ISO string
}

import { z } from 'zod';

// Equipment form validation schema
export const equipmentSchema = z.object({
  name: z.string().min(1, 'Името на оборудването е задължително'),
  description: z.string().min(1, 'Описанието е задължително'),
  price_per_day: z
    .string()
    .min(1, 'Цената на ден е задължителна')
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Въведете валидна цена на ден',
    }),
  location_id: z.string().min(1, 'Локацията е задължителна'),
  available: z.boolean(),
  images: z.array(z.any()).min(1, 'Поне едно изображение е задължително'),
});

// Type definition
export type EquipmentFormData = z.infer<typeof equipmentSchema>;

// Validation functions
export const validateEquipmentName = (name: string): string | null => {
  const result = equipmentSchema.shape.name.safeParse(name);
  return result.success ? null : result.error.issues[0].message;
};

export const validateEquipmentDescription = (
  description: string
): string | null => {
  const result = equipmentSchema.shape.description.safeParse(description);
  return result.success ? null : result.error.issues[0].message;
};

export const validateEquipmentPrice = (price: string): string | null => {
  const result = equipmentSchema.shape.price_per_day.safeParse(price);
  return result.success ? null : result.error.issues[0].message;
};

export const validateEquipmentLocation = (location: string): string | null => {
  const result = equipmentSchema.shape.location_id.safeParse(location);
  return result.success ? null : result.error.issues[0].message;
};

// Full form validation function
export const validateEquipmentForm = (data: EquipmentFormData) => {
  return equipmentSchema.safeParse(data);
};

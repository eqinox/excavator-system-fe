import { z } from 'zod';

// Category validation schema for form (includes image for frontend validation)
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Името на категорията е задължително')
    .min(2, 'Името трябва да бъде поне 2 символа')
    .max(100, 'Името не може да бъде по-дълго от 100 символа'),
  image: z.any().refine(file => file !== null, {
    message: 'Снимката е задължителна',
  }),
});

// API request schema (only name field, image is handled separately)
export const categoryApiSchema = z.object({
  name: z
    .string()
    .min(1, 'Името на категорията е задължително')
    .min(2, 'Името трябва да бъде поне 2 символа')
    .max(100, 'Името не може да бъде по-дълго от 100 символа'),
});

// Type definitions
export type CategoryFormData = z.infer<typeof categorySchema>;
export type CategoryApiData = z.infer<typeof categoryApiSchema>;

// Validation functions
export const validateCategoryName = (name: string): string | null => {
  const result = categorySchema.shape.name.safeParse(name);
  return result.success ? null : result.error.issues[0].message;
};

// Full form validation functions
export const validateCategoryForm = (data: CategoryFormData) => {
  return categorySchema.safeParse(data);
};

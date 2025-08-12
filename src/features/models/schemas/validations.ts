import { z } from 'zod';

export const modelSchema = z.object({
  code: z
    .string()
    .min(1, 'El código es requerido')
    .min(3, 'El código debe tener al menos 3 caracteres')
    .max(20, 'El código no puede tener más de 20 caracteres')
    .regex(/^[a-zA-Z0-9]+$/, 'El código solo puede contener letras y números'),
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres')
    .trim(),
});

export const updateModelSchema = modelSchema.extend({
  id: z.number().positive('El ID debe ser un número positivo'),
});

export type ModelFormData = z.infer<typeof modelSchema>;
export type UpdateModelData = z.infer<typeof updateModelSchema>;

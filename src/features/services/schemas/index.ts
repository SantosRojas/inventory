import { z } from 'zod';

// Schema base para servicios
export const serviceSchema = z.object({
    name: z.string()
        .min(1, "El nombre es requerido")
        .max(100, "El nombre no puede exceder 100 caracteres")
        .trim()
});

// Schema para crear servicios
export const createServiceSchema = serviceSchema;

// Schema para actualizar servicios (campos opcionales)
export const updateServiceSchema = serviceSchema.partial();

// Tipos inferidos de los schemas
export type ServiceFormData = z.infer<typeof serviceSchema>;
export type CreateServiceFormData = z.infer<typeof createServiceSchema>;
export type UpdateServiceFormData = z.infer<typeof updateServiceSchema>;

// Validación manual para casos específicos
export const validateServiceData = (data: Partial<ServiceFormData>) => {
    const errors: Record<string, string> = {};
    
    if (data.name !== undefined) {
        if (!data.name?.trim()) {
            errors.name = "El nombre es requerido";
        } else if (data.name.length > 100) {
            errors.name = "El nombre no puede exceder 100 caracteres";
        }
    }
    
    return errors;
};

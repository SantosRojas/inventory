import { z } from 'zod';

// Schema base para instituciones
export const institutionSchema = z.object({
    name: z.string()
        .min(1, "El nombre es requerido")
        .max(100, "El nombre no puede exceder 100 caracteres")
        .trim(),
    code: z.string()
        .min(1, "El código es requerido")
        .max(10, "El código no puede exceder 10 caracteres")
        .trim()
        .toUpperCase()
});

// Schema para crear instituciones
export const createInstitutionSchema = institutionSchema;

// Schema para actualizar instituciones (campos opcionales)
export const updateInstitutionSchema = institutionSchema.partial();

// Tipos inferidos de los schemas
export type InstitutionFormData = z.infer<typeof institutionSchema>;
export type CreateInstitutionFormData = z.infer<typeof createInstitutionSchema>;
export type UpdateInstitutionFormData = z.infer<typeof updateInstitutionSchema>;

// Validación manual para casos específicos
export const validateInstitutionData = (data: Partial<InstitutionFormData>) => {
    const errors: Record<string, string> = {};
    
    if (data.name !== undefined) {
        if (!data.name?.trim()) {
            errors.name = "El nombre es requerido";
        } else if (data.name.length > 100) {
            errors.name = "El nombre no puede exceder 100 caracteres";
        }
    }
    
    if (data.code !== undefined) {
        if (!data.code?.trim()) {
            errors.code = "El código es requerido";
        } else if (data.code.length > 10) {
            errors.code = "El código no puede exceder 10 caracteres";
        }
    }
    
    return errors;
};

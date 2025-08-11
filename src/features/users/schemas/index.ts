import { z } from 'zod';

// Schema base para usuarios
export const userSchema = z.object({
    firstName: z.string()
        .min(1, "El nombre es requerido")
        .max(50, "El nombre no puede exceder 50 caracteres")
        .trim(),
    lastName: z.string()
        .min(1, "El apellido es requerido")
        .max(50, "El apellido no puede exceder 50 caracteres")
        .trim(),
    cellPhone: z.string()
        .min(1, "El teléfono es requerido")
        .regex(/^\+?[1-9]\d{1,14}$/, "Formato de teléfono inválido")
        .trim(),
    email: z.email()
        .min(1, "El email es requerido")
        .toLowerCase()
        .trim(),
    roleId: z.number()
        .min(1, "Debe seleccionar un rol válido")
        .refine(val => val, {
            message: "Rol inválido"
        })
});

// // Schema para crear usuarios (incluye password)
// export const createUserSchema = userSchema.extend({
//     password: z.string()
//         .min(8, "La contraseña debe tener al menos 8 caracteres")
//         .max(100, "La contraseña no puede exceder 100 caracteres")
//         .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
//             "La contraseña debe contener al menos una minúscula, una mayúscula y un número")
// });

// Schema para actualizar usuarios (campos opcionales, sin password)
export const updateUserSchema = userSchema.partial();

// Schema para cambiar contraseña
export const updatePasswordSchema = z.object({
    currentPassword: z.string()
        .min(1, "La contraseña actual es requerida"),
    newPassword: z.string()
        .min(8, "La nueva contraseña debe tener al menos 8 caracteres")
        .max(100, "La contraseña no puede exceder 100 caracteres")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
            "La contraseña debe contener al menos una minúscula, una mayúscula y un número"),
    confirmPassword: z.string()
        .min(1, "Confirmar contraseña es requerido")
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"]
});

// Tipos inferidos de los schemas
export type UserFormData = z.infer<typeof userSchema>;
// export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;

// Validación manual para casos específicos
export const validateUserData = (data: Partial<UserFormData>) => {
    const errors: Record<string, string> = {};
    
    if (data.firstName !== undefined && !data.firstName?.trim()) {
        errors.firstName = "El nombre es requerido";
    }
    
    if (data.lastName !== undefined && !data.lastName?.trim()) {
        errors.lastName = "El apellido es requerido";
    }
    
    if (data.cellPhone !== undefined && !data.cellPhone?.trim()) {
        errors.cellPhone = "El teléfono es requerido";
    }
    
    if (data.email !== undefined && !data.email?.trim()) {
        errors.email = "El email es requerido";
    }
    
    return errors;
};

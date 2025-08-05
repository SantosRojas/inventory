// features/auth/validations.ts
import { z } from 'zod'

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6)
})

export const registerSchema = z
    .object({
        firstName: z.string().min(2, 'El nombre es obligatorio'),
        lastName: z.string().min(2, 'El apellido es obligatorio'),
        cellPhone: z.string().min(9, 'El celular debe tener al menos 9 dígitos'),
        email: z.email('Correo inválido'),
        password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
        confirmPassword: z.string().min(6, 'Debes confirmar la contraseña'),
        acceptTerms: z.boolean().refine((val) => val === true, {
                message: 'Debe aceptar los términos y condiciones para continuar'})
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Las contraseñas no coinciden',
    })

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>

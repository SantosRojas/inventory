// Reutilizamos el tipo User del módulo auth
export type { User } from '../../auth/types/types';
import type { User } from '../../auth/types/types';

// Tipos específicos para el módulo de usuarios
export interface CreateUser {
    firstName: string;
    lastName: string;
    cellPhone: string;
    email: string;
    password: string;
    role: 'admin' | 'user' | 'superadmin';
}

export interface UpdateUser {
    firstName?: string;
    lastName?: string;
    cellPhone?: string;
    email?: string;
    role?: 'admin' | 'user' | 'superadmin';
}

export interface UpdateUserPassword {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

// Extiende el tipo base con campos adicionales si necesario
export interface UserExtended extends User {
    // Podemos añadir campos adicionales aquí si necesario
}

// Para respuestas de la API
export interface UserResponse {
    createdId: number;
}

export interface UserListResponse {
    users: UserExtended[];
}

export interface UpdatePasswordResponse {
    success: boolean;
    message: string;
}

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
    roleId: number; // Cambiado a roleId
}

export interface UpdateUser {
    firstName?: string;
    lastName?: string;
    cellPhone?: string;
    email?: string;
    roleId?: number; // Cambiado a roleId
}

export interface UpdateUserPassword {
    currentPassword?: string; // Opcional para permitir reseteo administrativo
    newPassword: string;
    confirmPassword: string;
    requestingUserId?: number; // Opcional - el service lo agregará automáticamente
    requestingUserRole?: string; // Opcional - el service lo agregará automáticamente
}

// Extiende el tipo base con campos adicionales si necesario
export interface UserExtended extends User {
    roleId?: number; // Añadido para compatibilidad con el nuevo sistema
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

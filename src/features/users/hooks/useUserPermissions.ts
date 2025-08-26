import { useMemo, useCallback } from 'react';
import { useAuthStore } from '../../auth/store/store';
import type { UserExtended } from '../types';

export const useUserPermissions = () => {
    const { user: currentUser } = useAuthStore();

    const permissions = useMemo(() => {
        if (!currentUser) {
            return {
                canViewAllUsers: false,
                canEditAllUsers: false,
                canDeleteUsers: false,
                canChangePasswords: false,
                canEditRoles: false,
                isAdmin: false,
                isRoot: false,
                currentUserId: null
            };
        }

        const isRoot = currentUser.role === 'root';
        const isAdmin = currentUser.role === 'admin' || isRoot; // Root tiene todos los permisos de admin

        return {
            canViewAllUsers: isAdmin,
            canEditAllUsers: isAdmin,
            canDeleteUsers: isAdmin,
            canChangePasswords: isAdmin,
            canEditRoles: isAdmin,
            isAdmin,
            isRoot,
            currentUserId: currentUser.id
        };
    }, [currentUser]);

    // Simplificado: El backend ya filtra los usuarios según permisos
    // Si el usuario aparece en la lista, se puede editar
    const canEditUser = (): boolean => {
        return !!currentUser; // Si hay usuario logueado, puede editar los usuarios que ve
    };

    const canDeleteUser = (targetUser: UserExtended): boolean => {
        if (!currentUser) return false;
        
        // Nadie puede eliminarse a sí mismo
        if (currentUser.id === targetUser.id) return false;
        
        // Root no puede ser eliminado por nadie
        if ((targetUser.role as string) === 'root') return false;
        
        // Para otros usuarios, si están en la lista del backend, se pueden eliminar
        return permissions.isAdmin;
    };

    const canChangeUserPassword = (): boolean => {
        return !!currentUser; // Simplificado: el backend controla los permisos
    };

    const canEditUserRole = useCallback((): boolean => {
        if (!currentUser) return false;
        // Simplificado: solo los admins pueden editar roles
        return permissions.isAdmin;
    }, [currentUser, permissions.isAdmin]);

    const canEditUserPersonalInfo = useCallback((targetUser: UserExtended): boolean => {
        if (!currentUser) return false;
        
        // Los usuarios pueden editar su propia información personal
        if (currentUser.id === targetUser.id) return true;
        
        // Los admins NO pueden editar información personal de otros usuarios
        // Solo pueden cambiar roles y resetear contraseñas
        return false;
    }, [currentUser]);

    const getFilteredUsers = (users: UserExtended[]): UserExtended[] => {
        // El backend ya filtra los usuarios según permisos, solo devolvemos la lista
        return users;
    };

    const getAvailableRoles = useCallback(() => {
        if (!permissions.isAdmin) return [];
        
        // Roles base disponibles (IDs corregidos según backend)
        const baseRoles = [
            { id: 3, name: 'sales_representative', displayName: 'Representante de Ventas' },
            { id: 4, name: 'technician', displayName: 'Técnico' },
            { id: 5, name: 'guest', displayName: 'Invitado' }
        ];
        
        // Solo root puede asignar el rol de admin
        if (permissions.isRoot) {
            baseRoles.unshift({ id: 2, name: 'admin', displayName: 'Administrador' });
        }
        
        return baseRoles;
    }, [permissions.isAdmin, permissions.isRoot]);

    return {
        ...permissions,
        currentUser,
        canEditUser,
        canDeleteUser,
        canChangeUserPassword,
        canEditUserRole,
        canEditUserPersonalInfo,
        getFilteredUsers,
        getAvailableRoles
    };
};

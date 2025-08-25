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

    const canEditUser = (targetUser: UserExtended): boolean => {
        if (!currentUser) return false;
        
        // Los usuarios pueden editar su propia información
        if (currentUser.id === targetUser.id) return true;
        
        // Solo admins y root pueden editar otros usuarios
        return permissions.isAdmin;
    };

    const canDeleteUser = (targetUser: UserExtended): boolean => {
        if (!currentUser) return false;
        
        // Nadie puede eliminarse a sí mismo
        if (currentUser.id === targetUser.id) return false;
        
        // Root no puede ser eliminado por nadie
        if ((targetUser.role as string) === 'root') return false;
        
        // Solo root puede eliminar administradores
        if ((targetUser.role as string) === 'admin' && !permissions.isRoot) return false;
        
        // Solo los admins (incluye root) pueden eliminar otros usuarios
        return permissions.isAdmin;
    };

    const canChangeUserPassword = (targetUser: UserExtended): boolean => {
        if (!currentUser) return false;
        
        // Los usuarios pueden cambiar su propia contraseña
        if (currentUser.id === targetUser.id) return true;
        
        // Root puede cambiar contraseñas de todos
        if (permissions.isRoot) return true;
        
        // Admins (no root) NO pueden cambiar contraseñas de root o otros admins
        if (permissions.isAdmin && !permissions.isRoot) {
            const userRole = targetUser.role as string;
            return userRole !== 'root' && userRole !== 'admin';
        }
        
        return false;
    };

    const canEditUserRole = useCallback((targetUser: UserExtended): boolean => {
        if (!currentUser) return false;
        
        // No se puede cambiar el rol de uno mismo
        if (currentUser.id === targetUser.id) return false;
        
        // Solo root puede cambiar roles de administradores
        if ((targetUser.role as string) === 'admin' && !permissions.isRoot) return false;
        
        // Nadie puede cambiar el rol de root
        if ((targetUser.role as string) === 'root') return false;
        
        // Root puede cambiar roles de todos (excepto root)
        if (permissions.isRoot) return true;
        
        // Admins (no root) solo pueden cambiar roles de usuarios que no son admin ni root
        if (permissions.isAdmin && !permissions.isRoot) {
            const userRole = targetUser.role as string;
            return userRole !== 'admin' && userRole !== 'root';
        }
        
        return false;
    }, [currentUser, permissions.isRoot, permissions.isAdmin]);

    const canEditUserPersonalInfo = useCallback((targetUser: UserExtended): boolean => {
        if (!currentUser) return false;
        
        // Los usuarios pueden editar su propia información personal
        if (currentUser.id === targetUser.id) return true;
        
        // Los admins NO pueden editar información personal de otros usuarios
        // Solo pueden cambiar roles y resetear contraseñas
        return false;
    }, [currentUser]);

    const getFilteredUsers = (users: UserExtended[]): UserExtended[] => {
        if (!currentUser) return [];
        
        // Los admins ven todos los usuarios
        if (permissions.isAdmin) return users;
        
        // Los usuarios regulares solo ven su propio perfil
        return users.filter(user => user.id === currentUser.id);
    };

    const getAvailableRoles = useCallback((targetUser?: UserExtended) => {
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
        
        // Si no hay usuario objetivo, devolver todos los roles disponibles
        if (!targetUser) return baseRoles;
        
        // Filtrar roles según el usuario objetivo
        if ((targetUser.role as string) === 'root') {
            // Nadie puede cambiar el rol de root
            return [];
        }
        
        if ((targetUser.role as string) === 'admin' && !permissions.isRoot) {
            // Solo root puede cambiar roles de admin
            return [];
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

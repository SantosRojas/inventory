import { useMemo } from 'react';
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
                currentUserId: null
            };
        }

        const isAdmin = currentUser.role === 'admin';

        return {
            canViewAllUsers: isAdmin,
            canEditAllUsers: isAdmin,
            canDeleteUsers: isAdmin,
            canChangePasswords: isAdmin,
            canEditRoles: isAdmin,
            isAdmin,
            currentUserId: currentUser.id
        };
    }, [currentUser]);

    const canEditUser = (targetUser: UserExtended): boolean => {
        if (!currentUser) return false;
        
        // Los usuarios pueden editar su propia información
        if (currentUser.id === targetUser.id) return true;
        
        // Los admins pueden editar a todos
        return permissions.isAdmin;
    };

    const canDeleteUser = (targetUser: UserExtended): boolean => {
        if (!currentUser) return false;
        
        // Nadie puede eliminarse a sí mismo
        if (currentUser.id === targetUser.id) return false;
        
        // Solo los admins pueden eliminar otros usuarios
        return permissions.isAdmin;
    };

    const canChangeUserPassword = (targetUser: UserExtended): boolean => {
        if (!currentUser) return false;
        
        // Los usuarios pueden cambiar su propia contraseña
        if (currentUser.id === targetUser.id) return true;
        
        // Los admins pueden cambiar contraseñas de otros
        return permissions.isAdmin;
    };

    const canEditUserRole = (targetUser: UserExtended): boolean => {
        if (!currentUser) return false;
        
        // Solo los admins pueden cambiar roles y solo de otros usuarios
        return permissions.isAdmin && currentUser.id !== targetUser.id;
    };

    const canEditUserPersonalInfo = (targetUser: UserExtended): boolean => {
        if (!currentUser) return false;
        
        // Los usuarios pueden editar su propia información personal
        if (currentUser.id === targetUser.id) return true;
        
        // Los admins NO pueden editar información personal de otros usuarios
        // Solo pueden cambiar roles y resetear contraseñas
        return false;
    };

    const getFilteredUsers = (users: UserExtended[]): UserExtended[] => {
        if (!currentUser) return [];
        
        // Los admins ven todos los usuarios
        if (permissions.isAdmin) return users;
        
        // Los usuarios regulares solo ven su propio perfil
        return users.filter(user => user.id === currentUser.id);
    };

    return {
        ...permissions,
        currentUser, // Agregamos currentUser al retorno
        canEditUser,
        canDeleteUser,
        canChangeUserPassword,
        canEditUserRole,
        canEditUserPersonalInfo,
        getFilteredUsers
    };
};

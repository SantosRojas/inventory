import { useState, useEffect, useCallback } from 'react';
import { getAllRoles, formatRolesForSelect, findRoleByName, findRoleById } from '../../../services/rolesService';
import type { Role } from '../../../services/rolesService';

export const useRoles = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRoles = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const rolesData = await getAllRoles();
            setRoles(rolesData);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar roles';
            setError(errorMessage);
            console.error('Error fetching roles:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    // Formato para el componente Select
    const roleOptions = formatRolesForSelect(roles);

    // Funciones helper
    const getRoleIdByName = (roleName: string): number | undefined => {
        const role = findRoleByName(roleName, roles);
        return role?.id;
    };

    const getRoleNameById = (roleId: number): string | undefined => {
        const role = findRoleById(roleId, roles);
        return role?.name;
    };

    const getRoleById = (roleId: number): Role | undefined => {
        return findRoleById(roleId, roles);
    };

    const getRoleByName = (roleName: string): Role | undefined => {
        return findRoleByName(roleName, roles);
    };

    return {
        roles,
        roleOptions,
        isLoading,
        error,
        refetch: fetchRoles,
        getRoleIdByName,
        getRoleNameById,
        getRoleById,
        getRoleByName
    };
};

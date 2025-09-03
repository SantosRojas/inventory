import { fetchWithAuth } from './fetchWithAuth';
import { API_ENDPOINTS } from '../config/api';

export interface Role {
    id: number;
    name: string;
    description: string;
}

export interface RolesResponse {
    success: boolean;
    data: Role[];
}

/**
 * Obtiene todos los roles disponibles desde el endpoint /roles
 */
export const getAllRoles = async (): Promise<Role[]> => {
    try {
        const response = await fetchWithAuth(API_ENDPOINTS.roles.getAll);
        
        if (!response.ok) {
            // Si el endpoint no existe (404), usar roles por defecto
            if (response.status === 404) {
                return getDefaultRoles();
            }
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            
            return getDefaultRoles();
        }
        
        const data: RolesResponse = await response.json();
        
        if (!data.success) {
            throw new Error('Error al obtener los roles del servidor');
        }
        
        return data.data;
    } catch (error) {
        
        // Si es un error de red o parsing, usar roles por defecto
        if (error instanceof SyntaxError || (error as any).name === 'TypeError') {
            
            return getDefaultRoles();
        }
        
        throw error instanceof Error ? error : new Error('Error desconocido al obtener roles');
    }
};

/**
 * Roles por defecto en caso de que el endpoint no esté disponible
 */
export const getDefaultRoles = (): Role[] => {
    return [
        { id: 1, name: 'root', description: 'Administrador del sistema con todos los permisos sobre los administradores' },
        { id: 2, name: 'admin', description: 'Administrador del sistema con todos los permisos' },
        { id: 3, name: 'sales_representative', description: 'Puede gestionar inventarios y reportar incidentes' },
        { id: 4, name: 'technician', description: 'Puede gestionar inventarios y realizar mantenimientos' },
        { id: 5, name: 'guest', description: 'Puede reportar incidentes pero no tiene acceso a la gestión de inventarios' },
        { id: 6, name: 'supervisor', description: 'Puede ver dashboard y reportes, e inventariar' }
    ];
};

/**
 * Convierte los roles del API al formato esperado por el componente Select
 */
export const formatRolesForSelect = (roles: Role[]) => {
    return roles.map(role => ({
        id: role.id, // Mantener como número para consistencia
        name: getRoleDisplayName(role.name)
    }));
};

/**
 * Obtiene el nombre de visualización para un rol
 */
export const getRoleDisplayName = (roleName: string): string => {
    const roleNames: Record<string, string> = {
        'root': 'Root',
        'admin': 'Administrador',
        'supervisor':'Supervisor',
        'sales_representative': 'Representante de Ventas',
        'technician': 'Técnico',
        'guest': 'Invitado'
    };
    
    return roleNames[roleName] || roleName;
};

/**
 * Encuentra un rol por su nombre
 */
export const findRoleByName = (roleName: string, roles: Role[]): Role | undefined => {
    return roles.find(role => role.name === roleName);
};

/**
 * Encuentra un rol por su ID
 */
export const findRoleById = (roleId: number, roles: Role[]): Role | undefined => {
    return roles.find(role => role.id === roleId);
};

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
        console.log('🔄 Intentando obtener roles desde:', API_ENDPOINTS.roles.getAll);
        const response = await fetchWithAuth(API_ENDPOINTS.roles.getAll);
        
        console.log('📡 Respuesta del servidor:', {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
            headers: Object.fromEntries(response.headers.entries())
        });
        
        if (!response.ok) {
            // Si el endpoint no existe (404), usar roles por defecto
            if (response.status === 404) {
                console.warn('⚠️ Endpoint /roles no encontrado, usando roles por defecto');
                return getDefaultRoles();
            }
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            console.warn('⚠️ Respuesta no es JSON, usando roles por defecto. Content-Type:', contentType);
            return getDefaultRoles();
        }
        
        const data: RolesResponse = await response.json();
        console.log('✅ Datos de roles recibidos:', data);
        
        if (!data.success) {
            throw new Error('Error al obtener los roles del servidor');
        }
        
        return data.data;
    } catch (error) {
        console.error('❌ Error fetching roles:', error);
        
        // Si es un error de red o parsing, usar roles por defecto
        if (error instanceof SyntaxError || (error as any).name === 'TypeError') {
            console.warn('⚠️ Error de red o parsing, usando roles por defecto');
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
        { id: 1, name: 'admin', description: 'Administrador del sistema con todos los permisos' },
        { id: 2, name: 'sales_representative', description: 'Puede gestionar inventarios y reportar incidentes' },
        { id: 3, name: 'technician', description: 'Puede gestionar inventarios y realizar mantenimientos' },
        { id: 4, name: 'guest', description: 'Puede reportar incidentes pero no tiene acceso a la gestión de inventarios' }
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
        'admin': 'Administrador',
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

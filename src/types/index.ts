
// Tipos globales para el sistema de inventario de bombas de infusión B.Braun
// ✅ Tipos de estado actualizados (consistentes con la API)
export type PumpStatus = 'Operativo' | 'Inoperativo';
export type UserRole = 'admin' | 'inventory_taker' | 'user';

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    cellphone: string;
    email: string;
    password?: string; // Solo para creación/edición
    role: string; // Será 'admin', 'sales_representative', 'technician', 'guest'
    createdAt: string; // La API retorna strings ISO, no Date objects
    updatedAt: string; // La API retorna strings ISO, no Date objects
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}


export interface Institution {
    id: number;
    name: string;
}

export interface Service {
    id: number;
    name: string;
}

export interface PumpModel {
    id: number;
    code: string;
    name: string;
}

export interface Pump {
    id: number;
    serialNumber: string;
    qrCode: string;
    inventoryDate: string; // La API retorna strings ISO
    status: PumpStatus;
    lastMaintenanceDate?: string | null; // La API retorna strings ISO o null
    createdAt: string; // La API retorna strings ISO
    model: string;
    institution: string;
    service: string;
    inventoryManager: string;
}




// Tipo para la creación de bombas (formato que acepta la API)
export interface CreatePump {
    serialNumber: string;
    qrCode: string;
    modelId: number; // Cambiar de vuelta a number para coincidir con ModeloBomba.id
    institutionId: number;
    serviceId: number;
    status: 'Operativo' | 'Inoperativo';
    lastMaintenanceDate?: string; // Solo string, sin null - es opcional
    inventoryTakerId: number;
    inventoryDate: string;
    createdAt: string; // Fecha de creación obligatoria en camelCase
}

// Tipo para la actualización de bombas
export interface UpdatePump {
    serialNumber?: string;
    qrCode?: string;
    modelId?: number;
    institutionId?: number;
    serviceId?: number;
    status?: 'Operativo' | 'Inoperativo';
    lastMaintenanceDate?: string; // Solo string, sin null
    inventoryTakerId?: number;
    inventoryDate?: string;
}

// Interfaces para Dashboard y estadísticas (globales)
export interface InstitutionStats {
    name: string;
    totalBombas: number;
    operativas: number;
    inoperativas: number;
    bombasByModel: { [model: string]: number }; // Referencia simple
    services: { [service: string]: {
            name: string;
            totalBombas: number;
            bombasByModel: { [model: string]: number };
            operativas: number;
            inoperativas: number;
        } };
}

export interface ResponsableStats {
    name: string;
    totalBombas: number;
    operativas: number;
    inoperativas: number;
    bombasByModel: { [model: string]: number }; // Referencia simple
    totalInventoried: number;
    inventoriedThisYear: number;
    registeredThisYear: number;
    institutionsCovered: number;
    servicesCovered: number;
    institutions: { [institution: string]: {
            name: string;
            totalBombas: number;
            operativas: number;
            inoperativas: number;
            bombasByModel: { [model: string]: number };
            services: { [service: string]: {
                    name: string;
                    totalBombas: number;
                    bombasByModel: { [model: string]: number };
                    operativas: number;
                    inoperativas: number;
                } };
        }};
}

export interface GeneralStats {
    totalBombas: number;
    totalInstitutions: number;
    totalResponsables: number;
    operativas: number;
    inoperativas: number;
    userStats?: {
        total_inventoried: number;
        inventoried_this_year: number;
        registered_this_year: number;
        institutions_covered: number;
        services_covered: number;
        models_handled: number;
    };
}

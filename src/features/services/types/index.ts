// Tipos específicos para el módulo de servicios
export interface CreateService {
    name: string;
}

export interface UpdateService {
    name?: string;
}

// Extiende el tipo base con campos adicionales
export interface ServiceExtended {
    id: number;
    name: string;
    createdAt?: string;
}

// Para respuestas de la API
export interface ServiceResponse {
    createdId: number;
}

export interface ServiceListResponse {
    services: ServiceExtended[];
}

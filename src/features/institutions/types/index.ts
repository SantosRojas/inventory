// Tipos específicos para el módulo de instituciones
export interface CreateInstitution {
    name: string;
    code: string; // Nuevo campo para el código de la institución
}

export interface UpdateInstitution {
    name?: string;
    code?: string;
}

// Extiende el tipo base con campos adicionales
export interface InstitutionExtended {
    id: number;
    name: string;
    code: string;
    createdAt?: string;
}

// Para respuestas de la API
export interface InstitutionResponse {
    id: number;
}

export interface InstitutionListResponse {
    institutions: InstitutionExtended[];
}

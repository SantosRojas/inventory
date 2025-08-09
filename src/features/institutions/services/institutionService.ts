import type { 
    CreateInstitution, 
    UpdateInstitution, 
    InstitutionExtended,
    InstitutionResponse
} from "../types";
import { API_ENDPOINTS } from "../../../config";

/**
 * Maneja errores del servidor devolviendo un mensaje legible.
 */
async function handleErrorResponse(res: Response) {
    let errorMessage = 'Error desconocido';
    try {
        const errorBody = await res.json();
        // Evitar duplicación de mensajes
        if (errorBody?.message && errorBody?.error) {
            // Si ambos existen, verificar si son iguales
            if (errorBody.message === errorBody.error) {
                errorMessage = errorBody.message;
            } else {
                errorMessage = `${errorBody.message}: ${errorBody.error}`;
            }
        } else if (errorBody?.message) {
            errorMessage = errorBody.message;
        } else if (errorBody?.error) {
            errorMessage = errorBody.error;
        }
    } catch {
        // Si no se puede parsear el JSON, usar mensaje basado en status
        errorMessage = `Error ${res.status}: ${res.statusText}`;
    }
    throw new Error(errorMessage);
}

/**
 * Maneja respuestas exitosas, extrayendo el `data` si `success` es true.
 */
async function handleSuccessResponse<T>(res: Response): Promise<T> {
    const body = await res.json();
    if (body?.success) {
        return body.data as T;
    } else {
        const message = body?.message || 'Respuesta inválida del servidor';
        throw new Error(message);
    }
}

/**
 * Obtiene todas las instituciones
 */
export async function getAllInstitutions(): Promise<InstitutionExtended[]> {
    const endPoint = API_ENDPOINTS.institutions.getAll;
    const res = await fetch(endPoint);

    if (!res.ok) {
        await handleErrorResponse(res);
    }

    return await handleSuccessResponse<InstitutionExtended[]>(res);
}

/**
 * Obtiene una institución por ID
 */
export async function getInstitutionById(id: number): Promise<InstitutionExtended> {
    const endPoint = API_ENDPOINTS.institutions.getById(id);
    const res = await fetch(endPoint);

    if (!res.ok) {
        await handleErrorResponse(res);
    }

    return await handleSuccessResponse<InstitutionExtended>(res);
}

/**
 * Crea una nueva institución
 */
export async function createInstitution(institutionData: CreateInstitution): Promise<InstitutionResponse> {
    const endPoint = API_ENDPOINTS.institutions.create;
    const res = await fetch(endPoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(institutionData),
    });

    if (!res.ok) {
        await handleErrorResponse(res);
    }

    return await handleSuccessResponse<InstitutionResponse>(res);
}

/**
 * Actualiza una institución por ID
 */
export async function updateInstitution(id: number, institutionData: UpdateInstitution): Promise<{ updated: InstitutionExtended }> {
    const endPoint = API_ENDPOINTS.institutions.update(id);
    const res = await fetch(endPoint, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(institutionData),
    });

    if (!res.ok) {
        await handleErrorResponse(res);
    }

    return await handleSuccessResponse<{ updated: InstitutionExtended }>(res);
}

/**
 * Elimina una institución por ID
 */
export async function deleteInstitution(id: number): Promise<boolean> {
    const endPoint = API_ENDPOINTS.institutions.delete(id);
    const res = await fetch(endPoint, {
        method: 'DELETE',
    });

    if (!res.ok) {
        await handleErrorResponse(res);
        return false; // Esta línea nunca se ejecutará porque handleErrorResponse lanza una excepción
    }

    // Para DELETE con respuesta HTTP exitosa, verificamos si la operación fue exitosa en el cuerpo
    const body = await res.json();
    if (body?.success) {
        return true;
    } else {
        // Construir mensaje de error combinando message y error si están disponibles
        const errorParts = [];
        if (body?.message) errorParts.push(body.message);
        if (body?.error) errorParts.push(body.error);
        
        const message = errorParts.length > 0 
            ? errorParts.join(': ') 
            : 'Error al eliminar la institución';
        
        throw new Error(message);
    }
}

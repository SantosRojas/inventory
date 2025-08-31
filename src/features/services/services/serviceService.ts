import type { 
    CreateService, 
    UpdateService, 
    ServiceExtended,
    ServiceResponse
} from "../types";
import { API_ENDPOINTS } from "../../../config";
import { fetchWithAuth } from "../../../services/fetchWithAuth";

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
 * Obtiene todos los servicios
 */
export async function getAllServices(): Promise<ServiceExtended[]> {
    const endPoint = API_ENDPOINTS.services.getAll;
    const res = await fetchWithAuth(endPoint);

    if (!res.ok) {
        await handleErrorResponse(res);
    }

    return await handleSuccessResponse<ServiceExtended[]>(res);
}

/**
 * Obtiene un servicio por ID
 */
export async function getServiceById(id: number): Promise<ServiceExtended> {
    const endPoint = API_ENDPOINTS.services.getById(id);
    const res = await fetchWithAuth(endPoint);

    if (!res.ok) {
        await handleErrorResponse(res);
    }

    return await handleSuccessResponse<ServiceExtended>(res);
}

/**
 * Crea un nuevo servicio
 */
export async function createService(serviceData: CreateService): Promise<ServiceResponse> {
    const endPoint = API_ENDPOINTS.services.create;
    const res = await fetchWithAuth(endPoint, {
        method: 'POST',
        body: JSON.stringify(serviceData),
    });

    if (!res.ok) {
        await handleErrorResponse(res);
    }

    return await handleSuccessResponse<ServiceResponse>(res);
}

/**
 * Actualiza un servicio por ID
 */
export async function updateService(id: number, serviceData: UpdateService): Promise<{ updatedService: ServiceExtended }> {
    const endPoint = API_ENDPOINTS.services.update(id);
    const res = await fetchWithAuth(endPoint, {
        method: 'PATCH',
        body: JSON.stringify(serviceData),
    });

    if (!res.ok) {
        await handleErrorResponse(res);
    }

    return await handleSuccessResponse<{ updatedService: ServiceExtended }>(res);
}

/**
 * Elimina un servicio por ID
 */
export async function deleteService(id: number): Promise<boolean> {
    const endPoint = API_ENDPOINTS.services.delete(id);
    const res = await fetchWithAuth(endPoint, {
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
            : 'Error al eliminar el servicio';
        
        throw new Error(message);
    }
}

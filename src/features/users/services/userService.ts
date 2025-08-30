import type {
    CreateUser,
    UpdateUser,
    UpdateUserPasswordProps,
    UserExtended,
    UserResponse,
    UpdatePasswordResponse
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
 * Obtiene todos los usuarios
 */
export async function getAllUsers(): Promise<UserExtended[]> {
    const endPoint = API_ENDPOINTS.users.getFilteredUsers;
    const res = await fetchWithAuth(endPoint);

    if (!res.ok) {
        await handleErrorResponse(res);
    }

    return await handleSuccessResponse<UserExtended[]>(res);
}

/**
 * Obtiene un usuario por ID
 */
export async function getUserById(id: number): Promise<UserExtended> {
    const endPoint = API_ENDPOINTS.users.getById(id);
    const res = await fetchWithAuth(endPoint);

    if (!res.ok) {
        await handleErrorResponse(res);
    }

    return await handleSuccessResponse<UserExtended>(res);
}

/**
 * Crea un nuevo usuario
 */
export async function createUser(userData: CreateUser): Promise<UserResponse> {
    const endPoint = API_ENDPOINTS.users.create;
    const res = await fetchWithAuth(endPoint, {
        method: 'POST',
        body: JSON.stringify(userData),
    });

    if (!res.ok) {
        await handleErrorResponse(res);
    }

    return await handleSuccessResponse<UserResponse>(res);
}

/**
 * Actualiza un usuario por ID
 */
export async function updateUser(id: number, userData: UpdateUser): Promise<{ updatedUser: UserExtended }> {
    const endPoint = API_ENDPOINTS.users.update(id);
    const res = await fetchWithAuth(endPoint, {
        method: 'PATCH',
        body: JSON.stringify(userData),
    });

    if (!res.ok) {
        await handleErrorResponse(res);
    }

    return await handleSuccessResponse<{ updatedUser: UserExtended }>(res);
}

/**
 * Limpia propiedades undefined del objeto
 */
function cleanPayload<T extends Record<string, any>>(obj: T): Partial<T> {
    const cleaned: Partial<T> = {};
    for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
            (cleaned as any)[key] = value;
        }
    }
    return cleaned;
}

/**
 * Actualiza la contraseña de un usuario
 */
export async function updatePassword(id: number, passwordData: UpdateUserPasswordProps): Promise<UpdatePasswordResponse> {

    // Limpiar payload de propiedades undefined
    const cleanedPayload = cleanPayload(passwordData);

    const endPoint = API_ENDPOINTS.users.updatePassword(id);

    const res = await fetchWithAuth(endPoint, {
        method: 'PATCH',
        body: JSON.stringify(cleanedPayload),
    });

    if (!res.ok) {
        const errorText = await res.text();

        // Re-crear la respuesta para handleErrorResponse
        const errorResponse = new Response(errorText, {
            status: res.status,
            statusText: res.statusText,
            headers: res.headers
        });

        await handleErrorResponse(errorResponse);
    }

    return await handleSuccessResponse<UpdatePasswordResponse>(res);
}

/**
 * Elimina un usuario por ID
 */
export async function deleteUser(id: number): Promise<boolean> {
    const endPoint = API_ENDPOINTS.users.delete(id);
    const res = await fetchWithAuth(endPoint, {
        method: 'DELETE'
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
            : 'Error al eliminar el usuario';

        throw new Error(message);
    }
}

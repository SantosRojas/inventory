import type { 
    CreateUser, 
    UpdateUser, 
    UpdateUserPassword,
    UserExtended,
    UserResponse,
    UpdatePasswordResponse
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
 * Obtiene el token de autenticación del localStorage
 */
function getAuthToken(): string | null {
    return localStorage.getItem('token');
}

/**
 * Headers con autenticación
 */
function getAuthHeaders(): HeadersInit {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
}

/**
 * Obtiene todos los usuarios
 */
export async function getAllUsers(): Promise<UserExtended[]> {
    const endPoint = API_ENDPOINTS.users.getAll;
    const res = await fetch(endPoint, {
        headers: getAuthHeaders()
    });

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
    const res = await fetch(endPoint, {
        headers: getAuthHeaders()
    });

    if (!res.ok) {
        await handleErrorResponse(res);
    }

    return await handleSuccessResponse<UserExtended>(res);
}

/**
 * Obtiene el perfil del usuario actual
 */
export async function getUserProfile(): Promise<UserExtended> {
    const endPoint = API_ENDPOINTS.users.profile;
    const res = await fetch(endPoint, {
        headers: getAuthHeaders()
    });

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
    const res = await fetch(endPoint, {
        method: 'POST',
        headers: getAuthHeaders(),
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
    const res = await fetch(endPoint, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
    });

    if (!res.ok) {
        await handleErrorResponse(res);
    }

    return await handleSuccessResponse<{ updatedUser: UserExtended }>(res);
}

/**
 * Actualiza la contraseña de un usuario
 */
export async function updateUserPassword(id: number, passwordData: UpdateUserPassword): Promise<UpdatePasswordResponse> {
    // Primero intentar endpoint específico para cambio de contraseña
    const endPoint = `${API_ENDPOINTS.users.update(id)}/password`;
    const res = await fetch(endPoint, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(passwordData),
    });

    if (!res.ok) {
        // Si el endpoint específico no existe (404), usar el endpoint general
        if (res.status === 404) {
            const generalEndPoint = API_ENDPOINTS.users.update(id);
            const generalRes = await fetch(generalEndPoint, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify(passwordData),
            });
            
            if (!generalRes.ok) {
                await handleErrorResponse(generalRes);
            }
            
            return await handleSuccessResponse<UpdatePasswordResponse>(generalRes);
        } else {
            await handleErrorResponse(res);
        }
    }

    return await handleSuccessResponse<UpdatePasswordResponse>(res);
}

/**
 * Elimina un usuario por ID
 */
export async function deleteUser(id: number): Promise<boolean> {
    const endPoint = API_ENDPOINTS.users.delete(id);
    const res = await fetch(endPoint, {
        method: 'DELETE',
        headers: getAuthHeaders()
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

// features/auth/services.ts
// features/auth/services.ts
import type { AuthResponse, User, UserToRegister } from '../types/types.ts'
import type { LoginInput } from '../schemas'
import { API_ENDPOINTS } from '../../../config/api.ts';
import { fetchWithAuth } from '../../../services/fetchWithAuth.ts';

/**
 * Maneja errores del servidor devolviendo un mensaje legible.
 */
async function handleErrorResponse(res: Response) {
    let errorMessage = 'Error desconocido';
    try {
        const errorBody = await res.json();
        if (errorBody?.message || errorBody?.error) {
            errorMessage = `${errorBody.message || ''}: ${errorBody.error || ''}`.trim();
        }
    } catch {
        // Si no se puede parsear el JSON, se mantiene el mensaje genérico
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

export const loginUser = async (data: LoginInput): Promise<AuthResponse> => {
    const res = await fetch(API_ENDPOINTS.auth.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    // const responseJSON = await res.json();

    // if (!res.ok || !responseJSON.success) {
    //     // Extrae mensaje si lo tiene, o da uno genérico
    //     const errorMessage = responseJSON?.message || 'Error al iniciar sesión';
    //     throw new Error(errorMessage);
    // }


    // ✅ Garantizamos que responseJSON.data tiene { token, user }
    // return responseJSON.data as AuthResponse;

    if (!res.ok) {
        await handleErrorResponse(res)
    }

    return await handleSuccessResponse<AuthResponse>(res)
};



export const registerUser = async (data: UserToRegister): Promise<AuthResponse> => {

    const res = await fetch(API_ENDPOINTS.auth.register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    if (!res.ok) await handleErrorResponse(res)
    return handleSuccessResponse<AuthResponse>(res)
}

export const checkTokenValidity = async (): Promise<User> => {
    const res = await fetchWithAuth(API_ENDPOINTS.auth.verify)

    if (!res.ok) handleErrorResponse(res)

    return await handleSuccessResponse<User>(res)// 👈 EXTRAES data correctamente
}

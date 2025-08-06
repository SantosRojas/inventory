import type {CreatePump, Pump, UpdatePump} from "../../../types";
import { API_ENDPOINTS } from "../../../config";

interface CreatePumpResponse {
    id: number;
}

interface UpdatePumpResponse {
    "updated":Pump
}


/**
 * Maneja errores del servidor devolviendo un mensaje legible.
 */
async function handleErrorResponse(res: Response) {
    let errorMessage = 'Error desconocido';
    try {
        const errorBody = await res.json();
        if (errorBody?.message || errorBody?.error) {
            errorMessage = `${errorBody.message || ''} ${errorBody.error || ''}`.trim();
        }
    } catch {
        // Si no se puede parsear el JSON, se mantiene el mensaje genérico
    }
    // console.log(errorMessage);
    throw new Error(errorMessage);
}

/**
 * Maneja respuestas exitosas, extrayendo el `data` si `success` es true.
 */
async function handleSuccessResponse<T>(res: Response):Promise<T> {
    const body = await res.json();
    if (body?.success) {
        return body.data as T;
    } else {
        const message = body?.message || 'Respuesta inválida del servidor';
        throw new Error(message);
    }
}

/**
 * Actualiza una bomba (pump) por ID.
 */
export async function updatePump(id: number, pumpData: UpdatePump): Promise<UpdatePumpResponse> {
    const endPoint = API_ENDPOINTS.pumps.update(id);
    const res = await fetch(endPoint, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pumpData),
    });

    if (!res.ok) {
        await handleErrorResponse(res);
    }

    return await handleSuccessResponse<UpdatePumpResponse>(res);
}

/**
 * Elimina una bomba (pump) por ID.
 */
export async function deletePump(id: number): Promise<boolean> {
    const endPoint = API_ENDPOINTS.pumps.delete(id);
    const res = await fetch(endPoint, {
        method: 'DELETE',
    });

    if (!res.ok) {
        await handleErrorResponse(res);
    }

    return true;
}

/**
 * Crea una nueva bomba (pump).
 */
export async function createPump(pumpData: CreatePump): Promise<CreatePumpResponse> {
    const endPoint = API_ENDPOINTS.pumps.create;
    const res = await fetch(endPoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pumpData),
    });

    if (!res.ok) {
        await handleErrorResponse(res);
    }

    return await handleSuccessResponse<CreatePumpResponse>(res);
}


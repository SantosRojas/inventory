import type { 
  Model, 
  CreateModelRequest, 
  UpdateModelRequest, 
  CreatedModelResponse
} from '../types/models.types';
import { API_ENDPOINTS } from '../../../config';
import { useAuthStore } from '../../auth/store/store';

/**
 * Maneja errores del servidor devolviendo un mensaje legible.
 */
async function handleErrorResponse(res: Response) {
    let errorMessage = 'Error desconocido';
    try {
        const errorBody = await res.json();
        if (errorBody?.message && errorBody?.error) {
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
 * Obtiene el token de autenticación del store
 */
function getAuthToken(): string | null {
    return useAuthStore.getState().token;
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

const MODELS_ENDPOINT = API_ENDPOINTS.models;

export const modelsService = {
  // Obtener todos los modelos
  getModels: async (): Promise<Model[]> => {
    const res = await fetch(MODELS_ENDPOINT.getAll, {
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      await handleErrorResponse(res);
    }

    return await handleSuccessResponse<Model[]>(res);
  },

  // Obtener un modelo por ID
  getModel: async (id: number): Promise<Model> => {
    const res = await fetch(MODELS_ENDPOINT.getById(id), {
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      await handleErrorResponse(res);
    }

    return await handleSuccessResponse<Model>(res);
  },

  // Crear un nuevo modelo
  createModel: async (modelData: CreateModelRequest): Promise<CreatedModelResponse> => {
    const res = await fetch(MODELS_ENDPOINT.create, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(modelData),
    });

    if (!res.ok) {
      await handleErrorResponse(res);
    }

    return await handleSuccessResponse<CreatedModelResponse>(res);
  },

  // Actualizar un modelo existente
  updateModel: async (id: number, modelData: Omit<UpdateModelRequest, 'id'>): Promise<{modelUpdated:Model}> => {
    const res = await fetch(MODELS_ENDPOINT.update(id), {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(modelData),
    });

    if (!res.ok) {
      await handleErrorResponse(res);
    }

    return await handleSuccessResponse<{modelUpdated:Model}>(res);
  },

  // Eliminar un modelo
  deleteModel: async (id: number): Promise<boolean> => {
    const res = await fetch(MODELS_ENDPOINT.delete(id), {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      await handleErrorResponse(res);
      return false;
    }

    const body = await res.json();
    if (body?.success) {
      return true;
    } else {
      const errorParts = [];
      if (body?.message) errorParts.push(body.message);
      if (body?.error) errorParts.push(body.error);
      
      const message = errorParts.length > 0 
        ? errorParts.join(': ') 
        : 'Error al eliminar el modelo';
      
      throw new Error(message);
    }
  },
};

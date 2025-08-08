import { useState, useEffect } from 'react';
import type { CreatePump, Pump, UpdatePump } from "../../../types";
import { usePumpStore } from "../store";
import { createPump, updatePump, deletePump } from "../services";

/**
 * Hook que combina las operaciones de pump con sincronización del store
 * Mantiene el manejo de estados de loading/error pero actualiza el store local
 */
export function usePumpWithStoreSync() {
    const [loadingAction, setLoadingAction] = useState(false);
    const [errorAction, setErrorAction] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Obtener funciones del store para actualizar data local
    const { updatePump: updatePumpInStore, removePump: removePumpFromStore } = usePumpStore();

    /**
     * Crea una nueva bomba y actualiza el store
     */
    const create = async (datos: CreatePump): Promise<number | null> => {
        setLoadingAction(true);
        setErrorAction(null);
        setSuccess(null);
        try {
            const data = await createPump(datos);
            setSuccess("Bomba creada correctamente.");
            
            // Solo agregamos al store si tenemos data (para búsquedas)
            // El store maneja principalmente búsquedas, no el listado completo
            return data.id;
        } catch (err) {
            if (err instanceof Error) {
                setErrorAction(err.message);
            } else {
                setErrorAction("Error desconocido");
            }
            return null;
        } finally {
            setLoadingAction(false);
        }
    };

    /**
     * Actualiza una bomba y sincroniza con el store
     */
    const update = async (id: number, datos: UpdatePump): Promise<Pump | null> => {
        setLoadingAction(true);
        setErrorAction(null);
        setSuccess(null);
        try {
            const data = await updatePump(id, datos);
            setSuccess("Bomba actualizada correctamente.");
            
            // Actualizar en el store local para reflejar cambios inmediatamente
            await updatePumpInStore(id, datos);
            
            return data.updated;
        } catch (err) {
            if (err instanceof Error) {
                setErrorAction(err.message);
            } else {
                setErrorAction("Error desconocido");
            }
            return null;
        } finally {
            setLoadingAction(false);
        }
    };

    /**
     * Elimina una bomba y actualiza el store
     */
    const remove = async (id: number): Promise<boolean> => {
        setLoadingAction(true);
        setErrorAction(null);
        setSuccess(null);
        try {
            await deletePump(id);
            setSuccess("Bomba eliminada correctamente.");
            
            // Remover del store local
            await removePumpFromStore(id);
            
            return true;
        } catch (err) {
            if (err instanceof Error) {
                setErrorAction(err.message);
            } else {
                setErrorAction("Error desconocido");
            }
            return false;
        } finally {
            setLoadingAction(false);
        }
    };

    /**
     * Limpia automáticamente mensajes de error/éxito después de 7 segundos.
     */
    useEffect(() => {
        if (errorAction || success) {
            const timer = setTimeout(() => {
                setErrorAction(null);
                setSuccess(null);
            }, 7000);
            return () => clearTimeout(timer);
        }
    }, [errorAction, success]);

    return {
        create,
        update,
        remove,
        loadingAction,
        errorAction,
        success,
    };
}

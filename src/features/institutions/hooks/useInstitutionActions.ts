import { useState, useEffect } from 'react';
import type { CreateInstitution, UpdateInstitution } from "../types";
import { useInstitutionStore } from "../store";

/**
 * Hook que combina las operaciones de institution con gestión de estados de UI
 * Mantiene el manejo de estados de loading/error y actualiza el store
 */
export function useInstitutionActions() {
    const [loadingAction, setLoadingAction] = useState(false);
    const [errorAction, setErrorAction] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Obtener funciones del store que ya manejan el servidor
    const { 
        addInstitution,
        updateInstitution: updateInstitutionInStore, 
        removeInstitution: removeInstitutionFromStore
    } = useInstitutionStore();

    /**
     * Crea una nueva institución usando solo el store
     */
    const create = async (datos: CreateInstitution): Promise<number | null> => {
        setLoadingAction(true);
        setErrorAction(null);
        setSuccess(null);
        try {
            const id = await addInstitution(datos);
            if (id) {
                setSuccess("Institución creada correctamente.");
                return id;
            }
            setErrorAction("Error al crear la institución");
            return null;
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
     * Actualiza una institución usando solo el store
     */
    const update = async (id: number, datos: UpdateInstitution): Promise<boolean> => {
        setLoadingAction(true);
        setErrorAction(null);
        setSuccess(null);
        try {
            await updateInstitutionInStore(id, datos);
            setSuccess("Institución actualizada correctamente.");
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
     * Elimina una institución usando solo el store
     */
    const remove = async (id: number): Promise<boolean> => {
        setLoadingAction(true);
        setErrorAction(null);
        setSuccess(null);
        try {
            const success = await removeInstitutionFromStore(id);
            if (success) {
                setSuccess("Institución eliminada correctamente.");
            }
            return success;
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

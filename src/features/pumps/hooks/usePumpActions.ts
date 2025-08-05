import { useState, useEffect } from 'react';
import type {CreatePump, Pump, UpdatePump} from "../../../types";
import { deletePump, updatePump } from "../services";
import {createPump} from "../services/pumpsApi.ts";

export function usePumpActions() {
    const [loadingAction, setLoadingAction] = useState(false);
    const [errorAction, setErrorAction] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    /**
     * Crea una nueva bomba y gestiona estados de carga, error y éxito.
     */
    const create = async (datos: CreatePump): Promise<number | null> => {
        setLoadingAction(true);
        setErrorAction(null);
        setSuccess(null);
        try {
            const data = await createPump(datos);
            setSuccess("Bomba creada correctamente.");
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
     * Actualiza una bomba y gestiona estados de carga, errorAction y éxito.
     */
    const update = async (id: number, datos: UpdatePump): Promise<Pump | null> => {
        setLoadingAction(true);
        setErrorAction(null);
        setSuccess(null);
        try {
            const data = await updatePump(id, datos);
            setSuccess("Bomba actualizada correctamente.");
            return data.updated;
        } catch (err) {
            if (err instanceof Error) {
                setErrorAction(err.message);
            } else {
                setErrorAction("Erro desconocido");
            }
            return null;
        } finally {
            setLoadingAction(false);
        }
    };

    /**
     * Elimina una bomba y gestiona estados de carga, errorAction y éxito.
     */
    const remove= async (id: number): Promise<boolean> => {
        setLoadingAction(true);
        setErrorAction(null);
        setSuccess(null);
        try {
            await deletePump(id);
            setSuccess("Bomba eliminada correctamente.");
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
     * Limpia automáticamente mensajes de errorAction/éxito después de 3 segundos.
     */
    useEffect(() => {
        if (errorAction || success) {
            const timer = setTimeout(() => {
                setErrorAction(null);
                setSuccess(null);
            }, 3000);
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

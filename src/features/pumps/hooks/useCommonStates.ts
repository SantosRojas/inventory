import { useState, useCallback } from 'react';

// Hook para manejar el estado de múltiples modales
export const useModals = () => {
    const [modals, setModals] = useState({
        add: false,
        edit: false,
        delete: false,
        qr: false
    });

    const openModal = useCallback((modalType: keyof typeof modals) => {
        setModals(prev => ({ ...prev, [modalType]: true }));
    }, []);

    const closeModal = useCallback((modalType: keyof typeof modals) => {
        setModals(prev => ({ ...prev, [modalType]: false }));
    }, []);

    const closeAllModals = useCallback(() => {
        setModals({
            add: false,
            edit: false,
            delete: false,
            qr: false
        });
    }, []);

    return {
        modals,
        openModal,
        closeModal,
        closeAllModals
    };
};

// Hook para manejar selección de elementos
export const useSelection = <T>() => {
    const [selectedItem, setSelectedItem] = useState<T | null>(null);

    const selectItem = useCallback((item: T) => {
        setSelectedItem(item);
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedItem(null);
    }, []);

    return {
        selectedItem,
        selectItem,
        clearSelection
    };
};

// Hook para manejar estados de operaciones asíncronas
export const useAsyncOperation = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async <T>(
        operation: () => Promise<T>,
        onSuccess?: (result: T) => void,
        onError?: (error: Error) => void
    ) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await operation();
            onSuccess?.(result);
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Ha ocurrido un error';
            setError(errorMessage);
            onError?.(err instanceof Error ? err : new Error(errorMessage));
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        isLoading,
        error,
        execute,
        clearError
    };
};

// Hook para manejar confirmaciones
export const useConfirmation = () => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationData, setConfirmationData] = useState<{
        title?: string;
        message?: string;
        onConfirm?: () => void;
        onCancel?: () => void;
    }>({});

    const requestConfirmation = useCallback((data: typeof confirmationData) => {
        setConfirmationData(data);
        setShowConfirmation(true);
    }, []);

    const handleConfirm = useCallback(() => {
        confirmationData.onConfirm?.();
        setShowConfirmation(false);
        setConfirmationData({});
    }, [confirmationData]);

    const handleCancel = useCallback(() => {
        confirmationData.onCancel?.();
        setShowConfirmation(false);
        setConfirmationData({});
    }, [confirmationData]);

    return {
        showConfirmation,
        confirmationData,
        requestConfirmation,
        handleConfirm,
        handleCancel
    };
};

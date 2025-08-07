import { useCallback } from 'react';
import { usePumpStore } from '../../../store';

// Hook para manejar la lógica de la tabla
export const usePumpsTable = () => {
    // Selectores individuales optimizados
    const pumpData = usePumpStore((state) => state.pumpData);
    const isLoading = usePumpStore((state) => state.isLoading);

    // Función de formateo de fecha memoizada
    const formatDate = useCallback((dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-ES');
    }, []);

    // Función de color de estado memoizada
    const getStatusColor = useCallback((status: string) => {
        const STATUS_COLORS = {
            operativo: 'bg-green-100 text-green-800 border-green-200',
            mantenimiento: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'fuera de servicio': 'bg-red-100 text-red-800 border-red-200',
            inoperativo: 'bg-red-100 text-red-800 border-red-200',
            default: 'bg-gray-100 text-gray-800 border-gray-200'
        } as const;
        
        const normalizedStatus = status.toLowerCase() as keyof typeof STATUS_COLORS;
        return STATUS_COLORS[normalizedStatus] || STATUS_COLORS.default;
    }, []);

    return {
        pumpData,
        isLoading,
        formatDate,
        getStatusColor
    };
};

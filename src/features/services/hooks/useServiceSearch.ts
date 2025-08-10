import { useState, useMemo } from 'react';
import type { ServiceExtended } from '../types';

/**
 * Hook personalizado para manejar la búsqueda y filtrado de servicios
 */
export function useServiceSearch(services: ServiceExtended[]) {
    const [searchTerm, setSearchTerm] = useState('');

    // Filtrar servicios según el término de búsqueda
    const filteredServices = useMemo(() => {
        if (!searchTerm.trim()) {
            return services;
        }
        
        const searchLower = searchTerm.toLowerCase().trim();
        return services.filter(service => 
            service.name.toLowerCase().includes(searchLower)
        );
    }, [services, searchTerm]);

    // Función para limpiar la búsqueda
    const clearSearch = () => setSearchTerm('');

    // Función para verificar si un servicio es el último en el filtro
    const isLastFilteredService = (serviceId: number) => {
        return searchTerm.trim() && 
               filteredServices.length === 1 && 
               filteredServices[0].id === serviceId;
    };

    return {
        searchTerm,
        setSearchTerm,
        filteredServices,
        clearSearch,
        isLastFilteredService,
        hasActiveSearch: searchTerm.trim().length > 0,
        hasResults: filteredServices.length > 0
    };
}

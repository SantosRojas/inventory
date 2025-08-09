import { useState, useMemo } from 'react';
import type { InstitutionExtended } from '../types';

/**
 * Hook personalizado para manejar la búsqueda y filtrado de instituciones
 */
export function useInstitutionSearch(institutions: InstitutionExtended[]) {
    const [searchTerm, setSearchTerm] = useState('');

    // Filtrar instituciones según el término de búsqueda
    const filteredInstitutions = useMemo(() => {
        if (!searchTerm.trim()) {
            return institutions;
        }
        
        const searchLower = searchTerm.toLowerCase().trim();
        return institutions.filter(institution => 
            institution.name.toLowerCase().includes(searchLower) ||
            institution.code.toLowerCase().includes(searchLower)
        );
    }, [institutions, searchTerm]);

    // Función para limpiar la búsqueda
    const clearSearch = () => setSearchTerm('');

    // Función para verificar si una institución es la última en el filtro
    const isLastFilteredInstitution = (institutionId: number) => {
        return searchTerm.trim() && 
               filteredInstitutions.length === 1 && 
               filteredInstitutions[0].id === institutionId;
    };

    return {
        searchTerm,
        setSearchTerm,
        filteredInstitutions,
        clearSearch,
        isLastFilteredInstitution,
        hasActiveSearch: searchTerm.trim().length > 0,
        hasResults: filteredInstitutions.length > 0
    };
}

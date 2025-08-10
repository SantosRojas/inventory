import { useState, useMemo } from 'react';
import type { UserExtended } from '../types';

/**
 * Hook personalizado para manejar la búsqueda y filtrado de usuarios
 */
export function useUserSearch(users: UserExtended[]) {
    const [searchTerm, setSearchTerm] = useState('');

    // Filtrar usuarios según el término de búsqueda
    const filteredUsers = useMemo(() => {
        if (!searchTerm.trim()) {
            return users;
        }
        
        const searchLower = searchTerm.toLowerCase().trim();
        return users.filter(user => 
            user.firstName.toLowerCase().includes(searchLower) ||
            user.lastName.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower) ||
            user.cellPhone.toLowerCase().includes(searchLower) ||
            user.role.toLowerCase().includes(searchLower) ||
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchLower)
        );
    }, [users, searchTerm]);

    // Función para limpiar la búsqueda
    const clearSearch = () => setSearchTerm('');

    // Función para verificar si un usuario es el último en el filtro
    const isLastFilteredUser = (userId: number) => {
        return searchTerm.trim() && 
               filteredUsers.length === 1 && 
               filteredUsers[0].id === userId;
    };

    return {
        searchTerm,
        setSearchTerm,
        filteredUsers,
        clearSearch,
        isLastFilteredUser,
        hasActiveSearch: searchTerm.trim().length > 0,
        hasResults: filteredUsers.length > 0
    };
}

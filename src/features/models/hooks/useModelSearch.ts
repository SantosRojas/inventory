import { useMemo, useCallback } from 'react';
import { useModelsStore } from '../store/modelsStore';

/**
 * Hook para buscar y filtrar modelos
 */
export const useModelSearch = () => {
  const { models, searchTerm, setSearchTerm } = useModelsStore();

  // Función optimizada para actualizar el término de búsqueda
  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, [setSearchTerm]);

  // Filtrar modelos basado en el término de búsqueda
  const filteredModels = useMemo(() => {
    if (!searchTerm.trim()) {
      return models;
    }

    const lowercaseSearch = searchTerm.toLowerCase();
    return models.filter(model => 
      model.name.toLowerCase().includes(lowercaseSearch) ||
      model.code.toLowerCase().includes(lowercaseSearch)
    );
  }, [models, searchTerm]);

  return {
    models: filteredModels,
    searchTerm,
    setSearchTerm: handleSearchChange,
    hasResults: filteredModels.length > 0,
    totalModels: models.length,
    filteredCount: filteredModels.length,
  };
};

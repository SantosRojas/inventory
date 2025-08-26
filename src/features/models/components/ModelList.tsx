import React from 'react';
import { useModelSearch } from '../hooks/useModelSearch';
import { ModelCard } from './ModelCard.js';
import Input from '../../../components/Input';
import type { Model } from '../types/models.types';

interface ModelListProps {
  onEdit?: (model: Model) => void;
  onDelete?: (model: Model) => void;
  isLoading?: boolean;
}

export const ModelList: React.FC<ModelListProps> = ({
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  const { models, searchTerm, setSearchTerm, hasResults, totalModels, filteredCount } = useModelSearch();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between sticky top-0 z-10 bg-secondary">
        <div className="flex-1 max-w-md">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por código o nombre..."
            className="w-full"
          />
        </div>
        <div className="text-sm text-gray-500">
          {searchTerm ? (
            <>
              Mostrando {filteredCount} de {totalModels} modelos
            </>
          ) : (
            <>
              {totalModels} {totalModels === 1 ? 'modelo' : 'modelos'} total
            </>
          )}
        </div>
      </div>

      {/* Lista de modelos */}
      {hasResults ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {models.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-500">
            {searchTerm ? (
              <>
                <p className="text-lg mb-2">No se encontraron modelos</p>
                <p className="text-sm">
                  No hay modelos que coincidan con "{searchTerm}"
                </p>
              </>
            ) : (
              <>
                <p className="text-lg mb-2">No hay modelos registrados</p>
                <p className="text-sm">
                  Comienza agregando tu primer modelo
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

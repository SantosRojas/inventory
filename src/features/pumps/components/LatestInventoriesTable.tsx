import React, { memo, useState, useEffect } from 'react';
import type { Pump } from '../../../types';
import { PumpsTableDesktop, PumpsTableMobile, LoadingState, usePumpsTable } from './table';

interface LatestInventoriesTableProps {
  inventories: Pump[];
  isLoading: boolean;
  error: string | null;
  limit: number;
  onLimitChange: (limit: number) => void;
  onRefresh: () => void;
  onEdit: (pump: Pump) => void;
  onDelete: (pump: Pump) => void;
}

const LatestInventoriesTable = memo(({
  inventories,
  isLoading,
  error,
  limit,
  onLimitChange,
  onRefresh,
  onEdit,
  onDelete,
}: LatestInventoriesTableProps) => {
  const { formatDate, getStatusColor } = usePumpsTable();
  
  // Estado local para el input - evita renders innecesarios
  const [localLimit, setLocalLimit] = useState(limit.toString());

  // Sincronizar el estado local cuando cambie el limit global
  useEffect(() => {
    setLocalLimit(limit.toString());
  }, [limit]);

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Solo actualiza el estado local, no el global
    setLocalLimit(e.target.value);
  };

  const handleRefresh = () => {
    // Actualiza el estado global y ejecuta la búsqueda
    const newLimit = parseInt(localLimit);
    if (!isNaN(newLimit) && newLimit > 0 && newLimit <= 100) {
      onLimitChange(newLimit);
    }
    onRefresh();
  };

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <div className="text-red-500 text-sm mb-2">❌ Error al cargar últimos inventarios</div>
          <div className="text-gray-600 text-xs mb-4">{error}</div>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            🔄 Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header con controles */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">📋 Últimos Inventarios</h3>
            <p className="text-sm text-gray-600 mt-1">
              {isLoading ? 'Cargando...' : `Mostrando los últimos ${inventories.length} inventarios registrados`}
              {!isLoading && inventories.length > 0 && (
                <span className="text-gray-500"> • Presiona "Actualizar" para aplicar cambios en el límite</span>
              )}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="limit" className="text-sm font-medium text-gray-700">
                Mostrar:
              </label>
              <input
                id="limit"
                type="number"
                min="1"
                max="100"
                value={localLimit}
                onChange={handleLimitChange}
                className="w-20 px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
              <span className="text-sm text-gray-500">elementos</span>
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors text-sm flex items-center gap-1"
            >
              {isLoading ? '⏳' : '🔄'} Actualizar
            </button>
          </div>
        </div>
      </div>

      {/* Contenido de la tabla */}
      {isLoading ? (
        <LoadingState />
      ) : inventories.length === 0 ? (
        <div className="p-8 text-center">
          <div className="text-gray-400 text-lg mb-2">📭</div>
          <div className="text-gray-600 font-medium">No hay inventarios registrados</div>
          <div className="text-gray-500 text-sm mt-1">Los últimos inventarios aparecerán aquí</div>
        </div>
      ) : (
        <>
          <PumpsTableDesktop
            pumpData={inventories}
            formatDate={formatDate}
            getStatusColor={getStatusColor}
            onEdit={onEdit}
            onDelete={onDelete}
          />
          
          <PumpsTableMobile
            pumpData={inventories}
            formatDate={formatDate}
            getStatusColor={getStatusColor}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </>
      )}
    </div>
  );
});

LatestInventoriesTable.displayName = 'LatestInventoriesTable';

export default LatestInventoriesTable;

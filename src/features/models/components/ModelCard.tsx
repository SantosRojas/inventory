import React from 'react';
import Button from '../../../components/Button';
import type { Model } from '../types/models.types';

interface ModelCardProps {
  model: Model;
  onEdit?: (model: Model) => void;
  onDelete?: (model: Model) => void;
}

export const ModelCard: React.FC<ModelCardProps> = ({
  model,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Header con código */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Código
          </div>
          <div className="text-sm font-mono font-medium text-gray-900 mt-1">
            {model.code}
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(model)}
              className="text-gray-400 hover:text-blue-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(model)}
              className="text-gray-400 hover:text-red-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </Button>
          )}
        </div>
      </div>

      {/* Nombre del modelo */}
      <div className="mb-4">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
          Nombre
        </div>
        <div className="text-base font-medium text-gray-900 leading-tight">
          {model.name}
        </div>
      </div>

      {/* Footer con ID */}
      <div className="text-xs text-gray-400 border-t pt-2">
        ID: {model.id}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useModelsStore } from '../store/index.js';
import { ModelList } from '../components/ModelList';
import { CreateModelModal, EditModelModal, DeleteModelModal } from '../modals';
import Button from '../../../components/Button';
import type { Model } from '../types/models.types';

export const ModelsPage: React.FC = () => {
  const { 
    loading, 
    error, 
    fetchModels, 
    clearError 
  } = useModelsStore();
  
  // Estados para modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);

  // Cargar modelos al montar el componente
  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  // Abrir modal de edición
  const openEditModal = (model: Model) => {
    console.log(model)
    setSelectedModel(model);
    setIsEditModalOpen(true);
  };

  // Abrir modal de eliminación
  const openDeleteModal = (model: Model) => {
    setSelectedModel(model);
    setIsDeleteModalOpen(true);
  };

  // Cerrar modales
  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    // Delay para limpiar el modelo seleccionado y permitir que el formulario termine su ciclo
    setTimeout(() => {
      setSelectedModel(null);
    }, 150);
  };

  // Pantalla de error si hay problemas al cargar
  if (error) {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error al cargar modelos</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <div className="mt-6">
            <Button
              variant="primary"
              onClick={() => {
                clearError();
                fetchModels();
              }}
            >
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modelos de Bombas</h1>
          <p className="text-gray-600 mt-1">
            Gestiona los modelos de bombas de infusión disponibles
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          disabled={loading}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Modelo
        </Button>
      </div>

      {/* Lista de modelos */}
      <ModelList
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        isLoading={loading}
      />

      {/* Modal de creación */}
      <CreateModelModal
        isOpen={isCreateModalOpen}
        onClose={closeModals}
      />

      {/* Modal de edición */}
      <EditModelModal
        isOpen={isEditModalOpen}
        model={selectedModel}
        onClose={closeModals}
      />

      {/* Modal de eliminación */}
      <DeleteModelModal
        isOpen={isDeleteModalOpen}
        model={selectedModel}
        onClose={closeModals}
      />
    </div>
  );
};

export default ModelsPage;

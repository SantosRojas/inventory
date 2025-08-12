import React, { useState } from 'react';
import Modal from '../../../components/Modal';
import Button from '../../../components/Button';
import { useModelsStore } from '../store/index.js';
import { useNotifications } from '../../../hooks/useNotifications';
import type { Model } from '../types/models.types';

interface DeleteModelModalProps {
  isOpen: boolean;
  model: Model | null;
  onClose: () => void;
}

export const DeleteModelModal: React.FC<DeleteModelModalProps> = ({
  isOpen,
  model,
  onClose,
}) => {
  const { deleteModel } = useModelsStore();
  const { notifySuccess, notifyError } = useNotifications();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!model) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteModel(model.id);
      notifySuccess('Modelo eliminado exitosamente');
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el modelo';
      notifyError('Error al eliminar modelo', errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Eliminar Modelo">
      <div className="space-y-4">
        <div className="text-gray-600">
          <p className="mb-2">
            ¿Estás seguro de que deseas eliminar este modelo?
          </p>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm">
              <div className="font-medium text-gray-900">{model.name}</div>
              <div className="text-gray-500 font-mono">Código: {model.code}</div>
              <div className="text-gray-400 text-xs">ID: {model.id}</div>
            </div>
          </div>
          <p className="mt-2 text-sm text-red-600">
            <strong>Esta acción no se puede deshacer.</strong>
          </p>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            variant="danger"
            onClick={handleConfirm}
            disabled={isDeleting}
            isLoading={isDeleting}
            className="flex-1"
          >
            Eliminar Modelo
          </Button>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

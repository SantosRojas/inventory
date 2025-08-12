import React from 'react';
import Modal from '../../../components/Modal';
import { EditModelForm } from '../components/EditModelForm';
import { useModelsStore } from '../store/index.js';
import { useNotifications } from '../../../hooks/useNotifications';
import { type Model } from '../types/index.js';
import { type ModelFormData } from '../schemas/validations';

interface EditModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: Model | null;
}

export const EditModelModal: React.FC<EditModelModalProps> = ({
  isOpen,
  onClose,
  model,
}) => {
  const { updateModel, loading } = useModelsStore();
  const { notifySuccess, notifyError } = useNotifications();

  const handleSubmit = async (data: ModelFormData) => {
    if (!model) return;
    
    try {
      await updateModel(model.id, data);
      notifySuccess('Modelo actualizado exitosamente');
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el modelo';
      notifyError('Error al actualizar modelo', errorMessage);
    }
  };

  // No renderizar si no hay modelo
  if (!model) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Editar Modelo: ${model.name}`}
      size="md"
    >
      <div className="space-y-4">
        <EditModelForm
          model={model}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={loading}
        />
      </div>
    </Modal>
  );
};

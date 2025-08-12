import React from 'react';
import Modal from '../../../components/Modal';
import { CreateModelForm } from '../components/CreateModelForm';
import { useModelsStore } from '../store/index.js';
import { useNotifications } from '../../../hooks/useNotifications';
import { type ModelFormData } from '../schemas/validations';

interface CreateModelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateModelModal: React.FC<CreateModelModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { createModel, loading } = useModelsStore();
  const { notifySuccess, notifyError } = useNotifications();

  const handleSubmit = async (data: ModelFormData) => {
    try {
      await createModel(data);
      notifySuccess('Modelo creado exitosamente');
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear el modelo';
      notifyError('Error al crear modelo', errorMessage);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Nuevo Modelo"
      size="md"
    >
      <div className="space-y-4">
        <CreateModelForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={loading}
        />
      </div>
    </Modal>
  );
};

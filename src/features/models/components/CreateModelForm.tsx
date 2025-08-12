import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { modelSchema, type ModelFormData } from '../schemas/validations';
import Input from '../../../components/Input';
import Button from '../../../components/Button';

interface CreateModelFormProps {
  onSubmit: (data: ModelFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const CreateModelForm: React.FC<CreateModelFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ModelFormData>({
    resolver: zodResolver(modelSchema),
    defaultValues: {
      code: '',
      name: '',
    },
    mode: 'onChange',
  });

  const handleFormSubmit = async (data: ModelFormData) => {
    try {
      await onSubmit(data);
      // Resetear formulario después de crear exitosamente
      reset();
    } catch (error) {
      // Error manejado por el componente padre
      console.error('Error en CreateModelForm:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <Input
              label="Código del Modelo"
              {...field}
              error={errors.code?.message}
              placeholder="Ej: 8713030"
              disabled={isLoading}
            />
          )}
        />
      </div>

      <div>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              label="Nombre del Modelo"
              {...field}
              error={errors.name?.message}
              placeholder="Ej: Infusomat Space"
              disabled={isLoading}
            />
          )}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          type="submit"
          variant="primary"
          disabled={!isValid || isLoading}
          isLoading={isLoading}
          className="flex-1"
        >
          Crear Modelo
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

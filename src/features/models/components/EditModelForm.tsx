import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { modelSchema, type ModelFormData } from '../schemas/validations';
import { type Model } from '../types/index.js';
import Input from '../../../components/Input';
import Button from '../../../components/Button';

interface EditModelFormProps {
  model: Model;
  onSubmit: (data: ModelFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const EditModelForm: React.FC<EditModelFormProps> = ({
  model,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    setValue,
  } = useForm<ModelFormData>({
    resolver: zodResolver(modelSchema),
    defaultValues: {
      code: '',
      name: '',
    },
    mode: 'onChange',
  });

  // Inicializar formulario con datos del modelo (igual que servicios)
  useEffect(() => {
    if (model) {
      setValue('code', model.code || '');
      setValue('name', model.name || '');
    }
  }, [model, setValue]);

  const handleFormSubmit = async (data: ModelFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      // Error manejado por el componente padre
      console.error('Error en EditModelForm:', error);
    }
  };

  // Obtener valores actuales para mostrar si hay cambios
  const currentCode = watch('code');
  const currentName = watch('name');
  
  const hasChanges = isDirty || currentCode !== model.code || currentName !== model.name;

  return (
    <div className="space-y-4">
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
            disabled={!isValid || !hasChanges || isLoading}
            isLoading={isLoading}
            className="flex-1"
          >
            {hasChanges ? 'Guardar Cambios' : 'Sin Cambios'}
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
    </div>
  );
};

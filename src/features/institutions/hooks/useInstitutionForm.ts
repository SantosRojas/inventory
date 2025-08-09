import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useNotifications } from '../../../hooks/useNotifications';
import { useInstitutionActions } from './useInstitutionActions';
import { 
    createInstitutionSchema, 
    updateInstitutionSchema,
    type CreateInstitutionFormData,
    type UpdateInstitutionFormData
} from '../schemas';
import type { InstitutionExtended, CreateInstitution, UpdateInstitution } from '../types';

/**
 * Hook personalizado para manejar formularios de instituciones
 * Centraliza la lógica común de validación, notificaciones y envío
 */
export const useInstitutionForm = (
    mode: 'create' | 'edit',
    institution?: InstitutionExtended | null,
    onSuccess?: () => void,
    onClose?: () => void
) => {
    const { create, update, loadingAction, errorAction, success } = useInstitutionActions();
    const { notifySuccess, notifyError } = useNotifications();

    const isEditMode = mode === 'edit';
    const schema = isEditMode ? updateInstitutionSchema : createInstitutionSchema;
    
    const form = useForm<CreateInstitutionFormData | UpdateInstitutionFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            code: ''
        }
    });

    const { handleSubmit, control, formState: { errors, isDirty }, reset, setValue } = form;

    // Inicializar formulario para edición
    useEffect(() => {
        if (isEditMode && institution) {
            setValue('name', institution.name || '');
            setValue('code', institution.code || '');
        }
    }, [isEditMode, institution, setValue]);

    // Manejar notificaciones de éxito
    useEffect(() => {
        if (success) {
            const message = isEditMode 
                ? 'Institución actualizada exitosamente'
                : 'Institución creada exitosamente';
            notifySuccess(message);
            reset();
            onClose?.();
            onSuccess?.();
        }
    }, [success, notifySuccess, reset, onClose, onSuccess, isEditMode]);

    // Manejar notificaciones de error
    useEffect(() => {
        if (errorAction) {
            notifyError(errorAction);
        }
    }, [errorAction, notifyError]);

    const onSubmit = async (data: CreateInstitutionFormData | UpdateInstitutionFormData) => {
        if (isEditMode && institution) {
            // Modo edición
            const payload: UpdateInstitution = {
                ...(data.name && { name: data.name.trim() }),
                ...(data.code && { code: data.code.trim().toUpperCase() })
            };
            await update(institution.id, payload);
        } else {
            // Modo creación
            const payload: CreateInstitution = {
                name: (data.name as string).trim(),
                code: (data.code as string).trim().toUpperCase()
            };
            await create(payload);
        }
    };

    const handleClose = () => {
        if (isDirty && !loadingAction) {
            // Este hook no maneja UI directamente, deja que el componente maneje la confirmación
            console.warn('Formulario con cambios sin guardar');
        }
        onClose?.();
    };

    return {
        // Form methods
        handleSubmit: handleSubmit(onSubmit),
        control,
        errors,
        isDirty,
        reset,
        
        // States
        isLoading: loadingAction,
        error: errorAction,
        isSuccess: success,
        
        // Handlers
        handleClose
    };
};

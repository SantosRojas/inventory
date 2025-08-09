import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Modal } from '../../../components';
import { Save } from 'lucide-react';
import type { InstitutionExtended, UpdateInstitution } from '../types';
import { useNotifications } from '../../../hooks/useNotifications';
import { useInstitutionActions } from "../hooks";
import { updateInstitutionSchema, type UpdateInstitutionFormData } from "../schemas";

interface EditInstitutionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    institution: InstitutionExtended | null;
}

const EditInstitutionModal: React.FC<EditInstitutionModalProps> = ({ 
    isOpen, 
    onClose, 
    onSuccess, 
    institution 
}) => {
    const { update, loadingAction, errorAction, success } = useInstitutionActions();
    const { notifySuccess, notifyError } = useNotifications();
    const [showConfirmClose, setShowConfirmClose] = useState(false);

    const {
        handleSubmit,
        control,
        formState: { errors, isDirty },
        reset,
        setValue
    } = useForm<UpdateInstitutionFormData>({
        resolver: zodResolver(updateInstitutionSchema),
        defaultValues: {
            name: '',
            code: ''
        }
    });

    // Inicializar formulario con datos de la institución
    useEffect(() => {
        if (institution && isOpen) {
            setValue('name', institution.name || '');
            setValue('code', institution.code || '');
        }
    }, [institution, isOpen, setValue]);

    // Resetear estado de confirmación cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            setShowConfirmClose(false);
        }
    }, [isOpen]);

    // Manejar notificaciones de éxito
    useEffect(() => {
        if (success) {
            notifySuccess('Institución actualizada exitosamente');
            reset();
            onClose();
            onSuccess?.();
        }
    }, [success, notifySuccess, reset, onClose, onSuccess]);

    // Manejar notificaciones de error
    useEffect(() => {
        if (errorAction) {
            notifyError(errorAction);
        }
    }, [errorAction, notifyError]);

    const onSubmit = async (data: UpdateInstitutionFormData) => {
        if (!institution) return;

        const payload: UpdateInstitution = {
            ...(data.name && { name: data.name.trim() }),
            ...(data.code && { code: data.code.trim().toUpperCase() })
        };

        await update(institution.id, payload);
    };

    const handleClose = () => {
        if (!loadingAction) {
            // Si hay cambios en el formulario, mostrar confirmación
            if (isDirty && !showConfirmClose) {
                setShowConfirmClose(true);
                return;
            }
            // Si no hay cambios o ya confirmó, cerrar directamente
            reset();
            setShowConfirmClose(false);
            onClose();
        }
    };

    const handleConfirmClose = () => {
        reset();
        setShowConfirmClose(false);
        onClose();
    };

    const handleCancelClose = () => {
        setShowConfirmClose(false);
    };

    if (!institution) return null;

    return (
        <>
            <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Editar Institución"
            size="md"
            preventCloseOnOverlay={loadingAction || (isDirty && !showConfirmClose)}
            preventCloseOnEscape={loadingAction || (isDirty && !showConfirmClose)}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Banner de éxito */}
                {success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-green-800">
                                    <strong>Éxito:</strong> Institución actualizada exitosamente
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Banner de error */}
                {errorAction && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-800">
                                    <strong>Error:</strong> {errorAction}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Nombre */}
                    <Controller
                        control={control}
                        name="name"
                        render={({ field }) => (
                            <Input
                                label="Nombre *"
                                {...field}
                                error={errors.name?.message}
                                disabled={loadingAction}
                                placeholder="Ej: Hospital Central"
                            />
                        )}
                    />

                    {/* Código */}
                    <Controller
                        control={control}
                        name="code"
                        render={({ field }) => (
                            <Input
                                label="Código *"
                                {...field}
                                error={errors.code?.message}
                                disabled={loadingAction}
                                placeholder="Ej: HOSP-001"
                            />
                        )}
                    />
                </div>

                {/* Botones */}
                <div className="flex justify-end gap-2 pt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        disabled={loadingAction}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        icon={Save}
                        disabled={loadingAction || !isDirty}
                    >
                        {loadingAction ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </div>
            </form>
        </Modal>

        {/* Modal de confirmación para cerrar */}
        {showConfirmClose && (
            <Modal 
                isOpen={showConfirmClose} 
                onClose={handleCancelClose} 
                title="Confirmar cierre"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Hay cambios sin guardar. ¿Estás seguro de que deseas cerrar sin guardar?
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleCancelClose}
                        >
                            Continuar editando
                        </Button>
                        <Button
                            type="button"
                            variant="danger"
                            onClick={handleConfirmClose}
                        >
                            Descartar cambios
                        </Button>
                    </div>
                </div>
            </Modal>
        )}
        </>
    );
};

export default EditInstitutionModal;

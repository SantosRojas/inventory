import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useNotifications } from '../../../hooks/useNotifications';
import { Button, Input, Modal } from '../../../components';
import { Plus } from 'lucide-react';

import { useInstitutionActions } from "../hooks";
import { createInstitutionSchema, type CreateInstitutionFormData } from "../schemas";
import type { CreateInstitution } from "../types";

interface AddInstitutionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const AddInstitutionModal: React.FC<AddInstitutionModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { create, loadingAction, errorAction, success } = useInstitutionActions();
    const { notifySuccess, notifyError } = useNotifications();

    const {
        handleSubmit,
        control,
        formState: { errors, isDirty },
        reset
    } = useForm<CreateInstitutionFormData>({
        resolver: zodResolver(createInstitutionSchema)
    });

    // Manejar notificaciones de éxito
    useEffect(() => {
        if (success) {
            notifySuccess('Institución creada exitosamente');
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

    const [showConfirmClose, setShowConfirmClose] = useState(false);

    // Resetear estado de confirmación cuando se abre/cierra el modal
    useEffect(() => {
        if (isOpen) {
            setShowConfirmClose(false);
        }
    }, [isOpen]);

    const onSubmit = async (data: CreateInstitutionFormData) => {
        const payload: CreateInstitution = {
            name: data.name.trim(),
            code: data.code.trim().toUpperCase()
        };
        const result = await create(payload);

        if (result) {
            notifySuccess('Institución creada', `Institución "${data.name}" creada correctamente`);
            setShowConfirmClose(false);
            reset();
            onSuccess?.();
            onClose();
        }
    };

    const handleClose = () => {
        if (loadingAction) return;
        if (isDirty) {
            setShowConfirmClose(true);
        } else {
            reset();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                title="Agregar Nueva Institución"
                size="lg"
                variant="fullscreen-mobile"
                preventCloseOnOverlay={isDirty}
                preventCloseOnEscape={isDirty}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Mostrar errores de la API */}
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
                                        <strong>Éxito:</strong> Institución creada exitosamente
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


                        {/* Teléfono */}
                        <Controller
                            control={control}
                            name="code"
                            render={({ field }) => (
                                <Input
                                    label="Código"
                                    {...field}
                                    error={errors.code?.message}
                                    disabled={loadingAction}
                                    placeholder="Ej: HOSP-001"
                                />
                            )}
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-2 pt-3">
                        <Button
                            type="button"
                            onClick={handleClose}
                            variant="secondary"
                            disabled={loadingAction}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loadingAction}>
                            {loadingAction ? (
                                'Guardando...'
                            ) : (
                                <>
                                    <Plus className="h-4 w-4" /> Agregar Institución
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Confirmación de cierre */}
            {showConfirmClose && (
                <Modal
                    isOpen={true}
                    onClose={() => setShowConfirmClose(false)}
                    title="¿Descartar cambios?"
                >
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                            Tienes cambios sin guardar. ¿Seguro que deseas salir?
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="secondary"
                                onClick={() => setShowConfirmClose(false)}
                            >
                                Seguir editando
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => {
                                    setShowConfirmClose(false);
                                    reset();
                                    onClose();
                                }}
                            >
                                Descartar
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default AddInstitutionModal;

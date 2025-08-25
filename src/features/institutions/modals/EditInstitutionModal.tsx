import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Modal } from '../../../components';
import { Save } from 'lucide-react';
import type { InstitutionExtended, UpdateInstitution } from '../types';
import { useNotifications } from '../../../hooks/useNotifications';
import { useInstitutionStore } from "../store";
import { institutionSchema, type InstitutionFormData } from "../schemas";

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
    const { updateInstitution } = useInstitutionStore();
    const { notifySuccess, notifyError } = useNotifications();
    
    // Estados locales
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmClose, setShowConfirmClose] = useState(false);

    const {
        handleSubmit,
        control,
        formState: { errors, isDirty },
        reset,
    } = useForm<InstitutionFormData>({
        resolver: zodResolver(institutionSchema),
        defaultValues: {
            name: '',
            code: ''
        }
    });

    // Inicializar formulario con datos de la institución
    useEffect(() => {
        if (institution && isOpen) {
            // Usar reset con opciones para evitar marcar como dirty
            reset({
                name: institution.name || '',
                code: institution.code || ''
            }, { keepDirty: false, keepTouched: false });
        }
    }, [institution?.id, isOpen, reset]);

    // Resetear estado de confirmación cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            setShowConfirmClose(false);
        }
    }, [isOpen]);

    const onSubmit = async (data: InstitutionFormData) => {
        if (!institution) return;
        
        setIsLoading(true);
        try {
            const payload: UpdateInstitution = {
                name: data.name.trim(),
                code: data.code.trim().toUpperCase()
            };

            await updateInstitution(institution.id, payload);
            console.log("Institution updated:", institution.id);
            notifySuccess('Institución actualizada exitosamente');
            reset();
            onClose();
            onSuccess?.();
        } catch (error) {
            if (error instanceof Error) {
                notifyError(error.message);
            } else {
                notifyError('Error desconocido al actualizar la institución');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (isLoading) return;
        
        if (isDirty) {
            setShowConfirmClose(true);
        } else {
            onClose();
        }
    };

    const confirmClose = () => {
        reset();
        setShowConfirmClose(false);
        onClose();
    };

    if (!institution) return null;

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                title="Editar Institución"
                size="md"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <Controller
                            name="code"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Código"
                                    placeholder="Ingrese el código de la institución"
                                    error={errors.code?.message}
                                    disabled={isLoading}
                                />
                            )}
                        />

                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Nombre"
                                    placeholder="Ingrese el nombre de la institución"
                                    error={errors.name?.message}
                                    disabled={isLoading}
                                />
                            )}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Guardar Cambios
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Modal de confirmación para cerrar */}
            <Modal
                isOpen={showConfirmClose}
                onClose={() => setShowConfirmClose(false)}
                title="¿Descartar cambios?"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Tienes cambios sin guardar. ¿Estás seguro de que quieres cerrar sin guardar?
                    </p>
                    <div className="flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowConfirmClose(false)}
                        >
                            Continuar editando
                        </Button>
                        <Button
                            type="button"
                            variant="danger"
                            onClick={confirmClose}
                        >
                            Descartar cambios
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default EditInstitutionModal;

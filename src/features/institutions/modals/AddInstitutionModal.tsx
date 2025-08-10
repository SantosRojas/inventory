import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useNotifications } from '../../../hooks/useNotifications';
import { Button, Input, Modal } from '../../../components';
import { Plus } from 'lucide-react';

import { useInstitutionStore } from "../store";
import { createInstitutionSchema, type CreateInstitutionFormData } from "../schemas";
import type { CreateInstitution } from "../types";

interface AddInstitutionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddInstitutionModal: React.FC<AddInstitutionModalProps> = ({ isOpen, onClose }) => {
    const addInstitution  = useInstitutionStore((state) => state.addInstitution);
    const { notifySuccess, notifyError } = useNotifications();
    
    // Estados locales para el modal
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmClose, setShowConfirmClose] = useState(false);

    const {
        handleSubmit,
        control,
        formState: { errors, isDirty },
        reset
    } = useForm<CreateInstitutionFormData>({
        resolver: zodResolver(createInstitutionSchema)
    });

    // Resetear estado de confirmación cuando se abre/cierra el modal
    useEffect(() => {
        if (isOpen) {
            setShowConfirmClose(false);
        }
    }, [isOpen]);

    const onSubmit = async (data: CreateInstitutionFormData) => {
        setIsLoading(true);
        try {
            const payload: CreateInstitution = {
                name: data.name.trim(),
                code: data.code.trim().toUpperCase()
            };

            console.log("Payload to create institution:", payload);

            const id = await addInstitution(payload);
            if (id) {
                notifySuccess(`Institución creada exitosamente con id ${id}`);
                reset();
                onClose();
            } else {
                notifyError('Error al crear la institución');
            }
        } catch (error) {
            if (error instanceof Error) {
                notifyError(error.message);
            } else {
                notifyError('Error desconocido al crear la institución');
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

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                title="Agregar Nueva Institución"
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
                                    Creando...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Crear Institución
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

export default AddInstitutionModal;

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Modal } from '../../../components';
import { Save } from 'lucide-react';
import type { ServiceExtended, UpdateService } from '../types';
import { useNotifications } from '../../../hooks/useNotifications';
import { useServiceStore } from "../store";
import { serviceSchema, type ServiceFormData } from "../schemas";

interface EditServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    service: ServiceExtended | null;
}

const EditServiceModal: React.FC<EditServiceModalProps> = ({ 
    isOpen, 
    onClose, 
    onSuccess, 
    service 
}) => {
    const { updateService } = useServiceStore();
    const { notifySuccess, notifyError } = useNotifications();
    
    // Estados locales
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmClose, setShowConfirmClose] = useState(false);

    const {
        handleSubmit,
        control,
        formState: { errors, isDirty },
        reset,
        setValue
    } = useForm<ServiceFormData>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            name: ''
        }
    });

    // Inicializar formulario con datos del servicio
    useEffect(() => {
        if (service && isOpen) {
            setValue('name', service.name || '');
        }
    }, [service, isOpen, setValue]);

    // Resetear estado de confirmación cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            setShowConfirmClose(false);
        }
    }, [isOpen]);

    const onSubmit = async (data: ServiceFormData) => {
        if (!service) return;
        
        setIsLoading(true);
        try {
            const payload: UpdateService = {
                name: data.name.trim()
            };

            await updateService(service.id, payload);
            
            notifySuccess('Servicio actualizado exitosamente');
            reset();
            onClose();
            onSuccess?.();
        } catch (error) {
            if (error instanceof Error) {
                notifyError(error.message);
            } else {
                notifyError('Error desconocido al actualizar el servicio');
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

    if (!service) return null;

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                title="Editar Servicio"
                size="md"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Nombre"
                                    placeholder="Ingrese el nombre del servicio"
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

export default EditServiceModal;

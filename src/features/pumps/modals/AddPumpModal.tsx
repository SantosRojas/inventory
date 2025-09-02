import React, { useState, useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useNotifications } from '../../../hooks/useNotifications';
import { Button, Input, Modal, Autocomplete, Select, DateInput } from '../../../components';
import { Plus } from 'lucide-react';

import { useAuth } from "../../auth/hooks";
import { useCatalogsStore, usePumpStore } from "../store";
import { bombaSchema, type BombaSchemaType } from "../schemas/pumpSchema.ts";
import {
    transformInstitucionesForAutocomplete,
    transformModelosForSelect,
    transformServiciosForAutocomplete
} from "../utils";

interface AddBombaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const AddPumpModal: React.FC<AddBombaModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { user } = useAuth();
    const addPump = usePumpStore((state) => state.addPump)
    const error = usePumpStore((state) => state.error)
    const isLoading = usePumpStore((state) => state.isLoading)
    const clearError = usePumpStore((state) => state.clearError)
    const { notifySuccess, notifyError } = useNotifications();
    const { institutions, services, pumpModels } = useCatalogsStore();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<BombaSchemaType>({
        resolver: zodResolver(bombaSchema),
        defaultValues: {
            serialNumber: '',
            qrCode: '',
            modelId: 0,
            institutionId: 0,
            serviceId: 0,
            status: 'Operativo',
            lastMaintenanceDate: '',
            manufactureDate: '',
        },
    });

    const [showConfirmClose, setShowConfirmClose] = useState(false);

    // ✅ Memoizamos las transformaciones de catálogos
    const modelosItems = useMemo(() => transformModelosForSelect(pumpModels), [pumpModels]);
    const institucionesItems = useMemo(
        () => transformInstitucionesForAutocomplete(institutions),
        [institutions]
    );
    const serviciosItems = useMemo(() => transformServiciosForAutocomplete(services), [services]);

    // ✅ Resetear estado de confirmación cuando se abre/cierra el modal
    useEffect(() => {
        if (isOpen) {
            setShowConfirmClose(false); // Resetear al abrir
        }
    }, [isOpen]);

    const onSubmit = async (data: BombaSchemaType) => {
        if (!user?.id) return;

        const now = new Date().toISOString().split('T')[0];

        const payload = {
            ...data,
            lastMaintenanceDate: data.lastMaintenanceDate?.trim() || undefined,
            manufactureDate: data.manufactureDate?.trim() || undefined,
            inventoryTakerId: user.id,
            inventoryDate: now,
            createdAt: now,
        };

        const result = await addPump(payload);
        if (result) {
            notifySuccess('Bomba registrada', `Bomba registrada correctamente con ID: ${result}`);
            setShowConfirmClose(false);
            reset();
            onSuccess?.();
            onClose();
        } else {
            notifyError('Error', error ? error : "No se puede agregar la bomba");
        }
    };

    const handleConfirmClose = () => {
        setShowConfirmClose(false); // ✅ Resetear estado de confirmación
        reset();
        onClose();
        clearError()
    };

    const handleClose = () => {
        if (isLoading) return;
        if (isDirty) {
            setShowConfirmClose(true);
        } else {
            reset();
            onClose();
            clearError()
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                title="Agregar Nueva Bomba"
                size="lg"
                variant="fullscreen-mobile"
                preventCloseOnOverlay={isDirty}
                preventCloseOnEscape={isDirty}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Mostrar errores de la API */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-800">
                                        <strong>Error:</strong> {error}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Serial Number */}
                        <Controller
                            control={control}
                            name="serialNumber"
                            render={({ field }) => (
                                <Input
                                    label="Número de Serie *"
                                    {...field}
                                    error={errors.serialNumber?.message}
                                    disabled={isLoading}
                                />
                            )}
                        />

                        {/* QR Code */}
                        <Controller
                            control={control}
                            name="qrCode"
                            render={({ field }) => (
                                <Input
                                    label="Código QR *"
                                    {...field}
                                    error={errors.qrCode?.message}
                                    disabled={isLoading}
                                />
                            )}
                        />

                        {/* Modelo */}
                        <Controller
                            control={control}
                            name="modelId"
                            render={({ field }) => (
                                <Select
                                    label="Modelo *"
                                    value={field.value}
                                    onChange={field.onChange}
                                    items={modelosItems}
                                    error={errors.modelId?.message}
                                />
                            )}
                        />

                        {/* Status */}
                        <Controller
                            control={control}
                            name="status"
                            render={({ field }) => (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Estado *
                                    </label>
                                    <select
                                        {...field}
                                        disabled={isLoading}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="Operativo">Operativo</option>
                                        <option value="Inoperativo">Inoperativo</option>
                                    </select>
                                </div>
                            )}
                        />

                        {/* Institución */}
                        <Controller
                            control={control}
                            name="institutionId"
                            render={({ field }) => (
                                <Autocomplete
                                    label="Institución *"
                                    value={field.value}
                                    onChange={field.onChange}
                                    items={institucionesItems}
                                    error={errors.institutionId?.message}
                                />
                            )}
                        />

                        {/* Servicio */}
                        <Controller
                            control={control}
                            name="serviceId"
                            render={({ field }) => (
                                <Autocomplete
                                    label="Servicio *"
                                    value={field.value}
                                    onChange={field.onChange}
                                    items={serviciosItems}
                                    error={errors.serviceId?.message}
                                />
                            )}
                        />

                        {/* Fecha de Fabricación */}
                        <Controller
                            control={control}
                            name="manufactureDate"
                            render={({ field }) => (
                                <DateInput
                                    label="Fecha de Fabricación"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.manufactureDate?.message}
                                    disabled={isLoading}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="lastMaintenanceDate"
                            render={({ field }) => (
                                <DateInput
                                    label="Último mantenimiento"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.lastMaintenanceDate?.message}
                                    disabled={isLoading}
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
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                'Guardando...'
                            ) : (
                                <>
                                    <Plus className="h-4 w-4" /> Agregar Bomba
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
                                onClick={handleConfirmClose}
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

export default AddPumpModal;

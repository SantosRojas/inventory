import React, { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useNotifications } from '../../../hooks/useNotifications';
import { Button, Input, Modal, Autocomplete, Select } from '../../../components';
import { Plus } from 'lucide-react';

import { useAuth } from "../../auth/hooks";
import { useCatalogsStore } from "../store";
import { bombaSchema, type BombaSchemaType } from "../schemas/pumpSchema.ts";
import {
    transformInstitucionesForAutocomplete,
    transformModelosForSelect,
    transformServiciosForAutocomplete
} from "../utils";
import { usePumpActions } from "../hooks";

interface AddBombaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const AddPumpModal: React.FC<AddBombaModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { user } = useAuth();
    const { create, loadingAction, errorAction } = usePumpActions();
    const { notifySuccess, notifyError } = useNotifications();
    const { institutions, services, pumpModels } = useCatalogsStore();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isDirty },
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
        },
    });

    const [serverError, setServerError] = useState<string | null>(null);
    const [showConfirmClose, setShowConfirmClose] = useState(false);

    // ✅ Memoizamos las transformaciones de catálogos
    const modelosItems = useMemo(() => transformModelosForSelect(pumpModels), [pumpModels]);
    const institucionesItems = useMemo(
        () => transformInstitucionesForAutocomplete(institutions),
        [institutions]
    );
    const serviciosItems = useMemo(() => transformServiciosForAutocomplete(services), [services]);

    const onSubmit = async (data: BombaSchemaType) => {
        if (!user?.id) return;
        setServerError(null);

        const now = new Date().toISOString().split('T')[0];

        const payload = {
            ...data,
            lastMaintenanceDate: data.lastMaintenanceDate?.trim() || undefined,
            inventoryTakerId: user.id,
            inventoryDate: now,
            createdAt: now,
        };
        console.log(payload);

        const result = await create(payload);

        if (result && !loadingAction) {
            notifySuccess(`Bomba registrada con Id: ${result}`);
            reset();
            onSuccess?.();
            onClose();
        } else {
            notifyError('Error al registrar bomba'+errorAction);
            setServerError(errorAction);
        }
    };

    const handleClose = () => {
        if (isSubmitting) return;
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
                title="Agregar Nueva Bomba"
                preventCloseOnOverlay={isDirty}
                preventCloseOnEscape={isDirty}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Serial Number */}
                    <Controller
                        control={control}
                        name="serialNumber"
                        render={({ field }) => (
                            <Input
                                label="Número de Serie *"
                                {...field}
                                error={errors.serialNumber?.message}
                                disabled={isSubmitting}
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
                                disabled={isSubmitting}
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
                            <select {...field} disabled={isSubmitting} className="w-full border rounded-md p-2">
                                <option value="Operativo">Operativo</option>
                                <option value="Inoperativo">Inoperativo</option>
                            </select>
                        )}
                    />

                    {/* Fecha de mantenimiento */}
                    <Controller
                        control={control}
                        name="lastMaintenanceDate"
                        render={({ field }) => (
                            <Input
                                label="Último mantenimiento"
                                type="date"
                                {...field}
                                error={errors.lastMaintenanceDate?.message}
                                disabled={isSubmitting}
                            />
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

                    {serverError && <div className="text-red-500 text-sm">{serverError}</div>}

                    {/* Botones */}
                    <div className="flex justify-end gap-2 pt-3">
                        <Button
                            type="button"
                            onClick={handleClose}
                            variant="secondary"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting || loadingAction}>
                            {isSubmitting ? (
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
                                onClick={() => {
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

export default AddPumpModal;

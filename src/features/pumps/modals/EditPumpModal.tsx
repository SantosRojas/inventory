import React, { useState, useEffect } from 'react';
import { Button, Input, Modal, Autocomplete, Select } from '../../../components';
import { Save } from 'lucide-react';
import type { Pump, UpdatePump } from '../../../types';
import { useNotifications } from '../../../hooks/useNotifications';
import { useCatalogsStore } from "../store";
import { useAuth } from '../../auth/hooks';
import { usePumpWithStoreSync } from "../hooks";
import { transformInstitucionesForAutocomplete, transformModelosForSelect, transformServiciosForAutocomplete } from "../utils";
interface EditBombaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    bomba: Pump | null;
}

const EditPumpModal: React.FC<EditBombaModalProps> = ({ isOpen, onClose, onSuccess, bomba }) => {
    const { user } = useAuth();
    const { update, loadingAction, errorAction } = usePumpWithStoreSync();
    const { notifySuccess } = useNotifications();
    const {
        institutions,
        services,
        pumpModels,
    } = useCatalogsStore();

    // Verificar si el user es admin
    const isAdmin = user?.role === 'admin';

    const [formData, setFormData] = useState<UpdatePump>({
        serialNumber: '',
        qrCode: '',
        modelId: 0,
        institutionId: 0,
        serviceId: 0,
        status: 'Operativo',
        lastMaintenanceDate: '',
        inventoryDate: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showConfirmClose, setShowConfirmClose] = useState(false);

    // Función helper para convertir fecha ISO a formato YYYY-MM-DD
    const formatDateForInputLocal = (date: string | null | undefined): string => {
        if (!date) return '';
        try {
            // Si ya está en formato YYYY-MM-DD, devolverlo tal como está
            if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
                return date;
            }
            // Si es formato ISO, extraer solo la parte de la fecha
            return date.split('T')[0];
        } catch {
            return '';
        }
    };

    // Inicializar formulario con datos de la bomba
    useEffect(() => {
        if (bomba && isOpen) {
            // Buscar el modelId basado en el nombre del modelo
            const modeloEncontrado = pumpModels.find(m => m.name === bomba.model);

            // Buscar institutionId basado en el nombre de la institución
            const institucionEncontrada = institutions.find(i => i.name === bomba.institution);

            // Buscar serviceId basado en el nombre del servicio
            const servicioEncontrado = services.find(s => s.name === bomba.service);

            setFormData({
                serialNumber: bomba.serialNumber || '',
                qrCode: bomba.qrCode || '',
                modelId: modeloEncontrado?.id || 0,
                institutionId: institucionEncontrada?.id || 0,
                serviceId: servicioEncontrado?.id || 0,
                status: bomba.status || 'Operativo',
                lastMaintenanceDate: formatDateForInputLocal(bomba.lastMaintenanceDate),
                inventoryDate: formatDateForInputLocal(bomba.inventoryDate),
            });
        }
    }, [bomba, isOpen, pumpModels, institutions, services]);

    // ✅ Resetear estado de confirmación cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            setShowConfirmClose(false); // Resetear al abrir
        }
    }, [isOpen]);

    // Verificar si el formulario tiene cambios
    const hasFormChanges = (): boolean => {
        if (!bomba) return false;

        const modeloOriginal = pumpModels.find(m => m.name === bomba.model);

        // Verificar cambios en campos que todos pueden editar
        const commonFieldsChanged = (
            formData.serialNumber !== (bomba.serialNumber || '') ||
            formData.modelId !== (modeloOriginal?.id || 0)
        );

        // Si el user no es admin, solo considerar campos que puede editar
        if (!isAdmin) {
            return commonFieldsChanged;
        }

        // Si es admin, verificar todos los campos
        const institucionOriginal = institutions.find(i => i.name === bomba.institution);
        const servicioOriginal = services.find(s => s.name === bomba.service);

        const adminFieldsChanged = (
            formData.qrCode !== (bomba.qrCode || '') ||
            formData.institutionId !== (institucionOriginal?.id || 0) ||
            formData.serviceId !== (servicioOriginal?.id || 0) ||
            formData.status !== (bomba.status || 'Operativo') ||
            formData.lastMaintenanceDate !== formatDateForInputLocal(bomba.lastMaintenanceDate) ||
            formData.inventoryDate !== formatDateForInputLocal(bomba.inventoryDate)
        );

        return commonFieldsChanged || adminFieldsChanged;
    };

    const handleInputChange = (field: keyof typeof formData, value: string | number | undefined) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Limpiar error del campo cuando el user empiece a escribir
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    // Campos requeridos según el rol del usuario
    const getRequiredFields = () => {
        const commonFields = ['serialNumber', 'modelId'];
        const adminFields = ['qrCode', 'institutionId', 'serviceId']; // Removí inventoryDate
        return isAdmin ? [...commonFields, ...adminFields] : commonFields;
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        const requiredFields = getRequiredFields();

        // Validación dinámica de campos requeridos
        requiredFields.forEach(field => {
            const value = formData[field as keyof typeof formData];
            if (!value || (typeof value === 'number' && value === 0) || (typeof value === 'string' && !value.trim())) {
                const fieldLabels: Record<string, string> = {
                    serialNumber: 'El número de serie es requerido',
                    modelId: 'Debe seleccionar un modelo',
                    qrCode: 'El código QR es requerido',
                    institutionId: 'Debe seleccionar una institución',
                    serviceId: 'Debe seleccionar un servicio',
                    inventoryDate: 'La fecha de inventario es requerida'
                };
                newErrors[field] = fieldLabels[field] || `${field} es requerido`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || !bomba?.id) return;

        // Preparar los datos para actualización basados en los permisos del user
        const updateData: UpdatePump = {
            serialNumber: formData.serialNumber,
            modelId: formData.modelId,
        };

        // Solo admins pueden actualizar estos campos
        if (isAdmin) {
            updateData.qrCode = formData.qrCode;
            updateData.institutionId = formData.institutionId;
            updateData.serviceId = formData.serviceId;
            updateData.status = formData.status;
            
            // Usar siempre la fecha actual para inventoryDate
            updateData.inventoryDate = new Date().toISOString().split('T')[0];

            // Solo incluir lastMaintenanceDate si tiene un valor válido
            if (formData.lastMaintenanceDate && formData.lastMaintenanceDate.trim()) {
                updateData.lastMaintenanceDate = formData.lastMaintenanceDate;
            }
        }

        const result = await update(bomba.id, updateData);

        if (result) {
            notifySuccess('Bomba actualizada', 'La bomba se ha actualizado correctamente');
            onSuccess?.();
            onClose();
        }
        // No necesitamos catch porque el hook ya maneja los errores y los muestra en errorAction
    };

    const handleClose = () => {
        if (!loadingAction) {
            // Si hay cambios en el formulario, mostrar confirmación
            if (hasFormChanges() && !showConfirmClose) {
                setShowConfirmClose(true);
                return;
            }

            // Si ya se confirmó o no hay cambios, cerrar directamente
            resetForm();
            setShowConfirmClose(false);
            onClose();
        }
    };

    const resetForm = () => {
        setFormData({
            serialNumber: '',
            qrCode: '',
            modelId: 0,
            institutionId: 0,
            serviceId: 0,
            status: 'Operativo',
            lastMaintenanceDate: '',
            inventoryDate: '',
        });
        setErrors({});
    };

    const handleConfirmClose = () => {
        resetForm();
        setShowConfirmClose(false);
        onClose();
    };

    const handleCancelClose = () => {
        setShowConfirmClose(false);
    };


    if (!isOpen || !bomba) return null;

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                title="Editar Bomba"
                size="lg"
                variant="fullscreen-mobile"
                preventCloseOnOverlay={hasFormChanges() && !showConfirmClose}
                preventCloseOnEscape={hasFormChanges() && !showConfirmClose}
            >
                {!isAdmin && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-blue-800">
                                    <strong>Permisos limitados:</strong> Solo puedes editar el número de serie y el modelo.
                                    Los demás campos requieren permisos de administrador.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Mostrar errores de la API */}
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
                        {/* Número de Serie - Editable por todos */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Número de Serie *
                            </label>
                            <Input
                                type="text"
                                name="serialNumber"
                                value={formData.serialNumber || ''}
                                onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                                placeholder="Ingrese el número de serie"
                                error={errors.serialNumber}
                                disabled={loadingAction}
                            />
                        </div>

                        {/* Código QR - Solo admin */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Código QR * {!isAdmin && <span className="text-sm text-gray-500">(Solo lectura)</span>}
                            </label>
                            <Input
                                type="text"
                                name="qrCode"
                                value={formData.qrCode || ''}
                                onChange={(e) => handleInputChange('qrCode', e.target.value)}
                                placeholder="Ingrese el código QR"
                                error={errors.qrCode}
                                disabled={loadingAction || !isAdmin}
                                readOnly={!isAdmin}
                            />
                            {!isAdmin && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Solo los administradores pueden editar este campo
                                </p>
                            )}
                        </div>

                        {/* Modelo - Editable por todos */}
                        <div>
                            <Select
                                items={transformModelosForSelect(pumpModels && pumpModels.length > 0 ? pumpModels : [
                                    { id: 1, name: 'B.Braun Perfusor Space', code: 'BPS-001' },
                                    { id: 2, name: 'B.Braun Infusomat Space', code: 'BIS-001' }
                                ])}
                                value={formData.modelId || 0}
                                onChange={(value) => handleInputChange('modelId', value as number)}
                                label="Modelo *"
                                placeholder="Seleccione un modelo"
                                formatOption={(modelo) => `${modelo.name} - ${modelo.code}`}
                                emptyMessage="No hay modelos disponibles"
                                error={errors.modelId}
                                disabled={loadingAction}
                            />
                        </div>

                        {/* Institución - Solo admin */}
                        <div>
                            <Autocomplete
                                id="edit-institution-autocomplete"
                                name="institutionId"
                                items={transformInstitucionesForAutocomplete(institutions)}
                                value={formData.institutionId || 0}
                                onChange={(value) => handleInputChange('institutionId', value)}
                                label={`Institución * ${!isAdmin ? '(Solo lectura)' : ''}`}
                                placeholder="Seleccione una institución"
                                emptyMessage="No se encontraron instituciones"
                                error={errors.institutionId}
                                disabled={loadingAction || !isAdmin}
                                readOnly={!isAdmin}
                            />
                            {!isAdmin && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Solo los administradores pueden editar este campo
                                </p>
                            )}
                        </div>

                        {/* Servicio - Solo admin */}
                        <div>
                            <Autocomplete
                                id="edit-service-autocomplete"
                                name="serviceId"
                                items={transformServiciosForAutocomplete(services)}
                                value={formData.serviceId || 0}
                                onChange={(value) => handleInputChange('serviceId', value)}
                                label={`Servicio * ${!isAdmin ? '(Solo lectura)' : ''}`}
                                placeholder="Seleccione un servicio"
                                emptyMessage="No se encontraron servicios"
                                error={errors.serviceId}
                                disabled={loadingAction || !isAdmin}
                                readOnly={!isAdmin}
                            />
                            {!isAdmin && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Solo los administradores pueden editar este campo
                                </p>
                            )}
                        </div>

                        {/* Estado - Solo admin */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Estado * {!isAdmin && <span className="text-sm text-gray-500">(Solo lectura)</span>}
                            </label>
                            <select
                                id="edit-bomba-status"
                                name="status"
                                value={formData.status || 'Operativo'}
                                onChange={(e) => handleInputChange('status', e.target.value as 'Operativo' | 'Inoperativo')}
                                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!isAdmin ? 'bg-gray-100 cursor-not-allowed' : ''
                                    }`}
                                disabled={loadingAction || !isAdmin}
                            >
                                <option value="Operativo">Operativo</option>
                                <option value="Inoperativo">Inoperativo</option>
                            </select>
                            {!isAdmin && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Solo los administradores pueden editar este campo
                                </p>
                            )}
                        </div>

                        {/* Fecha de Inventario - Solo admin */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha de Inventario {!isAdmin && <span className="text-sm text-gray-500">(Solo lectura)</span>}
                            </label>
                            <Input
                                type="date"
                                name="inventoryDate"
                                value={new Date().toISOString().split('T')[0]} // Mostrar fecha actual
                                onChange={(e) => handleInputChange('inventoryDate', e.target.value)}
                                disabled={true} // Siempre deshabilitado ya que se usa fecha actual
                                readOnly={true}
                            />
                            {isAdmin ? (
                                <p className="text-xs text-blue-600 mt-1">
                                    ℹ️ Se usa automáticamente la fecha actual (hoy) al guardar cambios
                                </p>
                            ) : (
                                <p className="text-xs text-gray-500 mt-1">
                                    Solo los administradores pueden editar este campo
                                </p>
                            )}
                        </div>

                        {/* Última Fecha de Mantenimiento - Solo admin */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Última Fecha de Mantenimiento {!isAdmin && <span className="text-sm text-gray-500">(Solo lectura)</span>}
                            </label>
                            <Input
                                type="date"
                                name="lastMaintenanceDate"
                                value={formData.lastMaintenanceDate || ''}
                                onChange={(e) => handleInputChange('lastMaintenanceDate', e.target.value || '')}
                                disabled={loadingAction || !isAdmin}
                                readOnly={!isAdmin}
                            />
                            {!isAdmin && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Solo los administradores pueden editar este campo
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
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
                            disabled={loadingAction}
                        >
                            {loadingAction ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Modal de confirmación para cerrar */}
            {showConfirmClose && (
                <Modal isOpen={showConfirmClose} onClose={handleCancelClose} title="Confirmar cierre">
                    <div className="space-y-4">
                        <p className="text-gray-700">
                            ¿Estás seguro de que deseas cerrar? Se perderán todos los cambios no guardados.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleCancelClose}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="button"
                                variant="primary"
                                onClick={handleConfirmClose}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Cerrar sin guardar
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default EditPumpModal;

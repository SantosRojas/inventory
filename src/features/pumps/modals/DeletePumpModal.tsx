import React from 'react';
import { Button, Modal } from '../../../components';
import { Trash2, AlertTriangle } from 'lucide-react';
import type { Pump } from '../../../types';

interface DeleteBombaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    bomba: Pump | null;
    isDeleting?: boolean;
}

const DeletePumpModal: React.FC<DeleteBombaModalProps> = ({
                                                               isOpen,
                                                               onClose,
                                                               onConfirm,
                                                               bomba,
                                                               isDeleting = false
                                                           }) => {
    if (!isOpen || !bomba) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Eliminar Bomba"
            size="md"
        >
            <div className="space-y-4">
                {/* Icono de advertencia */}
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>

                {/* Mensaje de confirmación */}
                <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        ¿Estás seguro de que deseas eliminar esta bomba?
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Esta acción no se puede deshacer. Se eliminará permanentemente la bomba del inventario.
                    </p>
                </div>

                {/* Información de la bomba */}
                <div className="bg-gray-50 rounded-lg p-4 border">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">Modelo:</span>
                            <span className="text-sm text-gray-900">{bomba.model}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">Serie:</span>
                            <span className="text-sm text-gray-900">{bomba.serialNumber}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">QR:</span>
                            <span className="text-sm text-gray-900">{bomba.qrCode}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">Institución:</span>
                            <span className="text-sm text-gray-900">{bomba.institution}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">Servicio:</span>
                            <span className="text-sm text-gray-900">{bomba.service}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">Estado:</span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                bomba.status === 'Operativo'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            }`}>
                {bomba.status}
              </span>
                        </div>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="flex justify-end space-x-3 pt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        icon={Trash2}
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                    >
                        {isDeleting ? 'Eliminando...' : 'Eliminar Bomba'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default DeletePumpModal;

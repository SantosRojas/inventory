import React from 'react';
import { Button, Modal } from '../../../components';
import { Trash2 } from 'lucide-react';
import type { ServiceExtended } from '../types';

interface DeleteServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    service: ServiceExtended | null;
    isDeleting: boolean;
}

const DeleteServiceModal: React.FC<DeleteServiceModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    service,
    isDeleting
}) => {
    if (!isOpen || !service) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Eliminar Servicio"
            size="md"
            preventCloseOnOverlay={isDeleting}
            preventCloseOnEscape={isDeleting}
        >
            <div className="space-y-4">
                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <Trash2 className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            ¿Eliminar servicio?
                        </h3>
                        <div className="text-sm text-gray-600 space-y-2">
                            <p>
                                Estás a punto de eliminar el servicio:
                            </p>
                            <div className="bg-gray-50 p-3 rounded-md border">
                                <p className="font-medium text-gray-900">{service.name}</p>
                            </div>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                                <p className="text-yellow-800 text-sm">
                                    <strong>⚠️ Advertencia:</strong> Esta acción no se puede deshacer. 
                                    Si hay bombas asociadas a este servicio, la eliminación podría fallar.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
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
                        variant="danger"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            'Eliminando...'
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4" />
                                Eliminar Servicio
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteServiceModal;

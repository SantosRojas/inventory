import React from 'react';
import { Button, Modal } from '../../../components';
import { Trash2, AlertTriangle } from 'lucide-react';
import type { UserExtended } from '../types';
import { getRoleDisplayName } from '../../../services/rolesService';

interface DeleteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    user: UserExtended | null;
    isDeleting: boolean;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    user,
    isDeleting
}) => {
    if (!isOpen || !user) return null;

    // Simplificado: Si el modal se abre es porque ya se verificaron los permisos
    const hasPermission = true;
    
    // Si no tiene permisos, mostrar mensaje de error
    if (!hasPermission) {
        return (
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Sin Permisos"
                size="md"
            >
                <div className="text-center py-8">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="text-red-500 text-lg mb-4">
                        No tienes permisos para eliminar este usuario
                    </div>
                    <div className="text-sm text-gray-600 mb-6">
                        Usuario: {user.firstName} {user.lastName} ({getRoleDisplayName(user.role)})
                    </div>
                    <Button onClick={onClose} variant="outline">
                        Cerrar
                    </Button>
                </div>
            </Modal>
        );
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Eliminar Usuario"
            size="md"
            preventCloseOnOverlay={isDeleting}
            preventCloseOnEscape={isDeleting}
        >
            <div className="space-y-4">
                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            ¿Eliminar usuario?
                        </h3>
                        <div className="text-sm text-gray-600 space-y-3">
                            <p>
                                Estás a punto de eliminar el usuario:
                            </p>
                            <div className="bg-gray-50 p-4 rounded-md border">
                                <div className="space-y-1">
                                    <p className="font-medium text-gray-900">
                                        {user.firstName} {user.lastName}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {user.email}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Rol: {getRoleDisplayName(user.role)}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                <div className="flex items-start space-x-2">
                                    <Trash2 className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-red-800 text-sm font-medium">
                                            ⚠️ Advertencia: Esta acción es irreversible
                                        </p>
                                        <ul className="mt-2 text-red-700 text-sm list-disc list-inside space-y-1">
                                            <li>El usuario no podrá acceder al sistema</li>
                                            <li>Se perderán todos los datos asociados</li>
                                            <li>Las bombas asignadas a este usuario quedarán sin responsable</li>
                                            <li>El historial de inventarios del usuario se mantendrá por auditoría</li>
                                        </ul>
                                    </div>
                                </div>
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
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Eliminando...
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar Usuario
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteUserModal;

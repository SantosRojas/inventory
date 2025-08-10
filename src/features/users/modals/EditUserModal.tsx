import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Modal, Select } from '../../../components';
import { Save } from 'lucide-react';
import type { UserExtended, UpdateUser } from '../types';
import { useNotifications } from '../../../hooks/useNotifications';
import { useUserStore } from "../store";
import { updateUserSchema, type UpdateUserFormData } from "../schemas";
import { useUserPermissions } from "../hooks";

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    user: UserExtended | null;
}

const roleOptions = [
    { id: 'user', name: 'Usuario' },
    { id: 'admin', name: 'Administrador' },
    { id: 'superadmin', name: 'Super Admin' }
];

const EditUserModal: React.FC<EditUserModalProps> = ({ 
    isOpen, 
    onClose, 
    onSuccess, 
    user 
}) => {
    const { updateUser } = useUserStore();
    const { notifySuccess, notifyError } = useNotifications();
    const { canEditUserRole } = useUserPermissions();
    
    // Estados locales
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmClose, setShowConfirmClose] = useState(false);
    
    // Verificar si se puede editar el rol de este usuario
    const canEditRole = user ? canEditUserRole(user) : false;

    const {
        handleSubmit,
        control,
        formState: { errors, isDirty },
        reset,
        setValue
    } = useForm<UpdateUserFormData>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            cellPhone: '',
            email: '',
            role: 'user'
        }
    });

    // Inicializar formulario con datos del usuario
    useEffect(() => {
        if (user && isOpen) {
            setValue('firstName', user.firstName || '');
            setValue('lastName', user.lastName || '');
            setValue('cellPhone', user.cellPhone || '');
            setValue('email', user.email || '');
            setValue('role', user.role || 'user');
        }
    }, [user, isOpen, setValue]);

    // Resetear estado de confirmación cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            setShowConfirmClose(false);
        }
    }, [isOpen]);

    const onSubmit = async (data: UpdateUserFormData) => {
        if (!user) return;
        
        setIsLoading(true);
        try {
            // Solo enviar campos que han cambiado
            const payload: UpdateUser = {};
            if (data.firstName && data.firstName.trim() !== user.firstName) {
                payload.firstName = data.firstName.trim();
            }
            if (data.lastName && data.lastName.trim() !== user.lastName) {
                payload.lastName = data.lastName.trim();
            }
            if (data.cellPhone && data.cellPhone.trim() !== user.cellPhone) {
                payload.cellPhone = data.cellPhone.trim();
            }
            if (data.email && data.email.toLowerCase().trim() !== user.email.toLowerCase()) {
                payload.email = data.email.toLowerCase().trim();
            }
            if (canEditRole && data.role && data.role !== user.role) {
                payload.role = data.role;
            }

            // Solo actualizar si hay cambios
            if (Object.keys(payload).length === 0) {
                notifySuccess('No hay cambios que guardar');
                onClose();
                return;
            }

            await updateUser(user.id, payload);
            
            notifySuccess('Usuario actualizado exitosamente');
            reset();
            onClose();
            onSuccess?.();
        } catch (error) {
            if (error instanceof Error) {
                notifyError(error.message);
            } else {
                notifyError('Error desconocido al actualizar el usuario');
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

    if (!user) return null;

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                title={canEditRole ? "Editar Usuario" : "Mi Perfil"}
                size="md"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {!canEditRole && (
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800">
                                        Editando tu perfil personal
                                    </h3>
                                    <div className="mt-2 text-sm text-blue-700">
                                        <p>Puedes actualizar tu información personal. Para cambios en roles o permisos, contacta a un administrador.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Controller
                                name="firstName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Nombre"
                                        placeholder="Ingrese el nombre"
                                        error={errors.firstName?.message}
                                        disabled={isLoading}
                                        autoComplete="given-name"
                                    />
                                )}
                            />

                            <Controller
                                name="lastName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Apellido"
                                        placeholder="Ingrese el apellido"
                                        error={errors.lastName?.message}
                                        disabled={isLoading}
                                        autoComplete="family-name"
                                    />
                                )}
                            />
                        </div>

                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="email"
                                    label="Email"
                                    placeholder="Ingrese el email"
                                    error={errors.email?.message}
                                    disabled={isLoading}
                                    autoComplete="email"
                                />
                            )}
                        />

                        <Controller
                            name="cellPhone"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="tel"
                                    label="Teléfono"
                                    placeholder="Ingrese el teléfono"
                                    error={errors.cellPhone?.message}
                                    disabled={isLoading}
                                    autoComplete="tel"
                                />
                            )}
                        />

                        {canEditRole && (
                            <Controller
                                name="role"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        label="Rol"
                                        items={roleOptions}
                                        value={field.value || 'user'}
                                        onChange={(value) => field.onChange(value)}
                                        error={errors.role?.message}
                                        disabled={isLoading}
                                    />
                                )}
                            />
                        )}
                        
                        {!canEditRole && user && (
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Rol
                                </label>
                                <div className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-md">
                                    <span className="text-sm text-gray-600">
                                        {roleOptions.find(r => r.id === user.role)?.name || 'Usuario'}
                                    </span>
                                    <span className="ml-2 text-xs text-gray-500">
                                        (Solo lectura)
                                    </span>
                                </div>
                            </div>
                        )}
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

export default EditUserModal;

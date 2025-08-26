import React, { useEffect, useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Modal, Select } from '../../../components';
import { Save } from 'lucide-react';
import type { UserExtended, UpdateUser } from '../types';
import { useNotifications } from '../../../hooks/useNotifications';
import { useUserStore } from "../store";
import { updateUserSchema, type UpdateUserFormData } from "../schemas";
import { useUserPermissions } from "../hooks";
import { useRoles } from "../hooks/useRoles";

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    user: UserExtended | null;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ 
    isOpen, 
    onClose, 
    onSuccess, 
    user 
}) => {
    const { updateUser } = useUserStore();
    const { notifySuccess, notifyError } = useNotifications();
    const { canEditUserRole, canEditUserPersonalInfo, getAvailableRoles } = useUserPermissions();
    const { getRoleIdByName, isLoading: rolesLoading } = useRoles();
    
    // Estados locales
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmClose, setShowConfirmClose] = useState(false);
    
    // Memoizar los permisos para evitar recálculos constantes
    const canEditRole = useMemo(() => 
        user ? canEditUserRole() : false, 
        [user?.id, canEditUserRole]
    );
    
    const canEditPersonalInfo = useMemo(() => 
        user ? canEditUserPersonalInfo(user) : false, 
        [user?.id, user?.role, canEditUserPersonalInfo]
    );
    
    // Obtener roles disponibles (simplificado - no depende del usuario específico)
    const availableRoles = useMemo(() => {
        return getAvailableRoles();
    }, [getAvailableRoles]);
    
    // Convertir los roles disponibles al formato esperado por el componente Select
    const roleOptionsForUser = useMemo(() => {
        if (rolesLoading || !availableRoles.length) {
            return [];
        }
        
        return availableRoles.map(role => ({
            id: role.id,
            name: role.displayName
        }));
    }, [availableRoles, rolesLoading]);

    // Si no puede editar nada, no mostrar el modal
    if (!canEditRole && !canEditPersonalInfo) {
        return null;
    }

    // Crear schema dinámico basado en permisos - solo para info personal
    const dynamicSchema = useMemo(() => {
        if (canEditPersonalInfo) {
            // Validar solo campos de información personal
            return updateUserSchema.omit({ roleId: true }).partial();
        }
        // Si solo puede editar rol, no usar validación de Zod
        return null;
    }, [canEditPersonalInfo]);

    const {
        handleSubmit,
        control,
        formState: { errors, isDirty },
        reset,
    } = useForm<UpdateUserFormData>({
        resolver: dynamicSchema ? zodResolver(dynamicSchema) : undefined,
        defaultValues: {
            firstName: '',
            lastName: '',
            cellPhone: '',
            email: '',
            roleId: undefined
        }
    });

    // Resetear el formulario solo cuando cambie el usuario o se abra el modal
    useEffect(() => {
        if (user && isOpen) {
            const values: Partial<UpdateUserFormData> = {};
            
            if (canEditPersonalInfo) {
                values.firstName = user.firstName || '';
                values.lastName = user.lastName || '';
                values.cellPhone = user.cellPhone || '';
                values.email = user.email || '';
            }
            
            if (canEditRole && !rolesLoading) {
                const userRoleId = getRoleIdByName(user.role || 'guest');
                if (userRoleId !== undefined) {
                    values.roleId = userRoleId;
                } else {
                    const fallbackRole = availableRoles.find(r => r.name === user.role);
                    values.roleId = fallbackRole ? fallbackRole.id : 5;
                }
            }
            
            // Usar reset con keepDirty: false para evitar marcar el formulario como dirty
            reset(values, { keepDirty: false, keepTouched: false });
        }
    }, [user?.id, isOpen]); // Solo dependencias esenciales

    // Resetear estado de confirmación cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            setShowConfirmClose(false);
        }
    }, [isOpen]);

    const onSubmit = async (data: UpdateUserFormData) => {
        
        if (!user) {
            console.log("❌ Usuario no encontrado, saliendo...");
            return;
        }
        
        setIsLoading(true);
        try {
            const payload: UpdateUser = {};
            
            // Manejar información personal (con validación)
            if (canEditPersonalInfo) {
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
            }
            
            // Manejar rol (sin validación compleja - solo verificar que no esté vacío)
            if (canEditRole && data.roleId && data.roleId !== (user.roleId || getRoleIdByName(user.role || 'guest'))) {
                // Validación simple del roleId
                if (!data.roleId || data.roleId < 1) {
                    notifyError('Rol inválido seleccionado');
                    return;
                }
                payload.roleId = data.roleId;
            }

            // Solo actualizar si hay cambios
            if (Object.keys(payload).length === 0) {
                notifySuccess('No hay cambios que guardar');
                return;
            }

            console.log("📦 Payload a enviar:", payload);

            await updateUser(user.id, payload);
            
            notifySuccess('Usuario actualizado exitosamente');
            reset();
            onClose();
            onSuccess?.();
        } catch (error) {
            console.log(error)
            if (error instanceof Error) {
                notifyError(error.message);
            } else {
                notifyError('Error al actualizar el usuario');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (isDirty && !isLoading) {
            setShowConfirmClose(true);
        } else {
            confirmClose();
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
                title={canEditRole && !canEditPersonalInfo ? "Editar Rol de Usuario" : canEditPersonalInfo ? "Editar Usuario" : "Editar Usuario"}
                size="md"
            >
                <form 
                    onSubmit={handleSubmit(onSubmit)} 
                    className="space-y-6"
                >
                    {/* Mensaje informativo solo para admins editando roles */}
                    {!canEditPersonalInfo && canEditRole && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">
                                        Edición administrativa
                                    </h3>
                                    <div className="mt-2 text-sm text-yellow-700">
                                        <p>Como administrador, solo puedes cambiar el rol de este usuario.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        {/* Campos de información personal - solo si tiene permisos */}
                        {canEditPersonalInfo && (
                            <>
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
                            </>
                        )}

                        {/* Campo de rol - solo si tiene permisos */}
                        {canEditRole && (
                            <Controller
                                name="roleId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        label="Rol"
                                        items={roleOptionsForUser}
                                        value={field.value ?? ''}
                                        onChange={(value) => {
                                            const numericValue = Number(value);
                                            field.onChange(numericValue);
                                        }}
                                        error={errors.roleId?.message}
                                        disabled={isLoading || roleOptionsForUser.length === 0}
                                        placeholder="Seleccione un rol"
                                    />
                                )}
                            />
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2"
                        >
                            <Save className="h-4 w-4" />
                            {isLoading ? 'Guardando...' : 'Guardar cambios'}
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
                            variant="secondary"
                            onClick={() => setShowConfirmClose(false)}
                        >
                            Seguir editando
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

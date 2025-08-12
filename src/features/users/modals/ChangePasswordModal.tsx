import React, { useState, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Modal } from '../../../components';
import { Key, Eye, EyeOff } from 'lucide-react';
import type { UserExtended, UpdateUserPassword } from '../types';
import { useNotifications } from '../../../hooks/useNotifications';
import { useUserStore } from "../store";
import { useUserPermissions } from "../hooks";

// Esquemas separados - más simples y claros
const basePasswordValidation = z.string()
    .min(8, "La nueva contraseña debe tener al menos 8 caracteres")
    .max(100, "La contraseña no puede exceder 100 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
        "La contraseña debe contener al menos una minúscula, una mayúscula y un número");

// Schema para cambio de contraseña propia
const ownPasswordSchema = z.object({
    currentPassword: z.string().min(1, "La contraseña actual es requerida"),
    newPassword: basePasswordValidation,
    confirmPassword: z.string().min(1, "Confirmar contraseña es requerido")
})
.refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"]
})
.refine((data) => data.currentPassword !== data.newPassword, {
    message: "La nueva contraseña debe ser diferente a la actual",
    path: ["newPassword"]
});

// Schema para reseteo administrativo
const adminResetSchema = z.object({
    newPassword: basePasswordValidation,
    confirmPassword: z.string().min(1, "Confirmar contraseña es requerido")
})
.refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"]
});

interface PasswordFormData {
    currentPassword?: string;
    newPassword: string;
    confirmPassword: string;
}

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserExtended | null;
    onSuccess?: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
    isOpen,
    onClose,
    user,
    onSuccess
}) => {
    const { updateUserPassword } = useUserStore();
    const { notifySuccess, notifyError } = useNotifications();
    const { currentUserId } = useUserPermissions();
    
    // Estados locales
    const [isLoading, setIsLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    // Verificar si el usuario está cambiando su propia contraseña
    const isOwnPassword = user?.id === currentUserId;
    
    // Seleccionar schema según el contexto - más simple y claro
    const schema = useMemo(() => 
        isOwnPassword ? ownPasswordSchema : adminResetSchema, 
        [isOwnPassword]
    );

    const {
        handleSubmit,
        control,
        formState: { errors, isValid },
        reset
    } = useForm<PasswordFormData>({
        resolver: zodResolver(schema),
        mode: 'onChange', // Validar en tiempo real
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    // Reset form cuando se abre/cierra el modal o cambia el tipo de usuario
    useEffect(() => {
        if (isOpen) {
            reset();
            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);
        }
    }, [isOpen, isOwnPassword, reset]);

    const onSubmit = async (data: PasswordFormData) => {
        if (!user) return;
        
        setIsLoading(true);
        try {
            // Construcción del payload simple - el service agregará los campos requeridos
            const payload: UpdateUserPassword = isOwnPassword
                ? {
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                    confirmPassword: data.confirmPassword
                }
                : {
                    newPassword: data.newPassword,
                    confirmPassword: data.confirmPassword
                };

            await updateUserPassword(user.id, payload);
            
            notifySuccess(
                isOwnPassword 
                    ? 'Contraseña actualizada exitosamente' 
                    : `Contraseña de ${user.firstName} ${user.lastName} reseteada exitosamente`
            );
            reset();
            onClose();
            onSuccess?.();
        } catch (error) {
            console.error('❌ Error al cambiar contraseña:', error);
            if (error instanceof Error) {
                notifyError(error.message);
            } else {
                notifyError('Error desconocido al actualizar la contraseña');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            onClose();
        }
    };

    if (!user) return null;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Cambiar Contraseña">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="text-sm text-gray-600 mb-4">
                    {isOwnPassword 
                        ? 'Cambiar tu contraseña'
                        : `Resetear contraseña de ${user.firstName} ${user.lastName}`
                    }
                </div>

                {/* Campo de contraseña actual - solo para cambio propio */}
                {isOwnPassword && (
                    <Controller
                        name="currentPassword"
                        control={control}
                        render={({ field }) => (
                            <div className="relative">
                                <Input
                                    {...field}
                                    type={showCurrentPassword ? "text" : "password"}
                                    label="Contraseña actual"
                                    placeholder="Ingrese su contraseña actual"
                                    error={errors.currentPassword?.message}
                                    disabled={isLoading}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    disabled={isLoading}
                                >
                                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        )}
                    />
                )}

                {/* Campo de nueva contraseña */}
                <Controller
                    name="newPassword"
                    control={control}
                    render={({ field }) => (
                        <div className="relative">
                            <Input
                                {...field}
                                type={showNewPassword ? "text" : "password"}
                                label="Nueva contraseña"
                                placeholder="Ingrese la nueva contraseña"
                                error={errors.newPassword?.message}
                                disabled={isLoading}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                disabled={isLoading}
                            >
                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    )}
                />

                {/* Campo de confirmar contraseña */}
                <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                        <div className="relative">
                            <Input
                                {...field}
                                type={showConfirmPassword ? "text" : "password"}
                                label="Confirmar nueva contraseña"
                                placeholder="Confirme la nueva contraseña"
                                error={errors.confirmPassword?.message}
                                disabled={isLoading}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={isLoading}
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    )}
                />

                {/* Requisitos de contraseña */}
                <div className="bg-blue-50 p-3 rounded-md">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">
                        Requisitos de la contraseña:
                    </h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                        <li>Mínimo 8 caracteres</li>
                        <li>Al menos una letra minúscula</li>
                        <li>Al menos una letra mayúscula</li>
                        <li>Al menos un número</li>
                    </ul>
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
                    <Button type="submit" disabled={isLoading || !isValid}>
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Actualizando...
                            </>
                        ) : (
                            <>
                                <Key className="h-4 w-4 mr-2" />
                                Cambiar Contraseña
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

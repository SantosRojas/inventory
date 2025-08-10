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

// Esquema base para nueva contraseña
const basePasswordSchema = z.object({
    newPassword: z.string()
        .min(8, "La nueva contraseña debe tener al menos 8 caracteres")
        .max(100, "La contraseña no puede exceder 100 caracteres")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
            "La contraseña debe contener al menos una minúscula, una mayúscula y un número"),
    confirmPassword: z.string()
        .min(1, "Confirmar contraseña es requerido")
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"]
});

// Esquema para cambio de contraseña propia (requiere contraseña actual)
const ownPasswordSchema = basePasswordSchema.extend({
    currentPassword: z.string()
        .min(1, "La contraseña actual es requerida")
});

// Esquema para reseteo administrativo (no requiere contraseña actual)
const adminResetSchema = basePasswordSchema.extend({
    currentPassword: z.string().optional()
});

interface PasswordFormData {
    currentPassword?: string;
    newPassword: string;
    confirmPassword: string;
}

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    user: UserExtended | null;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ 
    isOpen, 
    onClose, 
    onSuccess, 
    user 
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
    
    // Seleccionar el esquema apropiado
    const validationSchema = useMemo(() => {
        return isOwnPassword ? ownPasswordSchema : adminResetSchema;
    }, [isOwnPassword]);

    const {
        handleSubmit,
        control,
        formState: { errors },
        reset
    } = useForm<PasswordFormData>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    // Resetear formulario cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            reset();
            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);
        }
    }, [isOpen, reset]);

    const onSubmit = async (data: PasswordFormData) => {
        if (!user) return;
        
        setIsLoading(true);
        try {
            const payload: UpdateUserPassword = {
                currentPassword: data.currentPassword || '',
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword
            };

            await updateUserPassword(user.id, payload);
            
            notifySuccess('Contraseña actualizada exitosamente');
            reset();
            onClose();
            onSuccess?.();
        } catch (error) {
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
        if (isLoading) return;
        reset();
        onClose();
    };

    if (!user) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={isOwnPassword ? "Cambiar mi contraseña" : `Resetear contraseña - ${user.firstName} ${user.lastName}`}
            size="md"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {!isOwnPassword && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800">
                                    Reseteo de contraseña administrativo
                                </h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                    <p>Estás reseteando la contraseña de otro usuario. Solo se requiere ingresar la nueva contraseña.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="space-y-4">
                    {/* Campo oculto de username para accesibilidad y gestores de contraseñas */}
                    <input
                        type="hidden"
                        name="username"
                        value={user?.email || ''}
                        autoComplete="username"
                    />
                    
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
                                        placeholder="Ingrese la contraseña actual"
                                        error={errors.currentPassword?.message}
                                        disabled={isLoading}
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    >
                                        {showCurrentPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            )}
                        />
                    )}

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
                                >
                                    {showNewPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        )}
                    />

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
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        )}
                    />

                    {/* Información de requisitos de contraseña */}
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-2">Requisitos de la contraseña:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Mínimo 8 caracteres</li>
                                <li>Al menos una letra minúscula</li>
                                <li>Al menos una letra mayúscula</li>
                                <li>Al menos un número</li>
                            </ul>
                        </div>
                    </div>
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

export default ChangePasswordModal;

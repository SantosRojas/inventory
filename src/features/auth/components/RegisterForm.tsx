import React, {useEffect} from 'react';
import { FormProvider } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useRegisterForm } from '../hooks/useRegisterForm';
import { StatusMessages } from './StatusMessages';
import { Button } from '../../../components';
import {RegisterInput} from "./index";

const RegisterForm: React.FC = () => {
    const {
        form,
        onSubmit,
        handlePhoneInput,
        submitError,
        submitSuccess,
        isLoading,
        clearMessages,
    } = useRegisterForm();

    useEffect(() => {
        console.log(form.formState.isValid)
    },[form.formState])

    return (
        <div className="space-y-6">
            <StatusMessages
                error={submitError}
                success={submitSuccess}
                onClearMessages={clearMessages}
            />

            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Campo oculto de username para accesibilidad */}
                    <input
                        type="text"
                        name="username"
                        autoComplete="username"
                        style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
                        tabIndex={-1}
                        aria-hidden="true"
                    />
                    
                    {/* Nombres */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <RegisterInput
                            name="firstName"
                            label="Nombre"
                            placeholder="Ingresa tu nombre"
                            autocomplete="given-name"
                            required
                        />

                        <RegisterInput
                            name="lastName"
                            label="Apellido"
                            placeholder="Ingresa tu apellido"
                            autocomplete="family-name"
                            required
                        />
                    </div>

                    {/* Contacto */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <RegisterInput
                            name="cellPhone"
                            label="Teléfono Celular"
                            type="tel"
                            placeholder="Ej: 987654321"
                            autocomplete="tel"
                            required
                            onChange={handlePhoneInput}
                        />

                        <RegisterInput
                            name="email"
                            label="Correo electrónico"
                            type="email"
                            placeholder="correo@ejemplo.com"
                            autocomplete="email"
                            required
                        />
                    </div>

                    {/* Contraseñas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <RegisterInput
                            name="password"
                            label="Contraseña"
                            type="password"
                            placeholder="Mínimo 6 caracteres"
                            autocomplete="new-password"
                            required
                        />

                        <RegisterInput
                            name="confirmPassword"
                            label="Confirmar contraseña"
                            type="password"
                            placeholder="Repite la contraseña"
                            autocomplete="new-password"
                            required
                        />
                    </div>

                    {/* Nota sobre el registro */}
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                        <p className="text-sm text-blue-700">
                            <strong>Nota:</strong> Tu cuenta será creada automáticamente con permisos de invitado.
                            Un administrador puede cambiar tu rol después del registro si es necesario.
                        </p>
                    </div>

                    {/* Checkbox de términos y condiciones */}
                    <div className="space-y-2">
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="acceptTerms"
                                    type="checkbox"
                                    {...form.register('acceptTerms')}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="acceptTerms" className="text-gray-700">
                                    Acepto los{' '}
                                    <Link
                                        to="/terminos"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-700 underline"
                                    >
                                        términos y condiciones
                                    </Link>
                                    {' '}del sistema
                                </label>
                            </div>
                        </div>
                        {form.formState.errors.acceptTerms && (
                                <p className="text-sm text-red-600">
                                    {form.formState.errors.acceptTerms.message}
                                </p>
                        )}
                    </div>

                    {/* Botón de envío */}
                    <Button
                        type="submit"
                        variant="primary"
                        icon={UserPlus}
                        disabled={isLoading || !form.formState.isValid}
                        className="w-full"
                    >
                        {isLoading ? 'Registrando...' : 'Registrar Usuario'}
                    </Button>
                </form>
            </FormProvider>
        </div>
    );
};

export default RegisterForm;
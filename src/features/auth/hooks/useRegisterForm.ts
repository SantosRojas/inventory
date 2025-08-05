import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {useAuth} from "./useAuth.ts";
import {useAuthStore} from "../store/store.ts";
import {registerUser} from "../services/api.ts";
import {type RegisterInput, registerSchema} from "../schemas";

export const useRegisterForm = () => {
    const { isLoading } = useAuth();
    const login = useAuthStore((state) => state.login)
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');

    const form = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            cellPhone: '',
            email: '',
            password: '',
            confirmPassword: '',
            acceptTerms: false,
        },
        mode: 'onChange', // Validar en tiempo real
    });

    const onSubmit = async (data: RegisterInput) => {
        setSubmitError('');
        setSubmitSuccess('');
        console.log(data);

        try {
            const registerData = {
                firstName: data.firstName,      // Mapear first_name -> firstName
                lastName: data.lastName,        // Mapear last_name -> lastName
                cellPhone: data.cellPhone,       // Mapear cellphone -> cellPhone
                email: data.email,
                password: data.password,
                // role: se omite porque el backend lo asigna automáticamente
            };

            const result = await registerUser(registerData);
            login(result.user,result.token)

        } catch (error) {
            console.error('Error during registration:', error);
            setSubmitError(error instanceof Error ? error.message : 'Error inesperado al registrar usuario');
        }
    };

    const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Permitir solo números y limitar a 9 dígitos
        const value = e.target.value.replace(/\D/g, '').slice(0, 9);
        form.setValue('cellPhone', value, { shouldValidate: true });
    };

    const clearMessages = () => {
        setSubmitError('');
        setSubmitSuccess('');
    };

    return {
        form,
        onSubmit,
        handlePhoneInput,
        submitError,
        submitSuccess,
        isLoading,
        clearMessages,
    };
};

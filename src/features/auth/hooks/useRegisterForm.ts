import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {useAuth} from "./useAuth.ts";
import {useAuthStore} from "../store/store.ts";
import {type RegisterInput, registerSchema} from "../schemas";

export const useRegisterForm = () => {
    const { isLoading } = useAuth();
    const register = useAuthStore((state) => state.register);
    const error = useAuthStore((state) => state.error)

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

        const registerData = {
                firstName: data.firstName,      // Mapear first_name -> firstName
                lastName: data.lastName,        // Mapear last_name -> lastName
                cellPhone: data.cellPhone,       // Mapear cellphone -> cellPhone
                email: data.email,
                password: data.password,
                // role: se omite porque el backend lo asigna automáticamente
            };

            await register(registerData);
    };

    const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Permitir solo números y limitar a 9 dígitos
        const value = e.target.value.replace(/\D/g, '').slice(0, 9);
        form.setValue('cellPhone', value, { shouldValidate: true });
    };


    return {
        form,
        onSubmit,
        handlePhoneInput,
        error,
        isLoading,
    };
};

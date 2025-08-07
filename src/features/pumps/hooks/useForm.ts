import { useState, useCallback } from 'react';

// Hook genérico para manejar formularios
export const useFormState = <T extends Record<string, any>>(initialData: T) => {
    const [formData, setFormData] = useState<T>(initialData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateField = useCallback((field: keyof T, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Limpiar error del campo al actualizar
        if (errors[field as string]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field as string];
                return newErrors;
            });
        }
    }, [errors]);

    const updateMultipleFields = useCallback((updates: Partial<T>) => {
        setFormData(prev => ({
            ...prev,
            ...updates
        }));

        // Limpiar errores de los campos actualizados
        const fieldsToUpdate = Object.keys(updates);
        setErrors(prev => {
            const newErrors = { ...prev };
            fieldsToUpdate.forEach(field => {
                delete newErrors[field];
            });
            return newErrors;
        });
    }, []);

    const setFieldError = useCallback((field: string, error: string) => {
        setErrors(prev => ({
            ...prev,
            [field]: error
        }));
    }, []);

    const setMultipleErrors = useCallback((newErrors: Record<string, string>) => {
        setErrors(newErrors);
    }, []);

    const clearErrors = useCallback(() => {
        setErrors({});
    }, []);

    const resetForm = useCallback((newData?: T) => {
        setFormData(newData || initialData);
        setErrors({});
        setIsSubmitting(false);
    }, [initialData]);

    const hasErrors = Object.keys(errors).length > 0;

    return {
        formData,
        errors,
        isSubmitting,
        hasErrors,
        setFormData,
        setErrors,
        setIsSubmitting,
        updateField,
        updateMultipleFields,
        setFieldError,
        setMultipleErrors,
        clearErrors,
        resetForm
    };
};

// Hook para validar formularios con esquemas de Zod
export const useFormValidation = <T>(
    schema: any,
    onSuccess?: (data: T) => void | Promise<void>,
    onError?: (errors: Record<string, string>) => void
) => {
    const [isValidating, setIsValidating] = useState(false);

    const validate = useCallback(async (data: any): Promise<{ success: boolean; errors?: Record<string, string>; validData?: T }> => {
        setIsValidating(true);
        
        try {
            const validData = schema.parse(data) as T;
            
            if (onSuccess) {
                await onSuccess(validData);
            }
            
            setIsValidating(false);
            return { success: true, validData };
        } catch (error: any) {
            const formattedErrors: Record<string, string> = {};
            
            if (error.errors) {
                error.errors.forEach((err: any) => {
                    const path = err.path.join('.');
                    formattedErrors[path] = err.message;
                });
            }
            
            onError?.(formattedErrors);
            setIsValidating(false);
            return { success: false, errors: formattedErrors };
        }
    }, [schema, onSuccess, onError]);

    return {
        validate,
        isValidating
    };
};

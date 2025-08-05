import React from 'react';
import { useFormContext } from 'react-hook-form';
import {Input} from "../../../components";

interface RegisterInputProps {
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    autocomplete?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RegisterInput: React.FC<RegisterInputProps> =
    ({name, label, type = 'text', placeholder, required = false, disabled = false,autocomplete = "off", onChange,}) => {
    const {
        register,
        formState: { errors },
        watch,
    } = useFormContext();

    const value = watch(name);
    const error = errors[name]?.message as string | undefined;

    return (
        <div className="space-y-1">
            <Input
                label={label}
                type={type}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                autoComplete = {autocomplete}
                value={value || ''}
                error={error}
                {...register(name, {
                    onChange: onChange,
                })}
            />
        </div>
    );
};

export default RegisterInput;
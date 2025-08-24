import React, { useMemo } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Input: React.FC<InputProps> = ({
                                         label,
                                         error,
                                         helperText,
                                         className = '',
                                         id,
                                         ...props
                                     }) => {
    const inputId = useMemo(() =>
        id || `input-${Math.random().toString(36).slice(2, 11)}`,
        [id]
    );

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium mb-1"
                    style={{ color: 'var(--color-text-primary)' }}
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`w-full px-3 py-2 border rounded-md shadow-sm transition-all duration-200
                    focus:outline-none focus:ring-2 ${className}`}
                style={{
                    backgroundColor: 'var(--color-bg-primary)',
                    borderColor: error ? 'var(--color-error)' : 'var(--color-border)',
                    color: 'var(--color-text-primary)',
                }}
                onFocus={(e) => {
                    e.target.style.borderColor = error ? 'var(--color-error)' : 'var(--color-primary)';
                    e.target.style.boxShadow = error 
                        ? '0 0 0 3px rgba(239, 68, 68, 0.1)' 
                        : '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = error ? 'var(--color-error)' : 'var(--color-border)';
                    e.target.style.boxShadow = 'none';
                }}
                {...props}
                value={props.value ?? ''} // 🔒 Aquí garantizas que nunca sea undefined/null
            />
            {error && (
                <p className="mt-1 text-sm" style={{ color: 'var(--color-error)' }}>{error}</p>
            )}
            {helperText && !error && (
                <p className="mt-1 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>{helperText}</p>
            )}
        </div>
    );
};

export default Input;

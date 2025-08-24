import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'bs';
  icon?: LucideIcon;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
                                         children,
                                         variant = 'primary',
                                         size = 'md',
                                         icon: Icon,
                                         isLoading = false,
                                         className = '',
                                         disabled,
                                         ...props
                                       }) => {
  const baseClasses =
      'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'text-white focus:ring-2 focus:ring-offset-2 transition-all duration-200',
    secondary: 'focus:ring-2 focus:ring-offset-2 transition-all duration-200',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 focus:ring-2 focus:ring-offset-2 transition-all duration-200',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 focus:ring-2 focus:ring-offset-2 transition-all duration-200',
    outline: 'border-2 focus:ring-2 focus:ring-offset-2 transition-all duration-200',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    bs: 'px-4 py-2.5 text-sm',//usado solo para los botones de agregar y escanear
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      style={{
        backgroundColor: variant === 'primary' 
          ? 'var(--color-primary)' 
          : variant === 'secondary' 
          ? 'var(--color-bg-tertiary)' 
          : variant === 'outline'
          ? 'transparent'
          : undefined,
        color: variant === 'primary' 
          ? 'var(--color-text-inverse)' 
          : variant === 'secondary' 
          ? 'var(--color-text-primary)'
          : variant === 'outline'
          ? 'var(--color-primary)'
          : undefined,
        borderColor: variant === 'outline' ? 'var(--color-primary)' : undefined,
      }}
      onMouseEnter={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
        } else if (variant === 'secondary') {
          e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
        } else if (variant === 'outline') {
          e.currentTarget.style.backgroundColor = 'var(--color-primary-light)';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.backgroundColor = 'var(--color-primary)';
        } else if (variant === 'secondary') {
          e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)';
        } else if (variant === 'outline') {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
      {...props}
    >
        {isLoading ? (
            <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
              <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
              ></circle>
              <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042
            1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
        ) : Icon ? (
            <Icon className="w-4 h-4 mr-2" />
        ) : null}
        {children}
      </button>
  );
};

export default Button;

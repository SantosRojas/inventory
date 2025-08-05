import React, { useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import {useAuth} from "../hooks";
import {RegisterForm} from "../components";

const RegisterPage: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();

    // Debug: ver el estado de autenticación
    useEffect(() => {
        if (isAuthenticated) {
            console.log('👤 Usuario autenticado, redirigiendo al dashboard...');
        }
    }, [isAuthenticated]);

    // Redireccionar si ya está autenticado
    if (isAuthenticated && !isLoading) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">
                    Registro de Usuario
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Crea una nueva cuenta para acceder al sistema de inventario
                </p>
            </div>

            {/* Formulario */}
            <div className="max-w-2xl mx-auto">
                <RegisterForm />
            </div>

            {/* Link a login */}
            <div className="text-center">
                <p className="text-sm text-gray-600">
                    ¿Ya tienes una cuenta?{' '}
                    <Link
                        to="/login"
                        className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                    >
                        Inicia sesión aquí
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;

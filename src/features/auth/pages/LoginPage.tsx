import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Button, Input } from '../../../components';
import { LogIn } from 'lucide-react';
import { useAuth } from "../hooks";
import { loginUser } from "../services/api";
import { useAuthStore } from "../store/store";

interface LoginFormData {
    email: string;
    password: string;
}

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading } = useAuth();
    const login = useAuthStore((state) => state.login);

    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    // 🔒 Redirigir si ya está autenticado
    if (isAuthenticated && !isLoading) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const { user, token } = await loginUser(formData);
            login(user, token);
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            setError(err instanceof Error ? err.message : 'Error inesperado al iniciar sesión');
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Iniciar Sesión</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Accede a tu cuenta para gestionar el inventario médico
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Correo Electrónico"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@hospital.com"
                    autoComplete="username"
                    required
                />

                <Input
                    label="Contraseña"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Ingrese su contraseña"
                    autoComplete="current-password"
                    required
                />

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    icon={LogIn}
                    isLoading={isLoading}
                    className="w-full"
                >
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
            </form>

            {/* Registro */}
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    ¿No tienes una cuenta?{' '}
                    <Link
                        to="/auth/register"
                        className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                    >
                        Regístrate aquí
                    </Link>
                </p>
            </div>

            {/* Credenciales de prueba */}
            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Credenciales de prueba</span>
                    </div>
                </div>

                <div className="mt-3 text-center">
                    <div className="text-xs text-gray-500 space-y-1">
                        <p><strong>Email:</strong> admin@hospital.com</p>
                        <p><strong>Contraseña:</strong> admin123</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

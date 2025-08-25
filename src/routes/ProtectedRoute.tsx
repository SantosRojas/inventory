import { Navigate } from 'react-router-dom';
import type {ReactNode} from "react";
import {useAuth} from "../features/auth/hooks";

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: string[];
}

const ProtectedRoute = ({
                            children,
                            requiredRole
                        }: ProtectedRouteProps) => {
    const { isAuthenticated, user, isLoading } = useAuth();
    console.log(isAuthenticated);
    console.log(isLoading)

    // Solo loading del proceso de autenticación inicial
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Redirección si no está autenticado
    if (!isAuthenticated) {
        console.log('🚪 ProtectedRoute: Redirigiendo a login');
        return <Navigate to="/auth/login" replace />;
    }

    // Verificación de roles si se especifica
    if (requiredRole && user) {
        // El usuario root tiene acceso a todas las páginas
        const hasAccess = user.role === 'root' || requiredRole.includes(user.role);
        
        if (!hasAccess) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Acceso Denegado
                        </h2>
                        <p className="text-gray-600">
                            No tienes permisos para acceder a esta página.
                        </p>
                    </div>
                </div>
            );
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;



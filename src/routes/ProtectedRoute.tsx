import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../features/auth/hooks';
import AccessDeniedPage from '../layouts/components/AccessDeniedPage';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string[];
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Si hay roles requeridos, verificar que el usuario tenga uno válido
  if (requiredRole && user && !requiredRole.includes(user.role) && user.role !== 'root') {
    return <AccessDeniedPage />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

// Componente para páginas en desarrollo
import  { lazy, Suspense } from 'react'; // Importa lazy y Suspense de React
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importaciones de layouts (asumiendo que no necesitan lazy load si son pequeños y siempre se usan)
import { MainLayout, AuthLayout } from '../layouts';

// Importaciones de componentes de páginas, usando lazy para optimización
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage'));
const DashboardPage = lazy(() => import('../features/dashboard/pages/DashboardPage')); // Asegúrate de la ruta correcta si es necesario
const TermsPage = lazy(() => import('../pages/TermsPage')); // Sin .tsx en la importación aquí
const AboutPage = lazy(() => import('../pages/AboutPage')); // Sin .tsx en la importación aquí
const LoadingPage = lazy(() => import('../pages/LoadingPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Importación del componente de ruta protegida
import ProtectedRoute from './ProtectedRoute';
import {PumpsPage} from "../features/pumps/pages";


// Componente para mostrar páginas en desarrollo
const DevelopmentPage = ({ title }: { title: string }) => (
    <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600">Sección en desarrollo...</p>
    </div>
);

const AppRoutes = () => {
    console.log('AppRoutes');
    return (
        <Router>
            {/* Suspense es necesario para envolver las rutas que usan componentes cargados con lazy */}
            <Suspense fallback={<LoadingPage />}>
                <Routes>
                    {/* Rutas de autenticación */}
                    <Route path="/auth" element={<AuthLayout />}>
                        {/* Redirección predeterminada para /auth a /auth/login */}
                        <Route index element={<Navigate to="login" replace />} />
                        <Route path="login" element={<LoginPage />} />
                        <Route path="register" element={<RegisterPage />} />
                    </Route>

                    {/* Rutas públicas (no requieren autenticación) */}
                    <Route path="/terminos" element={<TermsPage />} />
                    <Route path="/acerca-de" element={<AboutPage />} />

                    {/* Rutas protegidas con layout principal */}
                    <Route path="/" element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }>
                        {/* Redirección de la raíz (/) a /dashboard para usuarios autenticados */}
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="bombas" element={<PumpsPage />} />
                        <Route path="modelos" element={<DevelopmentPage title="Gestión de Modelos" />} />
                        <Route path="instituciones" element={<DevelopmentPage title="Gestión de Instituciones" />} />
                        <Route path="servicios" element={<DevelopmentPage title="Gestión de Servicios" />} />
                        <Route path="reportes" element={<DevelopmentPage title="Reportes" />} />
                        <Route path="configuracion" element={<DevelopmentPage title="Configuración" />} />
                        {/* Ejemplo de redirección legacy */}
                        <Route path="equipos" element={<Navigate to="/bombas" replace />} />
                    </Route>

                    {/* Ruta 404 para cualquier otra ruta no definida */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Suspense>
        </Router>
    );
};

export default AppRoutes;
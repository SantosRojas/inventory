// Componente para páginas en desarrollo
import  { lazy, Suspense } from 'react'; // Importa lazy y Suspense de React
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importaciones de layouts y componentes
import { MainLayout, AuthLayout } from '../layouts';
import { PageLoader } from '../components';
import ProtectedRoute from './ProtectedRoute';

// Importaciones de componentes de páginas, usando lazy para optimización
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage'));
const DashboardPage = lazy(() => import('../features/dashboard/pages/DashboardPage'));
const TermsPage = lazy(() => import('../pages/TermsPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Páginas principales con lazy loading
const InventoryPage = lazy(() => import('../features/pumps/pages/PumpsPage'));
const InstitutionsPage = lazy(() => import('../features/institutions/pages/InstitutionsPage'));
const ServicesPage = lazy(() => import('../features/services/pages/ServicesPage'));
const UsersPage = lazy(() => import('../features/users/pages/UsersPage'));
const ModelsPage = lazy(() => import('../features/models/pages/ModelsPage'));
const ReportsPage = lazy(() => import('../features/reports/pages/ReportsPage'));


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
            <Suspense fallback={<PageLoader />}>
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
                        {/* Redirección de la raíz (/) a /inventario para usuarios autenticados */}
                        <Route index element={<Navigate to="/inventario" replace />} />
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="inventario" element={<InventoryPage />} />
                        <Route path="modelos" element={
                            <ProtectedRoute requiredRole={['admin', 'root']}>
                                <ModelsPage />
                            </ProtectedRoute>
                        } />
                        <Route path="instituciones" element={
                            <ProtectedRoute requiredRole={['admin', 'root']}>
                                <InstitutionsPage />
                            </ProtectedRoute>
                        } />
                        <Route path="servicios" element={
                            <ProtectedRoute requiredRole={['admin', 'root']}>
                                <ServicesPage />
                            </ProtectedRoute>
                        } />
                        <Route path="usuarios" element={<UsersPage />} />
                        <Route path="reportes" element={<ReportsPage />} />
                        <Route path="configuracion" element={<DevelopmentPage title="Configuración" />} />
                        {/* Redirecciones legacy */}
                        <Route path="equipos" element={<Navigate to="/inventario" replace />} />
                    </Route>

                    {/* Ruta 404 para cualquier otra ruta no definida */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Suspense>
        </Router>
    );
};

export default AppRoutes;
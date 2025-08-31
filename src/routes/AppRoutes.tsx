import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout, AuthLayout } from '../layouts';
import { PageLoader } from '../components';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../features/auth/hooks';

// Lazy-loaded pages
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage'));
const DashboardPage = lazy(() => import('../features/dashboard/pages/DashboardPage'));
const TermsPage = lazy(() => import('../pages/TermsPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const InventoryPage = lazy(() => import('../features/pumps/pages/PumpsPage'));
const InstitutionsPage = lazy(() => import('../features/institutions/pages/InstitutionsPage'));
const ServicesPage = lazy(() => import('../features/services/pages/ServicesPage'));
const UsersPage = lazy(() => import('../features/users/pages/UsersPage'));
const ModelsPage = lazy(() => import('../features/models/pages/ModelsPage'));
const ReportsPage = lazy(() => import('../features/reports/pages/ReportsPage'));

const DevelopmentPage = ({ title }: { title: string }) => (
  <div className="text-center py-12">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
    <p className="text-gray-600">Sección en desarrollo...</p>
  </div>
);

const RoleRedirect = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />; // o cualquier loader que uses
  }

  if(!user){
  return <Navigate to='/auth/login' replace />;
  
  }

  const isGuest = user.role === 'guest';
  return <Navigate to={isGuest ? '/usuarios' : '/inventario'} replace />;
};



const protectedRoutes = [
  {
    path: 'dashboard',
    element: <DashboardPage />,
    roles: ['admin', 'root', 'technician','sales_representative'],
  },
  {
    path: 'inventario',
    element: <InventoryPage />,
    roles: ['admin', 'root', 'technician','sales_representative'],
  },
  {
    path: 'modelos',
    element: <ModelsPage />,
    roles: ['admin', 'root'],
  },
  {
    path: 'instituciones',
    element: <InstitutionsPage />,
    roles: ['admin', 'root'],
  },
  {
    path: 'servicios',
    element: <ServicesPage />,
    roles: ['admin', 'root'],
  },
  {
    path: 'usuarios',
    element: <UsersPage />,
    roles: ['admin', 'root', 'technician','sales_representative', 'guest'],
  },
  {
    path: 'reportes',
    element: <ReportsPage />,
    roles: ['admin', 'root','technician','sales_representative'],
  },
  {
    path: 'configuracion',
    element: <DevelopmentPage title="Configuración" />,
    roles: ['admin', 'root'],
  },
];

const AppRoutes = () => {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Rutas de autenticación */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route index element={<Navigate to="login" replace />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>

          {/* Rutas públicas */}
          <Route path="/terminos" element={<TermsPage />} />
          <Route path="/acerca-de" element={<AboutPage />} />
          <Route index element={<RoleRedirect />} />

          {/* Rutas protegidas */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {protectedRoutes.map(({ path, element, roles }) => (
              <Route
                key={path}
                path={path}
                element={
                  <ProtectedRoute requiredRoles={roles}>
                    {element}
                  </ProtectedRoute>
                }
              />
            ))}
          </Route>

          {/* Ruta 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;

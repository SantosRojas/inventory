import { useState, useMemo } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button, NotificationContainer } from '../components';
import { 
  Menu, 
  X, 
  Activity, 
  Users, 
  Settings, 
  LogOut, 
  Home,
  Package,
  BarChart3,
  Search,
  Building,
  Stethoscope,
  Monitor
} from 'lucide-react';
import {useAuth} from "../features/auth/hooks";
import {useAuthStore} from "../features/auth/store/store.ts";

const MainLayout = () => {
  const { user} = useAuth();
  const logout = useAuthStore((state) => state.logout)
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = useMemo(() => [
    { name: 'Dashboard', href: '/dashboard', icon: Home, current: location.pathname === '/dashboard' },
    { name: 'Bombas', href: '/bombas', icon: Package, current: location.pathname.startsWith('/bombas') },
    { name: 'Usuarios', href: '/usuarios', icon: Users, current: location.pathname.startsWith('/usuarios') },
    { name: 'Modelos', href: '/modelos', icon: Monitor, current: location.pathname.startsWith('/modelos') },
    { name: 'Instituciones', href: '/instituciones', icon: Building, current: location.pathname.startsWith('/instituciones') },
    { name: 'Servicios', href: '/servicios', icon: Stethoscope, current: location.pathname.startsWith('/servicios') },
    { name: 'Reportes', href: '/reportes', icon: BarChart3, current: location.pathname.startsWith('/reportes') },
    { name: 'Configuración', href: '/configuracion', icon: Settings, current: location.pathname.startsWith('/configuracion') },
  ], [location.pathname]);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar para móvil */}
      <div className={`fixed inset-0 flex z-50 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-800">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-shrink-0 flex items-center px-4">
            <Activity className="h-8 w-8 text-white" />
            <span className="ml-2 text-white font-bold text-lg">InventarioMed</span>
          </div>
          <div className="mt-5 flex-1 h-0 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    item.current
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-4 h-6 w-6" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Sidebar para escritorio */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-56">
          <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
            <div className="flex items-center h-16 flex-shrink-0 px-3 bg-gray-900">
              <Activity className="h-7 w-7 text-white" />
              <span className="ml-2 text-white font-bold text-base">InventarioMed</span>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      item.current
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200`}
                  >
                    <item.icon className="mr-2 h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Header superior */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow border-b border-gray-200">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between items-center">
            {/* Barra de búsqueda */}
            <div className="flex-1 flex max-w-xs lg:max-w-md">
              <div className="hidden sm:block w-full">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <Search className="h-5 w-5" />
                  </div>
                  <input
                    id="main-search"
                    name="search"
                    className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent text-sm"
                    placeholder="Buscar..."
                    type="search"
                  />
                </div>
              </div>
            </div>
            
            {/* Panel derecho */}
            <div className="ml-4 flex items-center space-x-2 sm:space-x-4">
              <button className="sm:hidden bg-white p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <Search className="h-5 w-5" />
              </button>

              <div className="relative">
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {user?.firstName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    <div className="text-sm font-medium text-gray-700 truncate max-w-32">{user?.firstName}</div>
                    <div className="text-xs text-gray-500">Usuario</div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={LogOut}
                    onClick={handleLogout}
                    className="ml-2"
                  >
                    <span className="hidden lg:inline">Salir</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido del outlet */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-4 lg:py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
      
      {/* Contenedor de notificaciones */}
      <NotificationContainer />
    </div>
  );
};

export default MainLayout;

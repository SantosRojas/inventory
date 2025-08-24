import { useState } from 'react';
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
  Monitor,
} from 'lucide-react';
import { useAuth } from '../features/auth/hooks';
import { useAuthStore } from '../features/auth/store/store';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Inventario', href: '/inventario', icon: Package },
  { name: 'Usuarios', href: '/usuarios', icon: Users },
  { name: 'Modelos', href: '/modelos', icon: Monitor },
  { name: 'Instituciones', href: '/instituciones', icon: Building },
  { name: 'Servicios', href: '/servicios', icon: Stethoscope },
  { name: 'Reportes', href: '/reportes', icon: BarChart3 },
  { name: 'Configuración', href: '/configuracion', icon: Settings },
];

const Sidebar = ({
  isMobile,
  open,
  collapsed,
  onClose,
  onToggleCollapse,
  navItems,
}: {
  isMobile: boolean;
  open: boolean;
  collapsed: boolean;
  onClose?: () => void;
  onToggleCollapse?: () => void;
  navItems: typeof NAV_ITEMS;
}) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div
      className={`bg-gray-800 h-full flex flex-col transition-all duration-200 ease-in-out
        ${isMobile
          ? `fixed top-0 left-0 z-40 w-64 transform ${open ? 'translate-x-0' : '-translate-x-full'} shadow-lg`
          : collapsed
          ? 'w-16'
          : 'w-56'}`
      }
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 bg-gray-900">
        <div className="flex items-center space-x-2 text-white">
          <Activity className="h-6 w-6" />
          {!collapsed && <span className="font-semibold text-base">InventarioMed</span>}
        </div>
        {!isMobile && (
          <button
            onClick={onToggleCollapse}
            className="text-gray-400 hover:text-white"
          >
            {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </button>
        )}
        {isMobile && (
          <button
            onClick={onClose}
            className="text-white"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            onClick={isMobile ? onClose : undefined}
            className={`flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive(item.href)
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <item.icon className="h-5 w-5" />
            {!collapsed && <span className="ml-3 truncate">{item.name}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

const MainLayout = () => {
  const { user } = useAuth();
  const logout = useAuthStore((state) => state.logout);
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Filtrar elementos de navegación según el rol del usuario
  const getFilteredNavItems = () => {
    const isAdmin = user?.role === 'admin';
    
    if (isAdmin) {
      return NAV_ITEMS;
    }
    
    // Para usuarios no admin, cambiar "Usuarios" por "Mi Perfil" y excluir páginas de admin
    return NAV_ITEMS
      .filter(item => !['Modelos', 'Instituciones', 'Servicios'].includes(item.name))
      .map(item => 
        item.name === 'Usuarios' 
          ? { ...item, name: 'Mi Perfil' }
          : item
      );
  };

  const filteredNavItems = getFilteredNavItems();

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 relative">
      {/* Overlay para mobile */}
      {sidebarOpenMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpenMobile(false)}
        />
      )}

      {/* Sidebar Mobile */}
      <Sidebar
        isMobile
        open={sidebarOpenMobile}
        collapsed={false}
        onClose={() => setSidebarOpenMobile(false)}
        navItems={filteredNavItems}
      />

      {/* Sidebar Desktop */}
      <div className="hidden lg:block fixed left-0 top-0 h-full z-20">
        <Sidebar
          isMobile={false}
          open
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          navItems={filteredNavItems}
        />
      </div>

      {/* Main Content - con margen dinámico basado en el estado del sidebar */}
      <div className={`flex-1 flex flex-col transition-all duration-200 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-56'
      }`}>
        {/* Header */}
        <header className="flex items-center justify-between h-16 bg-white shadow px-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button
              className="lg:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpenMobile(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="relative w-64 hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                placeholder="Buscar..."
                className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {user?.firstName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="hidden lg:block text-sm">
              <div className="font-medium text-gray-700">{user?.firstName}</div>
              <div className="text-xs text-gray-500">{user?.role}</div>
            </div>
            <Button variant="secondary" size="sm" icon={LogOut} onClick={logout}>
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="w-[98%] mx-auto px-2 py-3">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Notificaciones */}
      <NotificationContainer />
    </div>
  );
};

export default MainLayout;

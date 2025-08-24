import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button, NotificationContainer, ThemeSelector } from '../components';
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
      className={`flex flex-col transition-all duration-200 ease-in-out glass-effect
        ${isMobile
          ? `fixed top-0 left-0 z-40 w-64 h-screen transform ${open ? 'translate-x-0' : '-translate-x-full'} shadow-xl`
          : collapsed
          ? 'w-16'
          : 'w-56'} ${!isMobile ? 'rounded-2xl mt-2 mb-2 ml-2 h-[calc(100vh-1rem)]' : ''}`
      }
      style={{ 
        background: !isMobile 
          ? 'linear-gradient(145deg, var(--color-bg-card) 0%, var(--color-bg-secondary) 100%)'
          : 'var(--color-bg-card)',
        boxShadow: !isMobile ? 'var(--shadow-lg)' : 'var(--shadow-xl)',
        border: !isMobile ? '1px solid var(--color-border)' : 'none'
      }}
    >
      {/* Header */}
      <div className={`flex items-center ${collapsed ? 'justify-center relative' : 'justify-between'} h-16 ${collapsed ? 'px-2' : 'px-4'} flex-shrink-0 ${!isMobile ? 'rounded-t-2xl' : ''}`}
           style={{ 
             backgroundColor: 'var(--color-bg-primary)',
             borderBottom: '1px solid var(--color-border)'
           }}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-2'}`} style={{ color: 'var(--color-text-primary)' }}>
          <div className="p-1.5 rounded-lg" style={{ backgroundColor: 'var(--color-primary)' }}>
            <Activity className="h-5 w-5" style={{ color: 'var(--color-text-inverse)' }} />
          </div>
          {!collapsed && <span className="font-semibold text-base">InventarioApp</span>}
        </div>
        {!isMobile && (
          <button
            onClick={onToggleCollapse}
            className={`p-1.5 rounded-lg hover:opacity-75 transition-all duration-200 ${collapsed ? 'absolute top-2 right-2' : ''}`}
            style={{ 
              color: 'var(--color-text-secondary)',
              backgroundColor: 'var(--color-bg-secondary)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
              e.currentTarget.style.color = 'var(--color-text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
            title={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          >
            <Activity className="h-4 w-4" />
          </button>
        )}
        {isMobile && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:opacity-75 transition-opacity"
            style={{ 
              color: 'var(--color-text-secondary)',
              backgroundColor: 'var(--color-bg-secondary)'
            }}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navegación */}
      <nav className={`flex-1 overflow-y-auto px-3 py-4 space-y-2 ${!isMobile ? 'pb-6 rounded-b-2xl' : ''}`}>
        {/* Sección principal */}
        <div className="space-y-2">
          {navItems.slice(0, 2).map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={isMobile ? onClose : undefined}
              className={`nav-item-hover flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group ${
                isActive(item.href)
                  ? 'shadow-md transform scale-[1.02]'
                  : 'hover:shadow-sm hover:transform hover:scale-[1.01]'
              }`}
              style={{
                backgroundColor: isActive(item.href) ? 'var(--color-primary)' : 'transparent',
                color: isActive(item.href) ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.href)) {
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
                  e.currentTarget.style.color = 'var(--color-text-primary)';
                  e.currentTarget.style.transform = 'translateX(4px) scale(1.01)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.href)) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                  e.currentTarget.style.transform = 'translateX(0) scale(1)';
                }
              }}
            >
              <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                isActive(item.href) ? '' : 'group-hover:bg-white group-hover:bg-opacity-10'
              }`}
              style={{
                backgroundColor: isActive(item.href) ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
              }}>
                <item.icon className="h-4 w-4" />
              </div>
              {!collapsed && (
                <span className="ml-3 truncate font-medium">
                  {item.name}
                </span>
              )}
              {!collapsed && isActive(item.href) && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full"
                     style={{ backgroundColor: 'var(--color-text-inverse)' }} />
              )}
            </Link>
          ))}
        </div>

        {/* Separador */}
        {!collapsed && navItems.length > 2 && (
          <div className="px-3 py-2">
            <div className="h-px" style={{ backgroundColor: 'var(--color-border)' }} />
          </div>
        )}

        {/* Sección de gestión */}
        <div className="space-y-2">
          {navItems.slice(2).map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={isMobile ? onClose : undefined}
              className={`nav-item-hover flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group ${
                isActive(item.href)
                  ? 'shadow-md transform scale-[1.02]'
                  : 'hover:shadow-sm hover:transform hover:scale-[1.01]'
              }`}
              style={{
                backgroundColor: isActive(item.href) ? 'var(--color-primary)' : 'transparent',
                color: isActive(item.href) ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.href)) {
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
                  e.currentTarget.style.color = 'var(--color-text-primary)';
                  e.currentTarget.style.transform = 'translateX(4px) scale(1.01)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.href)) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                  e.currentTarget.style.transform = 'translateX(0) scale(1)';
                }
              }}
            >
              <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                isActive(item.href) ? '' : 'group-hover:bg-white group-hover:bg-opacity-10'
              }`}
              style={{
                backgroundColor: isActive(item.href) ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
              }}>
                <item.icon className="h-4 w-4" />
              </div>
              {!collapsed && (
                <span className="ml-3 truncate font-medium">
                  {item.name}
                </span>
              )}
              {!collapsed && isActive(item.href) && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full"
                     style={{ backgroundColor: 'var(--color-text-inverse)' }} />
              )}
            </Link>
          ))}
        </div>
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
    <div className="h-screen flex overflow-hidden relative" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
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
      <div className="hidden lg:block fixed left-0 top-0 h-screen z-20">
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
        sidebarCollapsed ? 'lg:ml-[4.5rem]' : 'lg:ml-[15rem]'
      }`}>
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-4 shadow border transition-all m-2 mt-2 mb-0 rounded-t-2xl"
                style={{ 
                  backgroundColor: 'var(--color-bg-card)', 
                  borderColor: 'var(--color-border)',
                  boxShadow: 'var(--shadow-sm)'
                }}>
          <div className="flex items-center space-x-4">
            <button
              className="lg:hidden hover:opacity-75 transition-opacity"
              style={{ color: 'var(--color-text-secondary)' }}
              onClick={() => setSidebarOpenMobile(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="relative w-64 hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5" style={{ color: 'var(--color-text-muted)' }} />
              </div>
              <input
                type="search"
                placeholder="Buscar..."
                className="w-full pl-10 pr-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 transition-all border"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  color: 'var(--color-text-primary)',
                  borderColor: 'var(--color-border)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-primary)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeSelector />
            <div className="h-8 w-8 rounded-full flex items-center justify-center transition-colors"
                 style={{ backgroundColor: 'var(--color-primary)' }}>
              <span className="text-sm font-medium" style={{ color: 'var(--color-text-inverse)' }}>
                {user?.firstName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="hidden lg:block text-sm">
              <div className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{user?.firstName}</div>
              <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{user?.role}</div>
            </div>
            <Button variant="secondary" size="sm" icon={LogOut} onClick={logout}>
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto m-2 mt-0 rounded-b-2xl border border-t-0"
              style={{ 
                backgroundColor: 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border)',
                boxShadow: 'var(--shadow-sm)'
              }}>
          <div className="w-full px-2 py-2 sm:px-4 sm:py-4 h-full">
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

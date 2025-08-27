import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import {
  X,
  Activity,
  Users,
  Settings,
  Home,
  Package,
  BarChart3,
  Building,
  Stethoscope,
  Monitor,
} from 'lucide-react';
import type { User } from "../../features/users";

const NAV_ITEMS = [
  { name: 'Inventario', href: '/inventario', icon: Package },
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Usuarios', href: '/usuarios', icon: Users },
  { name: 'Modelos', href: '/modelos', icon: Monitor },
  { name: 'Instituciones', href: '/instituciones', icon: Building },
  { name: 'Servicios', href: '/servicios', icon: Stethoscope },
  { name: 'Reportes', href: '/reportes', icon: BarChart3 },
  { name: 'Configuración', href: '/configuracion', icon: Settings },
];

 // Filtrar elementos de navegación según el rol del usuario
  const getFilteredNavItems = (user: User) => {
    const isAdminOrRoot = user?.role === 'admin' || user?.role === 'root';

    if (isAdminOrRoot) {
      return NAV_ITEMS;
    }

    // Para usuarios no admin/root, cambiar "Usuarios" por "Mi Perfil" y excluir páginas de admin
    return NAV_ITEMS
      .filter(item => !['Modelos', 'Instituciones', 'Servicios'].includes(item.name))
      .map(item =>
        item.name === 'Usuarios'
          ? { ...item, name: 'Mi Perfil' }
          : item
      );
  };


interface SideBarProps {
  user: User | null;
  isMobile: boolean;
  open: boolean;
  collapsed: boolean;
  onClose?: () => void;
  onToggleCollapse?: () => void;
}

const SideBar = ({
  user,
  isMobile,
  open,
  collapsed,
  onClose,
  onToggleCollapse
}: SideBarProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);
  const navItems = getFilteredNavItems(user!);
  return (
    <aside
      role="navigation"
      className={clsx(
        "flex flex-col transition-all duration-200 ease-in-out glass-effect",
        isMobile
          ? [
              "fixed top-0 left-0 z-40 w-64 h-screen shadow-xl",
              open ? "translate-x-0" : "-translate-x-full",
            ]
          : [
              collapsed ? "w-16" : "w-56",
              "rounded-2xl mt-2 mb-2 ml-2 h-[calc(100vh-1rem)] shadow-lg border",
            ]
      )}
      style={{
        background: !isMobile
          ? "linear-gradient(145deg, var(--color-bg-card), var(--color-bg-secondary))"
          : "var(--color-bg-card)",
      }}
    >
      <SidebarHeader
        isMobile={isMobile}
        collapsed={collapsed}
        onClose={onClose}
        onToggleCollapse={onToggleCollapse}
      />

      <SidebarNav
        navItems={navItems}
        collapsed={collapsed}
        isMobile={isMobile}
        onClose={onClose}
        isActive={isActive}
      />
    </aside>
  );
};

/* ---------- Header ---------- */
const SidebarHeader = ({
  isMobile,
  collapsed,
  onClose,
  onToggleCollapse,
}: {
  isMobile: boolean;
  collapsed: boolean;
  onClose?: () => void;
  onToggleCollapse?: () => void;
}) => (
  <header
    className={clsx(
      "flex items-center h-16 flex-shrink-0 border-b",
      collapsed ? "justify-center px-2 relative" : "justify-between px-4",
      !isMobile && "rounded-t-2xl"
    )}
    style={{ backgroundColor: "var(--color-bg-primary)" }}
  >
    {!collapsed && (
      <span
        className="font-semibold text-base"
        style={{ color: "var(--color-text-primary)" }}
      >
        InventarioApp
      </span>
    )}

    {!isMobile ? (
      <button
        onClick={onToggleCollapse}
        className="p-1.5 rounded-lg transition hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
        title={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
      >
        <div className="p-1.5 rounded-lg bg-[var(--color-primary)]">
          <Activity className="h-5 w-5 text-[var(--color-text-inverse)]" />
        </div>
      </button>
    ) : (
      <button
        onClick={onClose}
        className="p-1.5 rounded-lg hover:opacity-75 transition"
        style={{
          color: "var(--color-text-secondary)",
          backgroundColor: "var(--color-bg-secondary)",
        }}
        aria-label="Cerrar menú lateral"
      >
        <X className="h-4 w-4" />
      </button>
    )}
  </header>
);

/* ---------- Nav ---------- */
const SidebarNav = ({
  navItems,
  collapsed,
  isMobile,
  onClose,
  isActive,
}: {
  navItems: typeof NAV_ITEMS;
  collapsed: boolean;
  isMobile: boolean;
  onClose?: () => void;
  isActive: (path: string) => boolean;
}) => (
  <nav
    className={clsx(
      "flex-1 overflow-y-auto px-3 py-4 space-y-4",
      !isMobile && "rounded-b-2xl pb-6"
    )}
  >
    {navItems.map((item) => (
      <SidebarItem
        key={item.name}
        item={item}
        collapsed={collapsed}
        isActive={isActive(item.href)}
        onClick={isMobile ? onClose : undefined}
      />
    ))}
  </nav>
);

/* ---------- Item ---------- */
const SidebarItem = ({
  item,
  collapsed,
  isActive,
  onClick,
}: {
  item: { name: string; href: string; icon: any };
  collapsed: boolean;
  isActive: boolean;
  onClick?: () => void;
}) => (
  <Link
    to={item.href}
    onClick={onClick}
    aria-current={isActive ? "page" : undefined}
    className={clsx(
      "flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group",
      isActive
        ? "bg-[var(--color-primary)] text-[var(--color-text-inverse)] shadow-md scale-[1.02]"
        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] hover:translate-x-1 hover:scale-[1.01]"
    )}
  >
    <div
      className={clsx(
        "p-1.5 rounded-lg transition-all",
        isActive
          ? "bg-white/20"
          : "group-hover:bg-white/10"
      )}
    >
      <item.icon className="h-4 w-4" />
    </div>
    {!collapsed && (
      <>
        <span className="ml-3 truncate">{item.name}</span>
        {isActive && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-text-inverse)]" />
        )}
      </>
    )}
  </Link>
);
SidebarItem.displayName = "SidebarItem";

export default SideBar;
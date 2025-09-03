import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Button, NotificationContainer, ThemeSelector } from "../components";
import { Menu, LogOut } from "lucide-react";
import { useAuth } from "../features/auth/hooks";
import { useAuthStore } from "../features/auth/store/store";
import SideBar from "./components/SideBar";

const MainLayout = () => {
  const { user } = useAuth();
  const logout = useAuthStore((state) => state.logout);

  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div
      className="h-screen flex overflow-hidden relative"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      {/* Overlay para mobile */}
      {sidebarOpenMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpenMobile(false)}
        />
      )}

      {/* Sidebar Mobile */}
      <SideBar
        user={user}
        isMobile
        open={sidebarOpenMobile}
        collapsed={false}
        onClose={() => setSidebarOpenMobile(false)}
      />

      {/* Layout principal (siempre visible) */}
      <div className="flex w-full">
        {/* Sidebar Desktop */}
        <div className="hidden lg:flex flex-shrink-0 z-20">
          <SideBar
            user={user}
            isMobile={false}
            open
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        {/* Contenido Principal */}
        <div className="flex-1 flex flex-col transition-all duration-200">
          {/* Header */}
          <header
            className="flex items-center justify-between h-16 px-4 shadow border transition-all m-2 mt-2 mb-0 rounded-t-2xl"
            style={{
              backgroundColor: "var(--color-bg-card)",
              borderColor: "var(--color-border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div className="flex items-center space-x-4">
              {/* Botón para abrir sidebar en móvil */}
              <button
                className="lg:hidden hover:opacity-75 transition-opacity"
                style={{ color: "var(--color-text-secondary)" }}
                onClick={() => setSidebarOpenMobile(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeSelector />
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text-inverse)" }}
                >
                  {user?.firstName?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden lg:block text-sm">
                <div
                  className="font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {user?.firstName}
                </div>
                <div
                  className="text-xs"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  {user?.role === "root"
                    ? "Root"
                    : user?.role === "admin"
                    ? "Administrador"
                    : user?.role === "supervisor"
                    ? "Supervisor"
                    : user?.role === "sales_representative"
                    ? "Representante de Ventas"
                    : user?.role === "technician"
                    ? "Técnico"
                    : user?.role === "guest"
                    ? "Invitado"
                    : user?.role}
                </div>
              </div>
              <Button variant="secondary" size="sm" icon={LogOut} onClick={logout}>
                <span className="hidden sm:inline">Salir</span>
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main
            className="flex-1 overflow-y-auto m-2 mt-0 rounded-b-2xl border border-t-0"
            style={{
              backgroundColor: "var(--color-bg-secondary)",
              borderColor: "var(--color-border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div className="w-full px-2 py-2 sm:px-4 sm:py-4 h-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* Notificaciones */}
      <NotificationContainer />
    </div>
  );
};

export default MainLayout;

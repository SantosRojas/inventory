import React from 'react';
import { Outlet } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { useTheme } from '../hooks';

const AuthLayout: React.FC = () => {
  useTheme(); // Inicializar tema
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      {/* Left side - Branding - Hidden on mobile, visible on lg+ */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-8"
           style={{ 
             background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)'
           }}>
        <div className="mx-auto max-w-md text-center">
          <div className="flex justify-center mb-8">
            <div className="flex items-center">
              <Activity className="h-12 w-12" style={{ color: 'var(--color-text-inverse)' }} />
              <span className="ml-3 text-3xl font-bold" style={{ color: 'var(--color-text-inverse)' }}>InventarioApp</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--color-text-inverse)' }}>
            Sistema Inteligente de Gestión de Inventario
          </h1>
          
          <p className="text-xl mb-8" style={{ color: 'var(--color-text-inverse)', opacity: 0.9 }}>
            Controla y administra tu inventario de bombas con tecnología QR y gestión inteligente.
          </p>
          
          <div className="space-y-4" style={{ color: 'var(--color-text-inverse)', opacity: 0.9 }}>
            
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 rounded-full flex items-center justify-center"
                     style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                  <span className="text-sm" style={{ color: 'var(--color-text-inverse)' }}>✓</span>
                </div>
              </div>
              <span className="ml-3">Interfaz intuitiva</span>
            </div>
            
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 rounded-full flex items-center justify-center"
                     style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                  <span className="text-sm" style={{ color: 'var(--color-text-inverse)' }}>✓</span>
                </div>
              </div>
              <span className="ml-3">Acceso desde cualquier lugar y dispositivo</span>
            </div>
            
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 rounded-full flex items-center justify-center"
                     style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                  <span className="text-sm" style={{ color: 'var(--color-text-inverse)' }}>✓</span>
                </div>
              </div>
              <span className="ml-3">Reportes claros y detallados</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:px-14 xl:px-18 min-h-screen"
           style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="mx-auto w-full max-w-lg lg:w-140">
          {/* Mobile header - Only visible on small screens */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex justify-center items-center mb-6">
              <Activity className="h-10 w-10" style={{ color: 'var(--color-primary)' }} />
              <span className="ml-3 text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>InventarioApp</span>
            </div>
            <div className="px-4">
              <h1 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                Sistema de Inventario
              </h1>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Desarrollado por Santos Rojas
              </p>
            </div>
          </div>
          
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

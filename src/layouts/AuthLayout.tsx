import React from 'react';
import { Outlet } from 'react-router-dom';
import { Activity } from 'lucide-react';

const AuthLayout: React.FC = () => {
  console.log('AuthLayout');
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding - Hidden on mobile, visible on lg+ */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-8 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="mx-auto max-w-md text-center">
          <div className="flex justify-center mb-8">
            <div className="flex items-center">
              <Activity className="h-12 w-12 text-white" />
              <span className="ml-3 text-3xl font-bold text-white">B|BRAUN</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-6">
            Sistema Inteligente de Gestión de Inventario
          </h1>
          
          <p className="text-xl text-blue-100 mb-8">
            Optimiza el control y la administración de bombas de infusión con eficiencia y precisión.
          </p>
          
          <div className="space-y-4 text-blue-100">
            
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
              </div>
              <span className="ml-3">Interfaz intuitiva</span>
            </div>
            
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
              </div>
              <span className="ml-3">Acceso desde cualquier lugar y dispositivo</span>
            </div>
            
            
            
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
              </div>
              <span className="ml-3">Reportes claros y detallados</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 min-h-screen">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Mobile header - Only visible on small screens */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex justify-center items-center mb-6">
              <Activity className="h-10 w-10 text-blue-600" />
              <span className="ml-3 text-2xl font-bold text-gray-900">B|BRAUN</span>
            </div>
            <div className="px-4">
              <h1 className="text-lg font-semibold text-gray-900 mb-2">
                Sistema de Inventario
              </h1>
              <p className="text-sm text-gray-600">
                Gestión eficiente de bombas de infusión
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

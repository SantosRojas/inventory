import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks';
import { Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleRedirect = () => {
    if (user?.role === 'guest') {
      navigate('/usuarios');
    } else {
      navigate('/inventario');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-xl w-full text-center bg-white p-8 rounded-lg shadow-lg">
        {/* SVG ilustración */}
        <div className="mb-6">
          <svg
            className="mx-auto h-40 w-40"
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="256" cy="256" r="256" fill="#F87171" opacity="0.1" />
            <path
              d="M256 128L192 384H320L256 128Z"
              fill="#EF4444"
              className="animate-bounce"
            />
            <circle cx="256" cy="400" r="16" fill="#EF4444" />
          </svg>
        </div>

        <h1 className="text-6xl font-extrabold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Página no encontrada
        </h2>
        <p className="text-gray-600 mb-6">
          La página que estás buscando no existe o ha sido movida.
        </p>

        <button
          onClick={handleRedirect}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          <Home className="h-5 w-5 mr-2" />
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;

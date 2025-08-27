import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks';

const AccessDeniedPage = () => {
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-6 bg-white shadow-md rounded-md">
        <h2 className="text-3xl font-bold text-red-600 mb-4">Acceso Denegado</h2>
        <p className="text-gray-700 mb-6">
          No tienes permisos para acceder a esta página.
        </p>
        <button
          onClick={handleRedirect}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default AccessDeniedPage;

import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFoundPage: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <AlertTriangle className="mx-auto h-24 w-24 text-red-500" />
                </div>

                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>

                <h2 className="text-3xl font-bold text-gray-700 mb-4">
                    Página no encontrada
                </h2>

                <p className="text-gray-600 mb-8">
                    La página que estás buscando no existe o ha sido movida.
                </p>

                <Link
                    to="/inventario"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                    <Home className="h-5 w-5 mr-2" />
                    Volver al Inventario
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;

import React from 'react';
import { Activity } from 'lucide-react';

const LoadingPage: React.FC = () => {
    console.log('LoadingPage');
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="mb-8">
                    <Activity className="mx-auto h-16 w-16 text-blue-600 animate-spin" />
                </div>

                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Cargando...
                </h2>

                <p className="text-gray-600">
                    Inicializando el sistema de inventario
                </p>
            </div>
        </div>
    );
};

export default LoadingPage;

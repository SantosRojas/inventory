import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Heart, ArrowLeft } from 'lucide-react';
import {useAuth} from "../features/auth/hooks";

const AboutPage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleGoBack = () => {
        // Si está autenticado, ir al dashboard; si no, ir al login
        if (isAuthenticated) {
            navigate('/dashboard');
        } else {
            navigate('/auth/login');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Navigation */}
                <div className="mb-8">
                    <button
                        onClick={handleGoBack}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        {isAuthenticated ? 'Volver al Dashboard' : 'Volver al Login'}
                    </button>
                </div>

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <Activity className="h-16 w-16 text-blue-600" />
                    </div>

                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Sistema de Inventario B|BRAUN
                    </h1>

                    <p className="text-xl text-gray-600">
                        Gestión inteligente de bombas de infusión médica
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Acerca del Sistema
                    </h2>

                    <div className="prose prose-lg text-gray-600">
                        <p className="mb-4">
                            Nuestro sistema de inventario está diseñado específicamente para la gestión
                            eficiente de bombas de infusión médica, proporcionando un control total sobre
                            el inventario hospitalario.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            Características principales:
                        </h3>

                        <ul className="space-y-2 mb-6">
                            <li>• Control de inventario en tiempo real</li>
                            <li>• Gestión de múltiples instituciones y servicios</li>
                            <li>• Seguimiento del estado operativo de equipos</li>
                            <li>• Reportes detallados y exportación de datos</li>
                            <li>• Interfaz intuitiva y responsive</li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center">
                    <p className="text-gray-500 flex items-center justify-center">
                        Desarrollado con <Heart className="h-4 w-4 text-red-500 mx-1" /> para B|BRAUN
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;

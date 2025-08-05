import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';
import {useAuth} from "../features/auth/hooks";

const TermsPage: React.FC = () => {
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
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={handleGoBack}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        {isAuthenticated ? 'Volver al Dashboard' : 'Volver al Login'}
                    </button>

                    <div className="flex items-center mb-4">
                        <FileText className="h-8 w-8 text-blue-600 mr-3" />
                        <h1 className="text-3xl font-bold text-gray-900">
                            Términos y Condiciones
                        </h1>
                    </div>

                    <p className="text-gray-600">
                        Sistema de Inventario B|BRAUN - Última actualización: Enero 2025
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">

                    {/* Sección 1 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            1. Aceptación de los Términos
                        </h2>
                        <div className="prose text-gray-600 space-y-3">
                            <p>
                                Al acceder y utilizar el Sistema de Inventario B|BRAUN, usted acepta estar sujeto
                                a estos términos y condiciones de uso. Si no está de acuerdo con alguna parte de
                                estos términos, no debe utilizar nuestro sistema.
                            </p>
                        </div>
                    </section>

                    {/* Sección 2 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            2. Uso del Sistema
                        </h2>
                        <div className="prose text-gray-600 space-y-3">
                            <p>
                                Este sistema está destinado exclusivamente para la gestión de inventario de equipos
                                médicos B|BRAUN. Los usuarios deben:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Utilizar el sistema únicamente para fines profesionales autorizados</li>
                                <li>Mantener la confidencialidad de sus credenciales de acceso</li>
                                <li>No intentar acceder a información no autorizada</li>
                                <li>Reportar cualquier problema de seguridad inmediatamente</li>
                            </ul>
                        </div>
                    </section>

                    {/* Sección 3 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            3. Confidencialidad y Protección de Datos
                        </h2>
                        <div className="prose text-gray-600 space-y-3">
                            <p>
                                Toda la información contenida en este sistema es confidencial y propiedad de B|BRAUN.
                                Los usuarios se comprometen a:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>No divulgar información del sistema a terceros no autorizados</li>
                                <li>Utilizar la información únicamente para los fines previstos</li>
                                <li>Cumplir con las regulaciones de protección de datos aplicables</li>
                            </ul>
                        </div>
                    </section>

                    {/* Sección 4 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            4. Responsabilidades del Usuario
                        </h2>
                        <div className="prose text-gray-600 space-y-3">
                            <p>
                                Los usuarios son responsables de:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>La exactitud de los datos que ingresan al sistema</li>
                                <li>El uso apropiado de las funcionalidades del sistema</li>
                                <li>Mantener actualizados sus datos de contacto</li>
                                <li>Notificar cambios en el estado de los equipos de manera oportuna</li>
                            </ul>
                        </div>
                    </section>

                    {/* Sección 5 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            5. Limitación de Responsabilidad
                        </h2>
                        <div className="prose text-gray-600 space-y-3">
                            <p>
                                B|BRAUN no será responsable por daños directos, indirectos, incidentales o
                                consecuentes que puedan surgir del uso del sistema, incluyendo pero no limitado a:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Pérdida de datos o información</li>
                                <li>Interrupciones del servicio</li>
                                <li>Errores en la información del sistema</li>
                            </ul>
                        </div>
                    </section>

                    {/* Sección 6 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            6. Modificaciones
                        </h2>
                        <div className="prose text-gray-600 space-y-3">
                            <p>
                                B|BRAUN se reserva el derecho de modificar estos términos y condiciones en cualquier
                                momento. Los cambios serán notificados a los usuarios a través del sistema y entrarán
                                en vigencia inmediatamente después de su publicación.
                            </p>
                        </div>
                    </section>

                    {/* Sección 7 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            7. Contacto
                        </h2>
                        <div className="prose text-gray-600 space-y-3">
                            <p>
                                Para consultas sobre estos términos y condiciones, puede contactarnos a través de:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Email: soporte.inventario@bbraun.com</li>
                                <li>Teléfono: +52 (55) 1234-5678</li>
                                <li>Horario de atención: Lunes a Viernes, 8:00 AM - 6:00 PM</li>
                            </ul>
                        </div>
                    </section>

                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        © 2025 B|BRAUN. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;

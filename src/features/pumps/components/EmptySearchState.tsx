import { Search, QrCode, Plus, Zap } from 'lucide-react';

interface EmptySearchStateProps {
    onQRScan: () => void;
    onAdd: () => void;
}

const EmptySearchState = ({ onQRScan, onAdd }: EmptySearchStateProps) => {
    return (
        <div className="flex-1 flex items-center justify-center p-12">
            <div className="text-center max-w-md">
                {/* Icono principal */}
                <div className="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                    <Search className="h-12 w-12 text-blue-600" />
                </div>

                {/* Título y descripción */}
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Busca en tu inventario
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    Encuentra rápidamente cualquier bomba de infusión escribiendo al menos
                    <strong> 3 caracteres</strong> en el buscador o escaneando su código QR
                    con la cámara de tu dispositivo.
                </p>

                {/* Acciones rápidas */}
                <div className="space-y-4">
                    <button
                        onClick={onQRScan}
                        className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <QrCode className="h-5 w-5" />
                        <span className="font-medium">Escanear Código QR</span>
                    </button>

                    <button
                        onClick={onAdd}
                        className="w-full flex items-center justify-center space-x-3 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        <span className="font-medium">Agregar Nueva Bomba</span>
                    </button>
                </div>

                {/* Consejos */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center justify-center">
                        <Zap className="h-4 w-4 text-yellow-500 mr-2" />
                        Consejos rápidos
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                        <p>• Busca por serie, QR, modelo, institución o servicio</p>
                        <p>• <strong>Mínimo 3 caracteres</strong> para iniciar la búsqueda</p>
                        <p>• Usa el escáner QR para búsquedas instantáneas</p>
                        <p>• Los resultados aparecen mientras escribes</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmptySearchState;
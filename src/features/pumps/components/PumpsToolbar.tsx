import { QrCode, Plus} from 'lucide-react';
import {Button, SearchInput} from "../../../components";
import SerialQRSelector from "../../../components/SerialQrSelector.tsx";

interface PumpsToolbarProps {
    searchTerm: string;
    target: string;
    onSearchChange: (term: string) => void;
    onQRScan: () => void;
    onAdd: () => void;
    handleChangeTarget: (target: string) => void;
    isLoading?: boolean;
}

const PumpsToolbar = (
    {
        searchTerm,
        target,
        onSearchChange,
        onQRScan,
        onAdd,
        handleChangeTarget,
        isLoading = false
    }: PumpsToolbarProps) => {

    return (
        <div className="bg-white border-b border-gray-200 p-6">
            {/* Header */}
            <div className="flex justify-between items-start sm:items-center mb-6">

                <Button
                    onClick={onAdd}
                    disabled={isLoading}
                    className="flex items-center space-x-2"
                >
                    <Plus className="h-4 w-4" />
                    <span>Agregar Bomba</span>
                </Button>

                <Button
                    onClick={onQRScan}
                    disabled={isLoading}
                    variant="outline"   // usa el nuevo estilo
                    className="flex items-center space-x-2"
                >
                    <QrCode className="h-4 w-4" />
                    <span>Escanear QR</span>
                </Button>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                    <SearchInput
                        placeholder ={`Buscar por ${target}`}
                        onSearch={onSearchChange}
                        minLength={3}
                        disabled={isLoading}
                    />
                </div>
                <SerialQRSelector handleChangeTarget={handleChangeTarget} />


            </div>

            {/* Results Summary - Solo mostrar si hay búsqueda válida */}
            {searchTerm && searchTerm.length >= 3 && (
                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                    <div>
            <span>
              <span className="ml-2 text-blue-600">
                • Filtrado por: "{searchTerm}"
              </span>
            </span>
                    </div>

                    <button
                        onClick={() => onSearchChange('')}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        Limpiar búsqueda
                    </button>
                </div>
            )}

            {/* Mensaje cuando no hay búsqueda */}
            {!searchTerm && (
                <div className="mt-4 text-center text-gray-500">
                    <p className="text-sm">
                        Usa la búsqueda o el escáner QR para encontrar bombas específicas
                    </p>
                </div>
            )}
        </div>
    );
};

export default PumpsToolbar;
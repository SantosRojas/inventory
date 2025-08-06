import { QrCode, Plus} from 'lucide-react';
import {Button, SearchInput} from "../../../components";
import SerialQRSelector from "../../../components/SerialQrSelector.tsx";

interface PumpsToolbarProps {
    target: string;
    onSearchChange: (term: string) => void;
    onQRScan: () => void;
    onAdd: () => void;
    handleChangeTarget: (target: string) => void;
    isLoading?: boolean;
}

const PumpsToolbar = (
    {
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

        </div>
    );
};

export default PumpsToolbar;
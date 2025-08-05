import { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { QrCode, Camera } from 'lucide-react';
import {Modal} from "../../../components";


interface QRScannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onScan: (result: string) => void;
}

const QRScannerModal = ({ isOpen, onClose, onScan }: QRScannerModalProps) => {
    const [error, setError] = useState<string | null>(null);

    const handleScan = (result: { rawValue: string }[] | string) => {
        if (result && Array.isArray(result) && result.length > 0) {
            const scannedText = result[0]?.rawValue;
            if (scannedText) {
                console.log('📱 Código QR escaneado:', scannedText);
                onScan(scannedText);
                onClose();
            }
        } else if (typeof result === 'string') {
            console.log('📱 Código QR escaneado:', result);
            onScan(result);
            onClose();
        }
    };

    const handleError = (error: unknown) => {
        console.error('❌ Error al escanear QR:', error);
        setError('Error al acceder a la cámara. Verifica los permisos.');
    };

    const handleClose = () => {
        setError(null);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Escanear Código QR" size="md">
            <div className="space-y-4">
                {/* Instrucciones */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                        <QrCode className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">
                                Instrucciones para escanear
                            </h3>
                            <div className="mt-2 text-sm text-blue-700">
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Permite el acceso a la cámara cuando se solicite</li>
                                    <li>Enfoca el código QR dentro del marco</li>
                                    <li>Mantén el dispositivo estable hasta que se detecte</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Área del escáner */}
                <div className="relative">
                    <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: '400px' }}>
                        {isOpen && (
                            <Scanner
                                onScan={handleScan}
                                onError={handleError}
                                constraints={{
                                    facingMode: 'environment', // Usar cámara trasera por defecto
                                }}
                                allowMultiple={false}
                                scanDelay={300}
                                styles={{
                                    container: {
                                        width: '100%',
                                        height: '100%',
                                    }
                                }}
                            />
                        )}

                        {/* Overlay con marco de escaneo */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="border-2 border-white border-dashed rounded-lg w-64 h-64 flex items-center justify-center bg-black bg-opacity-20">
                                <div className="text-white text-center">
                                    <Camera className="h-8 w-8 mx-auto mb-2" />
                                    <p className="text-sm">Enfoca el código QR aquí</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    Error al escanear
                                </h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>{error}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Botones */}
                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export  default QRScannerModal;
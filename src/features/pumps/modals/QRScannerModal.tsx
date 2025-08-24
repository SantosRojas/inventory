import { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Camera, AlertCircle } from 'lucide-react';
import { Modal } from "../../../components";
import { usePumpStore } from '../store';
import { useNotifications } from '../../../hooks';

interface QRScannerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const QRScannerModal = ({ isOpen, onClose }: QRScannerModalProps) => {
    const [errorScanner, setErrorScanner] = useState<string | null>(null);
    const [hasPermission, setHasPermission] = useState<'checking' | 'manual' | 'granted' | 'denied' | null>(null);
    const [isRequestingPermission, setIsRequestingPermission] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const fetchByQr = usePumpStore((state) => state.fetchByQr);
    const { notifyError } = useNotifications();

    const onScan = async (result: string) => {
        try {
            console.log('🔍 Iniciando búsqueda por QR:', result);
            
            // Realizar búsqueda y esperar resultado
            await fetchByQr(result);
            
            // Obtener el estado actualizado del store
            const currentState = usePumpStore.getState();
            const { error: currentError, pumpData: currentPumpData, isLoading: currentIsLoading } = currentState;
            
            // Cerrar el modal primero para que se vean las notificaciones
            onClose();
            
            // Después mostrar las notificaciones apropiadas
            if (currentError) {
                notifyError('Error al buscar bomba por código QR: ' + currentError);
            } else if (!currentIsLoading && (!Array.isArray(currentPumpData) || currentPumpData.length === 0)) {
                notifyError('No se encontraron bombas registradas con QR: ' + result, 'Intente buscar por número de serie.');
            } else if (currentPumpData && currentPumpData.length > 0) {
                console.log('✅ Bomba encontrada exitosamente');
                // La notificación de éxito se mostrará en la página donde se muestran los resultados
            }
            
        } catch (err) {
            console.error('❌ Error inesperado en búsqueda QR:', err);
            onClose(); // Cerrar modal incluso en caso de error inesperado
            notifyError('Error inesperado al buscar bomba por código QR.');
        }
    };


    // Función para verificar si ya tenemos permisos
    const checkExistingPermissions = async () => {
        try {
            // Verificar si la API está disponible
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                console.log('📱 API de cámara no disponible');
                return false;
            }

            // Intentar verificar permisos usando la API de permisos si está disponible
            if ('permissions' in navigator) {
                const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
                console.log('🔍 Estado de permisos:', permission.state);

                if (permission.state === 'granted') {
                    console.log('✅ Permisos ya concedidos, activando cámara automáticamente...');
                    return true;
                } else if (permission.state === 'denied') {
                    console.log('❌ Permisos denegados previamente');
                    setHasPermission('denied');
                    return false;
                }
            }

            // Si no podemos verificar permisos, intentar acceso directo
            console.log('🔄 Verificando acceso directo a la cámara...');
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }
                });

                console.log('✅ Acceso directo exitoso, permisos ya concedidos');
                // Liberar inmediatamente
                stream.getTracks().forEach(track => track.stop());
                return true;
            } catch (err) {
                console.log('❌ No hay permisos previos o acceso denegado');
                return false;
            }

        } catch (err) {
            console.error('❌ Error verificando permisos:', err);
            return false;
        }
    };

    // Función para activar la cámara automáticamente
    const activateCameraAutomatically = async () => {
        console.log('🚀 Activando cámara automáticamente...');
        setHasPermission('checking');

        const hasExistingPermissions = await checkExistingPermissions();

        if (hasExistingPermissions) {
            // Si ya tenemos permisos, activar directamente
            await requestCameraPermission();
        } else {
            // Si no tenemos permisos, mostrar el botón
            setHasPermission('manual');
        }
    };
    const requestCameraPermission = async () => {
        setIsRequestingPermission(true);
        setErrorScanner(null);

        try {
            // Verificar si la API está disponible
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Tu navegador no soporta acceso a la cámara');
            }

            // Solicitar permisos explícitamente con diferentes configuraciones de cámara
            let stream;
            try {
                // Intentar primero con cámara trasera
                stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'environment'
                    }
                });
            } catch (envError) {
                console.log('No se pudo acceder a cámara trasera, intentando con cualquier cámara:', envError);
                // Si falla, intentar con cualquier cámara disponible
                stream = await navigator.mediaDevices.getUserMedia({
                    video: true
                });
            }

            console.log('✅ Permisos de cámara concedidos');
            console.log('📹 Stream obtenido:', stream);

            // Verificar que el stream tenga tracks de video activos
            const videoTracks = stream.getVideoTracks();
            if (videoTracks.length === 0) {
                throw new Error('No se encontraron tracks de video en el stream');
            }

            console.log('🎥 Video tracks encontrados:', videoTracks.length);
            setHasPermission('granted');

            // Liberar el stream inmediatamente para que el Scanner pueda usarlo
            stream.getTracks().forEach(track => {
                console.log(`🔄 Liberando track: ${track.kind} - ${track.label}`);
                track.stop();
            });

            // Mostrar el scanner después de un pequeño delay
            setTimeout(() => {
                console.log('🚀 Iniciando scanner...');
                setShowScanner(true);
            }, 500);

        } catch (err) {
            console.error('❌ Error al solicitar permisos:', err);
            setHasPermission('denied');

            if (err instanceof Error) {
                if (err.name === 'NotAllowedError') {
                    setErrorScanner('Permisos de cámara denegados. Necesitas permitir el acceso para escanear códigos QR.');
                } else if (err.name === 'NotFoundError') {
                    setErrorScanner('No se encontró ninguna cámara en este dispositivo.');
                } else if (err.name === 'NotSupportedError') {
                    setErrorScanner('Tu navegador no soporta acceso a la cámara.');
                } else if (err.name === 'NotReadableError') {
                    setErrorScanner('La cámara está siendo utilizada por otra aplicación. Cierra otras aplicaciones que puedan estar usando la cámara.');
                } else {
                    setErrorScanner(`Error: ${err.message}`);
                }
            } else {
                setErrorScanner('Error desconocido al acceder a la cámara.');
            }
        } finally {
            setIsRequestingPermission(false);
        }
    };

    // Reset cuando se abre/cierra el modal
    useEffect(() => {
        if (isOpen) {
            setErrorScanner(null);
            setHasPermission(null);
            setShowScanner(false);
            // Activar automáticamente después de un pequeño delay
            setTimeout(() => {
                activateCameraAutomatically();
            }, 100);
        } else {
            setHasPermission(null);
            setShowScanner(false);
            setErrorScanner(null);
        }
    }, [isOpen]);

    const handleScan = async (result: { rawValue: string }[] | string) => {
        if (result && Array.isArray(result) && result.length > 0) {
            const scannedText = result[0]?.rawValue;
            if (scannedText) {
                console.log('📱 Código QR escaneado:', scannedText);
                await onScan(scannedText);
            }
        } else if (typeof result === 'string') {
            console.log('📱 Código QR escaneado:', result);
            await onScan(result);
        }
    };

    const handleError = (error: unknown) => {
        console.error('❌ Error al escanear QR:', error);

        // Verificar el tipo de error más específicamente
        if (error instanceof Error) {
            if (error.name === 'NotAllowedError' || error.message.includes('permission')) {
                setHasPermission('denied');
                setErrorScanner('Permisos de cámara denegados. Haz clic en "Activar Cámara" para intentar de nuevo.');
            } else if (error.name === 'NotFoundError') {
                setErrorScanner('No se encontró ninguna cámara en este dispositivo.');
            } else if (error.name === 'NotReadableError') {
                setErrorScanner('La cámara está siendo utilizada por otra aplicación.');
            } else {
                setErrorScanner(`Error de la cámara: ${error.message}`);
            }
        } else {
            setErrorScanner('Error desconocido al acceder a la cámara.');
        }

        // Si hay error después de haber concedido permisos, resetear el estado
        if (hasPermission === 'granted') {
            setTimeout(() => {
                setHasPermission('manual');
                setShowScanner(false);
            }, 2000);
        }
    };

    const handleClose = () => {
        setErrorScanner(null);
        setHasPermission(null);
        setShowScanner(false);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Escanear Código QR" size="md">
            <div className="space-y-4">
                {/* Instrucciones */}
                {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                        <QrCode className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">
                                Instrucciones para escanear
                            </h3>
                            <div className="mt-2 text-sm text-blue-700">
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Haz clic en "Activar Cámara" para solicitar permisos</li>
                                    <li>Permite el acceso a la cámara cuando se solicite</li>
                                    <li>Enfoca el código QR dentro del marco</li>
                                    <li>Mantén el dispositivo estable hasta que se detecte</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* Área del escáner */}
                <div className="relative">
                    <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: '400px' }}>

                        {/* Estado inicial - Verificando permisos automáticamente */}
                        {(hasPermission === null || hasPermission === 'checking') && (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center p-6">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <Camera className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Verificando permisos de cámara...
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-6">
                                        Comprobando si ya tienes permisos concedidos
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Estado manual - Botón para activar cámara */}
                        {hasPermission === 'manual' && (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center p-6">
                                    <Camera className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Activar Cámara
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-6">
                                        Para escanear códigos QR necesitamos acceso a tu cámara
                                    </p>
                                    <button
                                        onClick={requestCameraPermission}
                                        disabled={isRequestingPermission}
                                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Camera className="h-5 w-5 mr-2" />
                                        {isRequestingPermission ? 'Solicitando permisos...' : 'Activar Cámara'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Estado de permisos denegados */}
                        {hasPermission === 'denied' && (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center p-6">
                                    <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Permisos Requeridos
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-6">
                                        Para continuar, necesitas permitir el acceso a la cámara
                                    </p>
                                    <button
                                        onClick={requestCameraPermission}
                                        disabled={isRequestingPermission}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        <Camera className="h-4 w-4 mr-2" />
                                        {isRequestingPermission ? 'Intentando...' : 'Intentar Nuevamente'}
                                    </button>
                                    <p className="text-xs text-gray-500 mt-3">
                                        Si el problema persiste, verifica la configuración de permisos en tu navegador
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Scanner activo cuando tenemos permisos */}
                        {hasPermission === 'granted' && showScanner && (
                            <>
                                <Scanner
                                    onScan={handleScan}
                                    onError={handleError}
                                    constraints={{
                                        facingMode: 'environment',
                                        width: { ideal: 1280 },
                                        height: { ideal: 720 }
                                    }}
                                    allowMultiple={false}
                                    scanDelay={300}
                                    components={{
                                        finder: false
                                    }}
                                    styles={{
                                        container: {
                                            width: '100%',
                                            height: '100%',
                                        },
                                        video: {
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }
                                    }}
                                />

                                {/* Overlay con marco de escaneo */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    {/* Marco de escaneo verde único */}
                                    <div className="relative w-64 h-64">
                                        {/* Esquinas del marco para mejor visibilidad */}
                                        <div className="absolute -top-1 -left-1 w-8 h-8 border-l-4 border-t-4 border-green-400 rounded-tl-lg"></div>
                                        <div className="absolute -top-1 -right-1 w-8 h-8 border-r-4 border-t-4 border-green-400 rounded-tr-lg"></div>
                                        <div className="absolute -bottom-1 -left-1 w-8 h-8 border-l-4 border-b-4 border-green-400 rounded-bl-lg"></div>
                                        <div className="absolute -bottom-1 -right-1 w-8 h-8 border-r-4 border-b-4 border-green-400 rounded-br-lg"></div>

                                        {/* Líneas laterales opcionales para marco completo */}
                                        <div className="absolute top-4 left-0 w-0.5 h-16 bg-green-400 opacity-60"></div>
                                        <div className="absolute top-4 right-0 w-0.5 h-16 bg-green-400 opacity-60"></div>
                                        <div className="absolute bottom-4 left-0 w-0.5 h-16 bg-green-400 opacity-60"></div>
                                        <div className="absolute bottom-4 right-0 w-0.5 h-16 bg-green-400 opacity-60"></div>

                                        <div className="absolute top-0 left-4 h-0.5 w-16 bg-green-400 opacity-60"></div>
                                        <div className="absolute top-0 right-4 h-0.5 w-16 bg-green-400 opacity-60"></div>
                                        <div className="absolute bottom-0 left-4 h-0.5 w-16 bg-green-400 opacity-60"></div>
                                        <div className="absolute bottom-0 right-4 h-0.5 w-16 bg-green-400 opacity-60"></div>
                                    </div>

                                    {/* Texto en la parte superior, fuera del área de escaneo */}
                                    <div className="absolute top-4 left-0 right-0 text-center">
                                        <div className="inline-block bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                                            <Camera className="h-4 w-4 inline mr-1" />
                                            Enfoca el código QR en el marco verde
                                        </div>
                                    </div>

                                    {/* Línea de escaneo animada que se mueve de arriba hacia abajo */}
                                    <div
                                        className="absolute left-1/2 transform -translate-x-1/2 w-56 h-0.5 bg-green-400 opacity-80"
                                        style={{
                                            animation: 'scanLine 2s ease-in-out infinite',
                                            top: '10%'
                                        }}
                                    ></div>

                                    {/* Estilos CSS para la animación */}
                                    <style dangerouslySetInnerHTML={{
                                        __html: `
                                            @keyframes scanLine {
                                                0% { top: 10%; }
                                                50% { top: 90%; }
                                                100% { top: 10%; }
                                            }
                                        `
                                    }} />
                                </div>
                            </>
                        )}

                        {/* Estado de carga después de conceder permisos */}
                        {hasPermission === 'granted' && !showScanner && (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-sm text-gray-600">Iniciando cámara...</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Error */}
                {errorScanner && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex">
                            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                            <div className="ml-3 flex-1">
                                <h3 className="text-sm font-medium text-red-800">
                                    Error al escanear
                                </h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>{errorScanner}</p>
                                </div>
                                <div className="mt-3 flex space-x-2">
                                    {hasPermission === 'denied' && (
                                        <button
                                            onClick={requestCameraPermission}
                                            disabled={isRequestingPermission}
                                            className="text-sm text-red-600 hover:text-red-800 underline disabled:opacity-50"
                                        >
                                            {isRequestingPermission ? 'Intentando...' : 'Intentar nuevamente'}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            console.log('🔄 Reseteando modal...');
                                            setErrorScanner(null);
                                            setHasPermission('manual');
                                            setShowScanner(false);
                                        }}
                                        className="text-sm text-red-600 hover:text-red-800 underline"
                                    >
                                        Reiniciar
                                    </button>
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
                    {hasPermission === 'granted' && showScanner && (
                        <button
                            type="button"
                            onClick={() => {
                                setHasPermission('manual');
                                setShowScanner(false);
                            }}
                            className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Reiniciar Cámara
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default QRScannerModal;
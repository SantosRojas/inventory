import { useState, useCallback, useEffect } from 'react';
import type { Pump } from '../../../types';

import { useCatalogLoader } from "../hooks";
import { PumpsTable, PumpsToolbar, LatestInventoriesTable } from "../components";
import { PageLoader } from "../../../components";
import { DeletePumpModal,AddPumpModal,EditPumpModal,QRScannerModal } from "../modals";
import { useLatestInventoriesStore } from '../store';


const PumpsPage = () => {
    console.log('🚀 Renderizando PumpsPage');
    const { loading, error } = useCatalogLoader();
    const fetchLatestInventories  = useLatestInventoriesStore((state) => state.fetchLatestInventories);
    const limit = useLatestInventoriesStore((state) => state.limit);

    // Estados para modales
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);

    // Estados para operaciones CRUD
    const [selectedPump, setSelectedPump] = useState<Pump | null>(null);
    const [bombaToDelete, setPumpToDelete] = useState<Pump | null>(null);

    useEffect(() => {
        console.log('🔄 Fetching latest inventories with limit:', limit);
        fetchLatestInventories();
    }, []);

    // Handlers para QR Scanner
    const handleQRScan = useCallback(() => {
        setShowQRModal(true);
    }, []);

    const handleQRResult = useCallback((result: string) => {
        console.log('📱 Código QR escaneado:', result);
        setShowQRModal(false);
    }, []);

    // Handlers para operaciones CRUD
    const handleAdd = useCallback(() => {
        setShowAddModal(true);
    }, []);

    const handleAddSuccess = useCallback(async () => {
        setShowAddModal(false);
        fetchLatestInventories();
    }, []);

    const handleEdit = useCallback((bomba: Pump) => {
        setSelectedPump(bomba);
        setShowEditModal(true);
    }, []);

    const handleEditSuccess = useCallback(async () => {
        setShowEditModal(false);
        setSelectedPump(null);
        fetchLatestInventories();
    }, []);

    const handleDelete = useCallback((bomba: Pump) => {
        setPumpToDelete(bomba);
        setShowDeleteModal(true);
    }, []);

    const handleDeleteSuccess = useCallback(() => {
        setShowDeleteModal(false);
        setPumpToDelete(null);
        fetchLatestInventories();
    }, []);

    const handleCancelDelete = useCallback(() => {
        setShowDeleteModal(false);
        setPumpToDelete(null);
    }, []);

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center p-8">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar datos</h3>
                    <p className="text-sm text-gray-600 mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }
    if (loading) {
        return <PageLoader />;
    }


    return (
        <div className="flex flex-col h-full w-full overflow-hidden gap-4">
            {/* Toolbar */}
            <PumpsToolbar
                onQRScan={handleQRScan}
                onAdd={handleAdd}
            />

            {/* Tabla principal de todos los inventarios */}
            <PumpsTable
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Sección de Últimos Inventarios */}
            <LatestInventoriesTable
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            

            {/* Modales */}
            <QRScannerModal
                isOpen={showQRModal}
                onClose={() => setShowQRModal(false)}
                onScan={handleQRResult}
            />

            <AddPumpModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={handleAddSuccess}
            />

            {selectedPump && (
                <EditPumpModal
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedPump(null);
                    }}
                    onSuccess={handleEditSuccess}
                    bomba={selectedPump}
                />
            )}

            <DeletePumpModal
                isOpen={showDeleteModal}
                onClose={handleCancelDelete}
                onSuccess={handleDeleteSuccess}
                bomba={bombaToDelete}
            />
        </div>
    );
};

export default PumpsPage;

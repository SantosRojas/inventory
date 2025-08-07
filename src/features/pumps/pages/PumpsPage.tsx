import { useState, useCallback } from 'react';
import type { Pump } from '../../../types';

import { useCatalogLoader, usePumpActions } from "../hooks";
import { PumpsTable, PumpsToolbar, QRScannerModal } from "../components";
import AddPumpModal from "../modals/AddPumpModal.tsx";
import EditPumpModal from "../modals/EditPumpModal.tsx";
import { DeletePumpModal } from "../modals";


const PumpsPage = () => {
    console.log('🚀 Renderizando PumpsPage');
    const { remove } = usePumpActions()
    const { loading, error } = useCatalogLoader()

    // Estados para modales
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);


    // Estados para operaciones CRUD
    const [selectedPump, setSelectedPump] = useState<Pump | null>(null);
    const [bombaToDelete, setPumpToDelete] = useState<Pump | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);


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

    }, []);

    const handleEdit = useCallback((bomba: Pump) => {
        setSelectedPump(bomba);
        setShowEditModal(true);
    }, []);

    const handleEditSuccess = useCallback(async () => {
        setShowEditModal(false);
        setSelectedPump(null);
    }, []);

    const handleDelete = useCallback((bomba: Pump) => {
        setPumpToDelete(bomba);
        setShowDeleteModal(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!bombaToDelete) return;

        setIsDeleting(true);
        try {
            await remove(bombaToDelete.id);
            setShowDeleteModal(false);
            setPumpToDelete(null);
        } catch (error) {
            console.error('Error al eliminar bomba:', error);
        } finally {
            setIsDeleting(false);
        }
    }, [bombaToDelete, remove]);

    const handleCancelDelete = useCallback(() => {
        setShowDeleteModal(false);
        setPumpToDelete(null);
    }, []);

    if (error) return <div>Erroorroror</div>
    if (loading) {
        return (
            <div>Cargando data maestra ...</div>
        )
    }


    return (
        <div className="flex flex-col h-full w-full overflow-hidden gap-2">
            {/* Toolbar */}
            <PumpsToolbar
                onQRScan={handleQRScan}
                onAdd={handleAdd}
            />

            <PumpsTable
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
                onConfirm={handleConfirmDelete}
                bomba={bombaToDelete}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default PumpsPage;

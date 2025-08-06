import { useState, useCallback} from 'react';
import type { Pump } from '../../../types';

// Componentes

import {useAuth} from "../../auth/hooks";
import {useCatalogLoader, usePumpActions} from "../hooks";
import {EmptySearchState, PumpsTable, PumpsToolbar, QRScannerModal} from "../components";
import AddPumpModal from "../modals/AddPumpModal.tsx";
import EditPumpModal from "../modals/EditPumpModal.tsx";
import {DeletePumpModal} from "../modals";
import {useFetch} from "../../../hooks";
import {API_ENDPOINTS} from "../../../config";


const PumpsPage = () => {
    console.log('🚀 Renderizando PumpsPage');
    const {remove} = usePumpActions()
    const {token} = useAuth();
    const {loading,error} = useCatalogLoader()
    const { data, loadingSearch, fetchData } = useFetch<Pump[]>(token);

    //Url para research
    const [urlToFetch, setUrlToFetch] = useState("");
    const [target, setTarget] = useState("serial");

    // Estados para modales
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);


    // Estados para operaciones CRUD
    const [selectedPump, setSelectedPump] = useState<Pump | null>(null);
    const [bombaToDelete, setPumpToDelete] = useState<Pump | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);


    // Función para recargar después de operaciones CRUD
    const reloadSearch = useCallback(async () => {
        fetchData(urlToFetch)
    }, [fetchData, urlToFetch]);

    // Handlers para búsqueda
    const handleSearchChange = useCallback((term: string) => {
        // Solo hacer log si hay término de búsqueda o si se está limpiando intencionalmente
        if (term.length >= 3) {
            let url
            if(target === "serial") {
                url = `${API_ENDPOINTS.pumps.getBySerialNumber(term)}`
            }else{
                url = `${API_ENDPOINTS.pumps.getByQRcode(term)}`
            }
            setUrlToFetch(url)
            fetchData(url)
        } else if (term.length === 0) {
            console.log('🧹 Búsqueda limpiada');
        }
    }, [fetchData,target]);

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
        await reloadSearch();
    }, [reloadSearch]);

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
            await reloadSearch();
        } catch (error) {
            console.error('Error al eliminar bomba:', error);
        } finally {
            setIsDeleting(false);
        }
    }, [bombaToDelete, reloadSearch, remove]);

    const handleCancelDelete = useCallback(() => {
        setShowDeleteModal(false);
        setPumpToDelete(null);
    }, []);

    const handleChangeTarget = (target: string) => {
        setTarget(target);
    }
    if(error) return <div>Erroorroror</div>
    if(loading){
        return (
            <div>Cargando data maestra ...</div>
        )
    }


    return (
        <div className="flex flex-col h-full">
            {/* Toolbar */}
            <PumpsToolbar
                target={target}
                onSearchChange={handleSearchChange}
                onQRScan={handleQRScan}
                onAdd={handleAdd}
                handleChangeTarget={handleChangeTarget}
                isLoading={loadingSearch}
            />


            {/* Content Area */}
            <div className="flex-1 p-2 px-0">
                { data ? (
                    // Mostrar tabla solo si hay búsqueda válida (3+ caracteres)
                    <PumpsTable
                        pumps={data ?? []}
                        isLoading={loadingSearch}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ) : (
                    // Mostrar estado vacío cuando no hay búsqueda válida
                    <EmptySearchState
                        onQRScan={handleQRScan}
                        onAdd={handleAdd}
                    />
                )}
            </div>

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

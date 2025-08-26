import { useState, useCallback, useEffect } from 'react';
import { Plus, Settings, Search } from 'lucide-react';
import type { ServiceExtended } from '../types';

import { useServiceStore } from "../store";
import { useServiceSearch } from "../hooks";
import { useNotifications } from '../../../hooks/useNotifications';
import { ServicesTable } from "../components";
import { 
    AddServiceModal, 
    EditServiceModal, 
    DeleteServiceModal 
} from "../modals";
import { Button, PageLoader } from '../../../components';

const ServicesPage = () => {
    const { 
        services, 
        isLoading, 
        error, 
        fetchAllServices,
        removeService,
        clearError 
    } = useServiceStore();
    
    const { notifySuccess, notifyError } = useNotifications();
    
    // Hook personalizado para búsqueda
    const {
        searchTerm,
        setSearchTerm,
        filteredServices,
        isLastFilteredService
    } = useServiceSearch(services);

    // Estados para modales
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Estados para operaciones CRUD
    const [selectedService, setSelectedService] = useState<ServiceExtended | null>(null);
    const [serviceToDelete, setServiceToDelete] = useState<ServiceExtended | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Cargar servicios al montar el componente
    useEffect(() => {
        fetchAllServices();
    }, [fetchAllServices]);

    const handleAdd = useCallback(() => {
        setShowAddModal(true);
    }, []);

    const handleClose = useCallback(() => {
        setShowAddModal(false);
        // El store ya se actualiza automáticamente
    }, []);

    const handleEdit = useCallback((service: ServiceExtended) => {
        setSelectedService(service);
        setShowEditModal(true);
    }, []);

    const handleEditSuccess = useCallback(() => {
        setShowEditModal(false);
        setSelectedService(null);
        // El store ya se actualiza automáticamente
    }, []);

    const handleDelete = useCallback((service: ServiceExtended) => {
        setServiceToDelete(service);
        setShowDeleteModal(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!serviceToDelete) return;

        setIsDeleting(true);
        try {
            const success = await removeService(serviceToDelete.id);
            
            if (success) {
                notifySuccess(`Servicio "${serviceToDelete.name}" eliminado exitosamente`);
                setShowDeleteModal(false);
                setServiceToDelete(null);
                
                // Si el servicio eliminado era el último en el filtro, limpiar búsqueda
                if (isLastFilteredService(serviceToDelete.id)) {
                    setSearchTerm('');
                    clearError();
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                notifyError(error.message);
            } else {
                notifyError('Error al eliminar el servicio');
            }
        } finally {
            setIsDeleting(false);
        }
    }, [serviceToDelete, removeService, notifySuccess, notifyError, isLastFilteredService, setSearchTerm, clearError]);

    const handleCancelDelete = useCallback(() => {
        setShowDeleteModal(false);
        setServiceToDelete(null);
    }, []);

    if (isLoading) {
        return <PageLoader />;
    }

    if (error) {
        return (
            <div className="flex flex-col h-full w-full items-center justify-center bg-gray-50">
                <div className="text-center p-8">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <Settings className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Error al cargar servicios</h3>
                    <p className="mt-1 text-sm text-gray-500">{error}</p>
                    <div className="mt-6">
                        <button
                            onClick={() => {
                                setSearchTerm(''); // Limpiar búsqueda
                                clearError(); // Limpiar error
                                fetchAllServices(); // Recargar datos
                            }}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full gap-4 p-1 md:p-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Settings className="h-6 w-6" />
                        Servicios
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Gestiona los servicios del sistema
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    
                    {/* Botón Agregar */}
                    <Button
                        onClick={handleAdd}
                        className="w-full sm:w-auto inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Servicio
                    </Button>

                    {/* Buscador */}
                    <div className="relative w-full sm:w-auto">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar servicios..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    
                </div>
            </div>

            {/* Tabla */}
            <div className="flex-1 overflow-hidden">
                {/* Contador de resultados */}
                {searchTerm && (
                    <div className="mb-4 text-sm text-gray-600">
                        {filteredServices.length === 0 ? (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-yellow-800">
                                        No se encontraron servicios que coincidan con "<strong>{searchTerm}</strong>"
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            clearError();
                                        }}
                                        className="ml-4 inline-flex items-center px-3 py-1 border border-yellow-300 shadow-sm text-sm font-medium rounded-md text-yellow-800 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                    >
                                        Limpiar búsqueda
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p>
                                Mostrando {filteredServices.length} de {services.length} servicios
                                {filteredServices.length !== services.length && (
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            clearError();
                                        }}
                                        className="ml-2 text-blue-600 hover:text-blue-800 underline"
                                    >
                                        Limpiar búsqueda
                                    </button>
                                )}
                            </p>
                        )}
                    </div>
                )}
                
                <ServicesTable
                    services={filteredServices}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isLoading={isLoading}
                />
            </div>

            {/* Modales */}
            <AddServiceModal
                isOpen={showAddModal}
                onClose={handleClose}
            />

            {selectedService && (
                <EditServiceModal
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedService(null);
                    }}
                    onSuccess={handleEditSuccess}
                    service={selectedService}
                />
            )}

            <DeleteServiceModal
                isOpen={showDeleteModal}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                service={serviceToDelete}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default ServicesPage;

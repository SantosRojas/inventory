import { useState, useCallback, useEffect } from 'react';
import { Plus, Building2, Search } from 'lucide-react';
import type { InstitutionExtended } from '../types';

import { useInstitutionStore } from "../store";
import { useInstitutionActions, useInstitutionSearch } from "../hooks";
import { useNotifications } from '../../../hooks/useNotifications';
import { InstitutionsTable } from "../components";
import { 
    AddInstitutionModal, 
    EditInstitutionModal, 
    DeleteInstitutionModal 
} from "../modals";

const InstitutionsPage = () => {
    const { 
        institutions, 
        isLoading, 
        error, 
        fetchAllInstitutions,
        clearError 
    } = useInstitutionStore();
    
    const { remove, errorAction } = useInstitutionActions();
    const { notifySuccess, notifyError } = useNotifications();
    
    // Hook personalizado para búsqueda
    const {
        searchTerm,
        setSearchTerm,
        filteredInstitutions,
        isLastFilteredInstitution
    } = useInstitutionSearch(institutions);

    // Estados para modales
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Estados para operaciones CRUD
    const [selectedInstitution, setSelectedInstitution] = useState<InstitutionExtended | null>(null);
    const [institutionToDelete, setInstitutionToDelete] = useState<InstitutionExtended | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Cargar instituciones al montar el componente
    useEffect(() => {
        if (institutions.length === 0 && !isLoading) {
            fetchAllInstitutions();
        }
    }, [institutions.length, isLoading, fetchAllInstitutions]); // Dependencias necesarias

    // Manejar notificaciones de error automáticamente
    useEffect(() => {
        if (errorAction) {
            notifyError(errorAction);
        }
    }, [errorAction, notifyError]);

    // Handlers para operaciones CRUD
    const handleAdd = useCallback(() => {
        setShowAddModal(true);
    }, []);

    const handleAddSuccess = useCallback(() => {
        setShowAddModal(false);
        // El store ya se actualiza automáticamente
    }, []);

    const handleEdit = useCallback((institution: InstitutionExtended) => {
        setSelectedInstitution(institution);
        setShowEditModal(true);
    }, []);

    const handleEditSuccess = useCallback(() => {
        setShowEditModal(false);
        setSelectedInstitution(null);
        // El store ya se actualiza automáticamente
    }, []);

    const handleDelete = useCallback((institution: InstitutionExtended) => {
        setInstitutionToDelete(institution);
        setShowDeleteModal(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!institutionToDelete) return;

        setIsDeleting(true);
        const success = await remove(institutionToDelete.id);
        
        if (success) {
            notifySuccess(`Institución "${institutionToDelete.name}" eliminada exitosamente`);
            setShowDeleteModal(false);
            setInstitutionToDelete(null);
            
            // Si la institución eliminada era la última en el filtro, limpiar búsqueda
            if (isLastFilteredInstitution(institutionToDelete.id)) {
                setSearchTerm('');
                clearError();
            }
        }
        
        setIsDeleting(false);
    }, [institutionToDelete, remove, notifySuccess, isLastFilteredInstitution, setSearchTerm, clearError]);

    const handleCancelDelete = useCallback(() => {
        setShowDeleteModal(false);
        setInstitutionToDelete(null);
    }, []);


    if (error) {
        console.error('Error al cargar instituciones:', error);
        return (
            <div className="flex flex-col h-full w-full items-center justify-center bg-gray-50">
                <div className="text-center p-8">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <Building2 className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Error al cargar instituciones</h3>
                    <p className="mt-1 text-sm text-gray-500">{error}</p>
                    <div className="mt-6">
                        <button
                            onClick={() => {
                                setSearchTerm(''); // Limpiar búsqueda
                                clearError(); // Limpiar error
                                fetchAllInstitutions(); // Recargar datos
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
        <div className="flex flex-col h-full w-full overflow-hidden gap-4 p-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Building2 className="h-6 w-6" />
                        Instituciones
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Gestiona las instituciones del sistema
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Buscador */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar instituciones..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    {/* Botón Agregar */}
                    <button
                        onClick={handleAdd}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Institución
                    </button>
                </div>
            </div>

            {/* Tabla */}
            <div className="flex-1 overflow-hidden">
                {/* Contador de resultados */}
                {searchTerm && (
                    <div className="mb-4 text-sm text-gray-600">
                        {filteredInstitutions.length === 0 ? (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-yellow-800">
                                        No se encontraron instituciones que coincidan con "<strong>{searchTerm}</strong>"
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
                                Mostrando {filteredInstitutions.length} de {institutions.length} instituciones
                                {filteredInstitutions.length !== institutions.length && (
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
                
                <InstitutionsTable
                    institutions={filteredInstitutions}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isLoading={isLoading}
                />
            </div>

            {/* Modales */}
            <AddInstitutionModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={handleAddSuccess}
            />

            {selectedInstitution && (
                <EditInstitutionModal
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedInstitution(null);
                    }}
                    onSuccess={handleEditSuccess}
                    institution={selectedInstitution}
                />
            )}

            <DeleteInstitutionModal
                isOpen={showDeleteModal}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                institution={institutionToDelete}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default InstitutionsPage;

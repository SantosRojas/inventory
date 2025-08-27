import { useState, useCallback, useEffect, useMemo } from 'react';
import { Users, Search } from 'lucide-react';
import type { UserExtended } from '../types';

import { useUserStore } from "../store";
import { useUserPermissions } from "../hooks";
import { useNotifications } from '../../../hooks/useNotifications';
import { UsersTable } from "../components";
import { 
    EditUserModal, 
    ChangePasswordModal, 
    DeleteUserModal 
} from "../modals";
import { PageLoader } from '../../../components';

const UsersPage = () => {
    const { 
        users, 
        isLoading, 
        error, 
        fetchAllUsers,
        removeUser,
        clearError 
    } = useUserStore();

    const { isAdmin, isRoot, currentUser } = useUserPermissions();
    const { notifySuccess, notifyError } = useNotifications();

    const isAdminOrRoot = isAdmin || isRoot;

    // Estados búsqueda
    const [searchTerm, setSearchTerm] = useState("");

    // Búsqueda dinámica: filtra en tiempo real
    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users;
        const lower = searchTerm.toLowerCase();
        return users.filter(u =>
            `${u.firstName} ${u.lastName}`.toLowerCase().includes(lower) ||
            u.email?.toLowerCase().includes(lower)
        );
    }, [searchTerm, users]);

    // Estados modales
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Estados CRUD
    const [selectedUser, setSelectedUser] = useState<UserExtended | null>(null);
    const [userToDelete, setUserToDelete] = useState<UserExtended | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Cargar usuarios al montar
    useEffect(() => {
        fetchAllUsers();
    }, [fetchAllUsers]);

    const resetSearch = useCallback(() => {
        setSearchTerm('');
        clearError();
    }, [clearError]);

    const handleEdit = useCallback((user: UserExtended) => {
        setSelectedUser(user);
        setShowEditModal(true);
    }, []);

    const handleChangePassword = useCallback((user: UserExtended) => {
        setSelectedUser(user);
        setShowPasswordModal(true);
    }, []);

    const handleDelete = useCallback((user: UserExtended) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!userToDelete) return;

        setIsDeleting(true);
        try {
            const success = await removeUser(userToDelete.id);
            
            if (success) {
                notifySuccess(`Usuario "${userToDelete.firstName} ${userToDelete.lastName}" eliminado`);
                setShowDeleteModal(false);
                setUserToDelete(null);

                // Si era el último filtrado, reseteamos búsqueda
                if (filteredUsers.length === 1) {
                    resetSearch();
                }
            }
        } catch (error) {
            notifyError(error instanceof Error ? error.message : 'Error al eliminar el usuario');
        } finally {
            setIsDeleting(false);
        }
    }, [userToDelete, removeUser, notifySuccess, notifyError, filteredUsers.length, resetSearch]);

    if (isLoading) return <PageLoader />;

    if (error) {
        return (
            <div className="flex flex-col h-full w-full items-center justify-center bg-gray-50">
                <div className="text-center p-8">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <Users className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Error al cargar usuarios</h3>
                    <p className="mt-1 text-sm text-gray-500">{error}</p>
                    <div className="mt-6">
                        <button
                            onClick={() => { resetSearch(); fetchAllUsers(); }}
                            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
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
                        <Users className="h-6 w-6" />
                        {isAdminOrRoot ? 'Gestión de Usuarios' : 'Mi Perfil'}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {isAdminOrRoot ? 'Gestiona los usuarios del sistema' : 'Consulta y edita tu información personal'}
                    </p>
                </div>

                {/* Buscador dinámico solo para admins */}
                {isAdminOrRoot && users.length > 1 && (
                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar usuarios..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                )}
            </div>

            {/* Contador resultados */}
            {isAdmin && searchTerm && (
                <div className="mb-2 text-sm text-gray-600">
                    {filteredUsers.length === 0 ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                            No se encontraron resultados para "<strong>{searchTerm}</strong>"
                            <button
                                onClick={resetSearch}
                                className="ml-2 text-blue-600 hover:text-blue-800 underline"
                            >
                                Limpiar
                            </button>
                        </div>
                    ) : (
                        <p>
                            Mostrando {filteredUsers.length} de {users.length} usuarios
                            <button
                                onClick={resetSearch}
                                className="ml-2 text-blue-600 hover:text-blue-800 underline"
                            >
                                Limpiar
                            </button>
                        </p>
                    )}
                </div>
            )}

            {/* Tabla */}
            <div className="flex-1 overflow-hidden">
                <UsersTable
                    users={filteredUsers}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onChangePassword={handleChangePassword}
                    isLoading={isLoading}
                    currentUserId={currentUser?.id || undefined}
                />
            </div>

            {/* Modales */}
            {selectedUser && (
                <>
                    <EditUserModal
                        isOpen={showEditModal}
                        onClose={() => { setShowEditModal(false); setSelectedUser(null); }}
                        onSuccess={() => { setShowEditModal(false); setSelectedUser(null); }}
                        user={selectedUser}
                    />
                    <ChangePasswordModal
                        isOpen={showPasswordModal}
                        onClose={() => { setShowPasswordModal(false); setSelectedUser(null); }}
                        onSuccess={() => { setShowPasswordModal(false); setSelectedUser(null); }}
                        user={selectedUser}
                    />
                </>
            )}

            <DeleteUserModal
                isOpen={showDeleteModal}
                onClose={() => { setShowDeleteModal(false); setUserToDelete(null); }}
                onConfirm={handleConfirmDelete}
                user={userToDelete}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default UsersPage;

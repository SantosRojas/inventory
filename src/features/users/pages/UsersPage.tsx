import { useState, useCallback, useEffect } from 'react';
import { Users, Search } from 'lucide-react';
import type { UserExtended } from '../types';

import { useUserStore } from "../store";
import { useUserSearch, useUserPermissions } from "../hooks";
import { useNotifications } from '../../../hooks/useNotifications';
import { UsersTable } from "../components";
import { 
    EditUserModal, 
    ChangePasswordModal, 
    DeleteUserModal 
} from "../modals";

const UsersPage = () => {
    const { 
        users, 
        isLoading, 
        error, 
        fetchAllUsers,
        removeUser,
        clearError 
    } = useUserStore();
    
    // Hook de permisos para controlar acceso
    const {
        canEditUser,
        canDeleteUser,
        canChangeUserPassword,
        getFilteredUsers,
        isAdmin,
        currentUserId
    } = useUserPermissions();
    
    const { notifySuccess, notifyError } = useNotifications();
    
    // Filtrar usuarios según permisos
    const allowedUsers = getFilteredUsers(users);
    
    // Hook personalizado para búsqueda (solo sobre usuarios permitidos)
    const {
        searchTerm,
        setSearchTerm,
        filteredUsers,
        isLastFilteredUser
    } = useUserSearch(allowedUsers);

    // Estados para modales
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Estados para operaciones CRUD
    const [selectedUser, setSelectedUser] = useState<UserExtended | null>(null);
    const [userToDelete, setUserToDelete] = useState<UserExtended | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Cargar usuarios al montar el componente
    useEffect(() => {
        fetchAllUsers();
    }, [fetchAllUsers]);

    const handleEdit = useCallback((user: UserExtended) => {
        if (!canEditUser(user)) {
            notifyError('No tienes permisos para editar este usuario');
            return;
        }
        setSelectedUser(user);
        setShowEditModal(true);
    }, [canEditUser, notifyError]);

    const handleEditSuccess = useCallback(() => {
        setShowEditModal(false);
        setSelectedUser(null);
        // El store ya se actualiza automáticamente
    }, []);

    const handleChangePassword = useCallback((user: UserExtended) => {
        if (!canChangeUserPassword(user)) {
            notifyError('No tienes permisos para cambiar la contraseña de este usuario');
            return;
        }
        setSelectedUser(user);
        setShowPasswordModal(true);
    }, [canChangeUserPassword, notifyError]);

    const handlePasswordSuccess = useCallback(() => {
        setShowPasswordModal(false);
        setSelectedUser(null);
    }, []);

    const handleDelete = useCallback((user: UserExtended) => {
        if (!canDeleteUser(user)) {
            notifyError('No tienes permisos para eliminar este usuario');
            return;
        }
        setUserToDelete(user);
        setShowDeleteModal(true);
    }, [canDeleteUser, notifyError]);

    const handleConfirmDelete = useCallback(async () => {
        if (!userToDelete) return;

        setIsDeleting(true);
        try {
            const success = await removeUser(userToDelete.id);
            
            if (success) {
                notifySuccess(`Usuario "${userToDelete.firstName} ${userToDelete.lastName}" eliminado exitosamente`);
                setShowDeleteModal(false);
                setUserToDelete(null);
                
                // Si el usuario eliminado era el último en el filtro, limpiar búsqueda
                if (isLastFilteredUser(userToDelete.id)) {
                    setSearchTerm('');
                    clearError();
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                notifyError(error.message);
            } else {
                notifyError('Error al eliminar el usuario');
            }
        } finally {
            setIsDeleting(false);
        }
    }, [userToDelete, removeUser, notifySuccess, notifyError, isLastFilteredUser, setSearchTerm, clearError]);

    const handleCancelDelete = useCallback(() => {
        setShowDeleteModal(false);
        setUserToDelete(null);
    }, []);

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
                            onClick={() => {
                                setSearchTerm(''); // Limpiar búsqueda
                                clearError(); // Limpiar error
                                fetchAllUsers(); // Recargar datos
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
                        <Users className="h-6 w-6" />
                        {isAdmin ? 'Gestión de Usuarios' : 'Mi Perfil'}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {isAdmin ? 'Gestiona los usuarios del sistema' : 'Consulta y edita tu información personal'}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    {/* Buscador - solo mostrar para admins si hay múltiples usuarios */}
                    {isAdmin && allowedUsers.length > 1 && (
                        <div className="relative w-full sm:w-auto">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar usuarios..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Tabla */}
            <div className="flex-1 overflow-hidden">
                {/* Contador de resultados - solo para admins */}
                {isAdmin && searchTerm && (
                    <div className="mb-4 text-sm text-gray-600">
                        {filteredUsers.length === 0 ? (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-yellow-800">
                                        No se encontraron usuarios que coincidan con "<strong>{searchTerm}</strong>"
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
                                Mostrando {filteredUsers.length} de {allowedUsers.length} usuarios
                                {filteredUsers.length !== allowedUsers.length && (
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
                
                <UsersTable
                    users={filteredUsers}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onChangePassword={handleChangePassword}
                    isLoading={isLoading}
                    currentUserId={currentUserId || undefined}
                    permissions={{
                        canEditUser,
                        canDeleteUser,
                        canChangeUserPassword
                    }}
                />
            </div>

            {/* Modales */}
            {selectedUser && (
                <>
                    <EditUserModal
                        isOpen={showEditModal}
                        onClose={() => {
                            setShowEditModal(false);
                            setSelectedUser(null);
                        }}
                        onSuccess={handleEditSuccess}
                        user={selectedUser}
                    />

                    <ChangePasswordModal
                        isOpen={showPasswordModal}
                        onClose={() => {
                            setShowPasswordModal(false);
                            setSelectedUser(null);
                        }}
                        onSuccess={handlePasswordSuccess}
                        user={selectedUser}
                    />
                </>
            )}

            <DeleteUserModal
                isOpen={showDeleteModal}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                user={userToDelete}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default UsersPage;

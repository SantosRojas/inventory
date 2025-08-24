import { memo, useCallback } from 'react';
import { Edit, Trash2, User, Key, Mail, Phone, Calendar } from 'lucide-react';
import type { UserExtended } from '../types';
import { getRoleDisplayName } from '../../../services/rolesService';

interface UsersTableProps {
    users: UserExtended[];
    onEdit: (user: UserExtended) => void;
    onDelete: (user: UserExtended) => void;
    onChangePassword: (user: UserExtended) => void;
    isLoading?: boolean;
    currentUserId?: number;
    permissions?: {
        canEditUser: (user: UserExtended) => boolean;
        canDeleteUser: (user: UserExtended) => boolean;
        canChangeUserPassword: (user: UserExtended) => boolean;
    };
}

// Mapeo de roles para mostrar
const roleLabels: Record<string, string> = {
    admin: 'Administrador',
    sales_representative: 'Representante de Ventas',
    technician: 'Técnico',
    guest: 'Invitado',
    user: 'Usuario',
    superadmin: 'Super Admin'
};

// Colores para los roles
const roleColors: Record<string, string> = {
    admin: 'bg-blue-100 text-blue-800',
    sales_representative: 'bg-green-100 text-green-800',
    technician: 'bg-yellow-100 text-yellow-800',
    guest: 'bg-gray-100 text-gray-800',
    user: 'bg-green-100 text-green-800', 
    superadmin: 'bg-purple-100 text-purple-800'
};

// Función helper para obtener el label y color del rol
const getRoleInfo = (user: UserExtended) => {
    const roleName = user.role || 'guest';
    const label = roleLabels[roleName] || getRoleDisplayName(roleName);
    const colorClass = roleColors[roleName] || 'bg-gray-100 text-gray-800';
    
    return { label, colorClass };
};

// Componente UserCard memoizado
const UserCard = memo(({ 
    user, 
    onEdit, 
    onDelete, 
    onChangePassword,
    currentUserId,
    permissions
}: {
    user: UserExtended;
    onEdit: (user: UserExtended) => void;
    onDelete: (user: UserExtended) => void;
    onChangePassword: (user: UserExtended) => void;
    currentUserId?: number;
    permissions?: {
        canEditUser: (user: UserExtended) => boolean;
        canDeleteUser: (user: UserExtended) => boolean;
        canChangeUserPassword: (user: UserExtended) => boolean;
    };
}) => {
    const handleEdit = useCallback(() => onEdit(user), [onEdit, user]);
    const handleDelete = useCallback(() => onDelete(user), [onDelete, user]);
    const handleChangePassword = useCallback(() => onChangePassword(user), [onChangePassword, user]);
    
    const isCurrentUser = currentUserId === user.id;
    
    // Verificar permisos
    const canEdit = permissions?.canEditUser(user) ?? true;
    const canDelete = permissions?.canDeleteUser(user) ?? !isCurrentUser;
    const canChangePassword = permissions?.canChangeUserPassword(user) ?? true;

    // Obtener información del rol
    const { label: roleLabel, colorClass: roleColorClass } = getRoleInfo(user);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            {/* Header con avatar y nombre */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-500" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {user.firstName} {user.lastName}
                        </h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleColorClass}`}>
                            {roleLabel}
                        </span>
                    </div>
                </div>
                {isCurrentUser && (
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Tú
                    </span>
                )}
            </div>

            {/* Información de contacto */}
            <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{user.cellPhone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span>Registrado el {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

            {/* Acciones */}
            <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                {canEdit && (
                    <button
                        onClick={handleEdit}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors"
                        title="Editar usuario"
                        aria-label={`Editar ${user.firstName} ${user.lastName}`}
                    >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                    </button>
                )}
                {canChangePassword && (
                    <button
                        onClick={handleChangePassword}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-yellow-600 bg-yellow-50 rounded-lg hover:bg-yellow-100 hover:text-yellow-700 transition-colors"
                        title="Cambiar contraseña"
                        aria-label={`Cambiar contraseña de ${user.firstName} ${user.lastName}`}
                    >
                        <Key className="h-4 w-4 mr-1" />
                        Contraseña
                    </button>
                )}
                {canDelete && (
                    <button
                        onClick={handleDelete}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors"
                        title="Eliminar usuario"
                        aria-label={`Eliminar ${user.firstName} ${user.lastName}`}
                    >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar
                    </button>
                )}
            </div>
        </div>
    );
});

UserCard.displayName = 'UserCard';

const UsersTable = memo(({
    users,
    onEdit,
    onDelete,
    onChangePassword,
    isLoading = false,
    currentUserId,
    permissions
}: UsersTableProps) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="animate-pulse">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                                </div>
                            </div>
                            <div className="space-y-3 mb-4">
                                <div className="h-3 bg-gray-200 rounded w-full"></div>
                                <div className="h-3 bg-gray-200 rounded w-24"></div>
                                <div className="h-3 bg-gray-200 rounded w-32"></div>
                            </div>
                            <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                                <div className="h-8 bg-gray-200 rounded w-16"></div>
                                <div className="h-8 bg-gray-200 rounded w-20"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!users || users.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-8 text-center">
                    <User className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay usuarios</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Comienza agregando un nuevo usuario.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {users.map((user, index) => (
                <UserCard
                    key={user.id ? `user-${user.id}` : `temp-${index}`}
                    user={user}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onChangePassword={onChangePassword}
                    currentUserId={currentUserId}
                    permissions={permissions}
                />
            ))}
        </div>
    );
});

UsersTable.displayName = 'UsersTable';

export default UsersTable;

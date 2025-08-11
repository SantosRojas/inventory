import { memo, useCallback } from 'react';
import { Edit, Trash2, User, Key, Mail, Phone } from 'lucide-react';
import type { UserExtended } from '../types';
import { getRoleDisplayName } from '../../../services/rolesService';

interface UsersTableProps {
    users: UserExtended[];
    onEdit: (user: UserExtended) => void;
    onDelete: (user: UserExtended) => void;
    onChangePassword: (user: UserExtended) => void;
    isLoading?: boolean;
    currentUserId?: number; // Para evitar que el usuario se elimine a sí mismo
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
    // Mantener compatibilidad con roles anteriores
    user: 'Usuario',
    superadmin: 'Super Admin'
};

// Colores para los roles
const roleColors: Record<string, string> = {
    admin: 'bg-blue-100 text-blue-800',
    sales_representative: 'bg-green-100 text-green-800',
    technician: 'bg-yellow-100 text-yellow-800',
    guest: 'bg-gray-100 text-gray-800',
    // Mantener compatibilidad con roles anteriores
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

// Componente de fila memoizado para evitar re-renders innecesarios
const UserRow = memo(({ 
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
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                        </div>
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 flex items-center">
                    <Phone className="h-3 w-3 mr-1" />
                    {user.cellPhone}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleColorClass}`}>
                    {roleLabel}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(user.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                    {canEdit && (
                        <button
                            onClick={handleEdit}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                            title="Editar usuario"
                            aria-label={`Editar ${user.firstName} ${user.lastName}`}
                        >
                            <Edit className="h-4 w-4" />
                        </button>
                    )}
                    {canChangePassword && (
                        <button
                            onClick={handleChangePassword}
                            className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50 transition-colors"
                            title="Cambiar contraseña"
                            aria-label={`Cambiar contraseña de ${user.firstName} ${user.lastName}`}
                        >
                            <Key className="h-4 w-4" />
                        </button>
                    )}
                    {canDelete && (
                        <button
                            onClick={handleDelete}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Eliminar usuario"
                            aria-label={`Eliminar ${user.firstName} ${user.lastName}`}
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
});

UserRow.displayName = 'UserRow';

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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-16 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Vista Desktop */}
            <div className="hidden lg:block">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Usuario
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Teléfono
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rol
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha de registro
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user, index) => (
                            <UserRow
                                key={user.id ? `user-${user.id}` : `temp-${index}`}
                                user={user}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onChangePassword={onChangePassword}
                                currentUserId={currentUserId}
                                permissions={permissions}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Vista Mobile/Tablet */}
            <div className="lg:hidden">
                <div className="divide-y divide-gray-200">
                    {users.map((user, index) => {
                        const { label: roleLabel, colorClass: roleColorClass } = getRoleInfo(user);
                        
                        return (
                            <div key={user.id ? `mobile-user-${user.id}` : `mobile-temp-${index}`} className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                <User className="h-5 w-5 text-gray-500" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900">
                                                {user.firstName} {user.lastName}
                                            </h3>
                                            <p className="text-sm text-gray-500 flex items-center">
                                                <Mail className="h-3 w-3 mr-1" />
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 space-y-1">
                                        <p className="text-sm text-gray-500 flex items-center">
                                            <Phone className="h-3 w-3 mr-1" />
                                            {user.cellPhone}
                                        </p>
                                        <div className="flex items-center space-x-2">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleColorClass}`}>
                                                {roleLabel}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-2 ml-4">
                                    {(permissions?.canEditUser(user) ?? true) && (
                                        <button
                                            onClick={() => onEdit(user)}
                                            className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50"
                                            title="Editar"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                    )}
                                    {(permissions?.canChangeUserPassword(user) ?? true) && (
                                        <button
                                            onClick={() => onChangePassword(user)}
                                            className="text-yellow-600 hover:text-yellow-900 p-2 rounded hover:bg-yellow-50"
                                            title="Cambiar contraseña"
                                        >
                                            <Key className="h-4 w-4" />
                                        </button>
                                    )}
                                    {(permissions?.canDeleteUser(user) ?? currentUserId !== user.id) && (
                                        <button
                                            onClick={() => onDelete(user)}
                                            className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
});

UsersTable.displayName = 'UsersTable';

export default UsersTable;

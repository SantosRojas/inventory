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
}

// Mapeo de roles para mostrar
const roleLabels: Record<string, string> = {
    root: 'Root',
    admin: 'Administrador',
    sales_representative: 'Representante de Ventas',
    technician: 'Técnico',
    guest: 'Invitado',
    supervisor: 'Supervisor'
};

// Colores para los roles
const roleColors: Record<string, string> = {
    root: 'bg-red-200 text-red-900',                // Más suave, pero aún indica peligro o privilegios altos
    admin: 'bg-indigo-200 text-indigo-900',         // Más sofisticado que el azul puro
    sales_representative: 'bg-emerald-200 text-emerald-900', // Verde moderno y más profesional
    technician: 'bg-amber-200 text-amber-900',       // Amarillo más cálido, mejor contraste
    guest: 'bg-slate-200 text-slate-900',           // Más neutral y moderno que gray
    supervisor: 'bg-violet-200 text-violet-900'
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
    currentUserId
}: {
    user: UserExtended;
    onEdit: (user: UserExtended) => void;
    onDelete: (user: UserExtended) => void;
    onChangePassword: (user: UserExtended) => void;
    currentUserId?: number;
}) => {
    const handleEdit = useCallback(() => onEdit(user), [onEdit, user]);
    const handleDelete = useCallback(() => onDelete(user), [onDelete, user]);
    const handleChangePassword = useCallback(() => onChangePassword(user), [onChangePassword, user]);

    const isCurrentUser = currentUserId === user.id;

    // Simplificado: Si el usuario está en la lista, se pueden realizar todas las acciones
    // excepto eliminarse a sí mismo o eliminar root
    const canEdit = true;
    const canDelete = !isCurrentUser && user.role !== 'root';
    const canChangePassword = true;

    // Obtener información del rol
    const { label: roleLabel, colorClass: roleColorClass } = getRoleInfo(user);

    return (
        <div className="rounded-xl shadow-sm border p-2 sm:p-4 hover:shadow-md transition-all duration-200"
            style={{
                backgroundColor: 'var(--color-bg-card)',
                borderColor: 'var(--color-border)',
                boxShadow: 'var(--shadow-sm)'
            }}
        >
            {/* Header con avatar y nombre */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
                            <User className="h-6 w-6" style={{ color: 'var(--color-text-muted)' }} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
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
                <div className="flex items-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    <Mail className="h-4 w-4 mr-2" style={{ color: 'var(--color-text-muted)' }} />
                    <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    <Phone className="h-4 w-4 mr-2" style={{ color: 'var(--color-text-muted)' }} />
                    <span>{user.cellPhone}</span>
                </div>
                <div className="flex items-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    <Calendar className="h-4 w-4 mr-2" style={{ color: 'var(--color-text-muted)' }} />
                    <span>Registrado el {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

            {/* Acciones */}
            <div className="flex justify-end space-x-2 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                {canEdit && (
                    <button
                        onClick={handleEdit}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105"
                        style={{
                            color: 'var(--color-primary)',
                            backgroundColor: 'var(--color-primary-light)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-primary-light)';
                        }}
                        title="Editar usuario"
                        aria-label={`Editar ${user.firstName} ${user.lastName}`}
                    >
                        <Edit className="h-4 w-4" />
                        <span className="ml-1 hidden sm:inline lg:hidden xl:inline">Editar</span>
                    </button>
                )}
                {canChangePassword && (
                    <button
                        onClick={handleChangePassword}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105"
                        style={{
                            color: 'var(--color-warning)',
                            backgroundColor: 'var(--color-warning-light)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-warning-light)';
                        }}
                        title="Cambiar contraseña"
                        aria-label={`Cambiar contraseña de ${user.firstName} ${user.lastName}`}
                    >
                        <Key className="h-4 w-4" />
                        <span className="ml-1 hidden sm:inline lg:hidden xl:inline">Contraseña</span>
                    </button>
                )}
                {canDelete && (
                    <button
                        onClick={handleDelete}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105"
                        style={{
                            color: 'var(--color-error)',
                            backgroundColor: 'var(--color-error-light)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-error-light)';
                        }}
                        title="Eliminar usuario"
                        aria-label={`Eliminar ${user.firstName} ${user.lastName}`}
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="ml-1 hidden sm:inline lg:hidden xl:inline">Eliminar</span>
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
    currentUserId
}: UsersTableProps) => {
    if (isLoading) {
        return (
            <div
                className="max-h-96 overflow-y-auto scrollbar-none"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-1">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="rounded-xl shadow-sm border p-6"
                            style={{
                                backgroundColor: 'var(--color-bg-card)',
                                borderColor: 'var(--color-border)'
                            }}>
                            <div className="animate-pulse">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="h-12 w-12 rounded-full" style={{ backgroundColor: 'var(--color-bg-secondary)' }}></div>
                                    <div className="space-y-2">
                                        <div className="h-4 rounded w-32" style={{ backgroundColor: 'var(--color-bg-secondary)' }}></div>
                                        <div className="h-3 rounded w-20" style={{ backgroundColor: 'var(--color-bg-secondary)' }}></div>
                                    </div>
                                </div>
                                <div className="space-y-3 mb-4">
                                    <div className="h-3 rounded w-full" style={{ backgroundColor: 'var(--color-bg-secondary)' }}></div>
                                    <div className="h-3 rounded w-24" style={{ backgroundColor: 'var(--color-bg-secondary)' }}></div>
                                    <div className="h-3 rounded w-32" style={{ backgroundColor: 'var(--color-bg-secondary)' }}></div>
                                </div>
                                <div className="flex justify-end space-x-2 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                                    <div className="h-8 rounded w-16" style={{ backgroundColor: 'var(--color-bg-secondary)' }}></div>
                                    <div className="h-8 rounded w-20" style={{ backgroundColor: 'var(--color-bg-secondary)' }}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!users || users.length === 0) {
        return (
            <div className="rounded-xl shadow-sm border"
                style={{
                    backgroundColor: 'var(--color-bg-card)',
                    borderColor: 'var(--color-border)'
                }}>
                <div className="p-8 text-center">
                    <User className="mx-auto h-12 w-12" style={{ color: 'var(--color-text-muted)' }} />
                    <h3 className="mt-2 text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>No hay usuarios</h3>
                    <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        Comienza agregando un nuevo usuario.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="max-h-[calc(100vh-20rem)] sm:max-h-[calc(100vh-15rem)] overflow-y-auto scrollbar-none"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-1">
                {users.map((user, index) => (
                    <UserCard
                        key={user.id ? `user-${user.id}` : `temp-${index}`}
                        user={user}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onChangePassword={onChangePassword}
                        currentUserId={currentUserId}
                    />
                ))}
            </div>
        </div>
    );
});

UsersTable.displayName = 'UsersTable';

export default UsersTable;

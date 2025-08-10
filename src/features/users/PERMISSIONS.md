# Sistema de Permisos de Usuario

## Descripción General

El sistema implementa un control de acceso basado en roles para la gestión de usuarios, diferenciando entre administradores y usuarios regulares.

## Roles de Usuario

### Admin / Superadmin
- **Vista**: Puede ver todos los usuarios del sistema
- **Edición**: Puede editar toda la información de cualquier usuario, incluyendo roles
- **Eliminación**: Puede eliminar cualquier usuario (excepto a sí mismo)
- **Contraseñas**: Puede resetear contraseñas de otros usuarios sin necesidad de conocer la contraseña actual

### Usuario Regular
- **Vista**: Solo puede ver su propio perfil
- **Edición**: Solo puede editar su propia información personal (nombre, apellido, teléfono, email)
- **Restricciones**: No puede cambiar su propio rol ni el de otros
- **Contraseñas**: Solo puede cambiar su propia contraseña (requiere contraseña actual)

## Funcionalidades por Rol

### Para Administradores

#### Gestión de Usuarios
```typescript
// Hook de permisos
const {
    canEditUser,           // true para cualquier usuario
    canDeleteUser,         // true para cualquier usuario (excepto sí mismo)
    canChangeUserPassword, // true para cualquier usuario
    canEditUserRole,       // true para otros usuarios
    getFilteredUsers       // devuelve todos los usuarios
} = useUserPermissions();
```

#### Interfaz de Usuario
- **Título**: "Gestión de Usuarios"
- **Búsqueda**: Disponible para filtrar usuarios
- **Acciones**: Editar, Eliminar, Cambiar contraseña para todos los usuarios
- **Modal de Edición**: Incluye campo de rol editable
- **Modal de Contraseña**: Modo "Reseteo administrativo" (sin contraseña actual)

### Para Usuarios Regulares

#### Perfil Personal
```typescript
// Hook de permisos para usuario regular
const {
    canEditUser,           // true solo para sí mismo
    canDeleteUser,         // false para todos
    canChangeUserPassword, // true solo para sí mismo
    canEditUserRole,       // false para todos
    getFilteredUsers       // devuelve solo su propio usuario
} = useUserPermissions();
```

#### Interfaz de Usuario
- **Título**: "Mi Perfil"
- **Búsqueda**: No disponible (solo un usuario)
- **Acciones**: Editar y cambiar contraseña solo para sí mismo
- **Modal de Edición**: Campo de rol en modo solo lectura
- **Modal de Contraseña**: Requiere contraseña actual

## Componentes Principales

### useUserPermissions Hook
```typescript
// Hook personalizado que maneja toda la lógica de permisos
export const useUserPermissions = () => {
    // ... lógica de permisos basada en el usuario actual
    return {
        canEditUser: (targetUser) => boolean,
        canDeleteUser: (targetUser) => boolean,
        canChangeUserPassword: (targetUser) => boolean,
        canEditUserRole: (targetUser) => boolean,
        getFilteredUsers: (users) => UserExtended[],
        isAdmin: boolean,
        currentUserId: number | null
    };
};
```

### UsersTable Component
- Recibe props de permisos para mostrar/ocultar acciones
- Adapta botones según permisos del usuario actual
- Funciona tanto en vista desktop como móvil

### EditUserModal Component
- Condiciona la edición de roles según permisos
- Muestra campo de rol como solo lectura para usuarios regulares
- Incluye mensajes informativos contextuales

### ChangePasswordModal Component
- Esquemas de validación dinámicos según contexto
- Campo de contraseña actual opcional para reseteos administrativos
- Mensajes diferentes para cambio propio vs. reseteo administrativo

## Seguridad

### Validación en Frontend
- Verificación de permisos antes de mostrar acciones
- Validación de formularios según contexto del usuario
- Mensajes de error apropiados para acciones no permitidas

### Validación Recomendada en Backend
```typescript
// Ejemplo de validación en API
if (currentUser.role !== 'admin' && targetUserId !== currentUser.id) {
    throw new Error('No tienes permisos para realizar esta acción');
}
```

## Flujo de Uso

### Administrador
1. Accede a "Gestión de Usuarios"
2. Ve lista completa de usuarios
3. Puede buscar, editar, eliminar o cambiar contraseñas
4. Al editar: puede cambiar roles de otros usuarios
5. Al cambiar contraseña: no necesita contraseña actual

### Usuario Regular
1. Accede a "Mi Perfil"
2. Ve solo su información personal
3. Puede editar sus datos personales
4. Al editar: rol aparece como solo lectura
5. Al cambiar contraseña: debe proporcionar contraseña actual

## Beneficios

1. **Seguridad**: Control granular de acceso basado en roles
2. **UX Diferenciada**: Interfaz adaptada según permisos del usuario
3. **Mantenibilidad**: Lógica centralizada en hooks reutilizables
4. **Escalabilidad**: Fácil agregar nuevos roles o permisos
5. **Consistencia**: Aplicación uniforme de permisos en toda la aplicación

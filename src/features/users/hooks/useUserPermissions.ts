import { useAuthStore } from "../../auth/store/store";
import type { UserExtended } from "../types";

export const useUserPermissions = () => {
  const { user: currentUser } = useAuthStore();

  const isRoot = currentUser?.role === "root";
  const isAdmin = currentUser?.role === "admin";

  const canEditUserPersonalInfo = (target: UserExtended): boolean => {
    return currentUser?.id === target.id; // solo a sí mismo
  };

  const canEditUserRole = (target: UserExtended): boolean => {
    if (!currentUser) return false;
    return currentUser.id !== target.id; // puede editar roles de los demás
  };

  const canDeleteUser = (target: UserExtended): boolean => {
    if (!currentUser) return false;
    return currentUser.id !== target.id; // puede eliminar a todos menos a sí mismo
  };

  const canChangeUserPassword = (target: UserExtended): { allowed: boolean; needsCurrent: boolean } => {
    if (!currentUser) return { allowed: false, needsCurrent: false };

    // Cambiar mi propia contraseña → siempre requiere la actual
    if (currentUser.id === target.id) {
      return { allowed: true, needsCurrent: true };
    }

    // Root puede cambiar contraseñas de todos sin la actual
    if (isRoot) {
      return { allowed: true, needsCurrent: false };
    }

    // Admin puede cambiar contraseñas de usuarios normales sin la actual
    if (isAdmin && target.role !== "admin") {
      return { allowed: true, needsCurrent: false };
    }

    return { allowed: false, needsCurrent: false };
  };

  return {
    currentUser,
    isRoot,
    isAdmin,
    canEditUserPersonalInfo,
    canEditUserRole,
    canDeleteUser,
    canChangeUserPassword,
  };
};

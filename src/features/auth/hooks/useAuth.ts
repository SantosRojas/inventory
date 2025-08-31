import { useCallback, useEffect } from "react";
import { useAuthStore } from "../store/store";

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isLoading = useAuthStore((state) => state.isLoading);
  const rawValidateToken = useAuthStore((state) => state.validateToken);

  // ✅ Memoizamos validateToken para que no cambie de referencia
  const validateToken = useCallback(() => {
    return rawValidateToken();
  }, [rawValidateToken]);

  // ✅ Solo se ejecuta una vez mientras el token sea válido
  useEffect(() => {
    if (token && !user && !isLoading) {
      validateToken();
      console.log("Validando token...");
    }
  }, [token, user, isLoading, validateToken]);

  const isAuthenticated = !!token && !!user && !isLoading;
  const isAdmin = user?.role === "admin" || user?.role === "root";

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    isAdmin,
    validateToken, // lo devolvemos también por si lo necesitas
  };
};

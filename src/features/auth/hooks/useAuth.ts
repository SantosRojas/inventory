// features/auth/useAuth.ts
import { useAuthStore } from '../store/store.ts'

export const useAuth = () => {
    const user = useAuthStore((state) => state.user);
    const token = useAuthStore((state) => state.token);
    const isLoading = useAuthStore((state) => state.isLoading);

    const isAuthenticated = !!token && !!user && !isLoading;
    const isAdmin = user?.role === 'admin';

    return {
        user,
        token,
        isLoading,
        isAuthenticated,
        isAdmin,
    };
};


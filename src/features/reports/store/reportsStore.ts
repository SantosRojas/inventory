import { create } from 'zustand';
import { fetchReportsData, type ReportsData } from '../services/reportsFetcher';

interface ReportsStore {
    data: ReportsData | null;
    loading: boolean;
    error: string | null;
    loadedAt: string | null;
    getReportsData: (userId: number, token: string) => Promise<void>;
    clearError: () => void;
}

export const useReportsStore = create<ReportsStore>((set) => ({
    data: null,
    loading: false,
    error: null,
    loadedAt: null,

    getReportsData: async (userId: number, token: string) => {
        if (!userId || !token) {
            set({ error: 'Usuario o token no válido' });
            return;
        }

        set({ loading: true, error: null });

        try {
            const data = await fetchReportsData(userId, token);
            set({
                data,
                loading: false,
                error: null,
                loadedAt: new Date().toISOString(),
            });
        } catch (error) {
            console.error('Error al cargar datos de reportes:', error);
            set({
                loading: false,
                error: error instanceof Error ? error.message : 'Error desconocido al cargar reportes',
            });
        }
    },

    clearError: () => set({ error: null }),
}));

// src/store/useDashboardStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchDashboardData } from '../services/dashboardFetcher';
import type {
    SummaryResponse,
    ModelDistributionResponse,
    ModelDistributionByInstitutionResponse,
    InventoryProgressByInstitutionResponse,
    TopInventoryTakersResponse,
    OverdueMaintenanceResponse,
} from '../types';

interface DashboardState {
    data: { summary: SummaryResponse | null;
        modelDistribution: ModelDistributionResponse | null;
        modelDistributionByInstitution: ModelDistributionByInstitutionResponse | null;
        inventoryProgressByInstitution: InventoryProgressByInstitutionResponse | null;
        topInventoryTakers: TopInventoryTakersResponse | null;
        overdueMaintenance: OverdueMaintenanceResponse | null;
        loadedAt: string | null; } | null;
        loading: boolean; error: string | null;
        getDashboardData: () => Promise<void>; 
        clear: () => void;
}
export const useDashboardStore = create<DashboardState>()(
    persist(
        (set) => ({
            data: null,
            loading: false,
            error: null,

            getDashboardData: async () => {
                set({ loading: true, error: null });
                console.log("Cargando datos del dashboard...");

                try {
                    const dashboardData = await fetchDashboardData();

                    set({
                        data: {
                            ...dashboardData,
                            loadedAt: new Date().toISOString(),
                        },
                        loading: false,
                        error: null,
                    });
                } catch (err: unknown) {
                    console.error('Error en dashboardStore:', err);
                    set({
                        loading: false,
                        error:
                            err instanceof Error
                                ? err.message
                                : 'Error desconocido al cargar datos del dashboard',
                    });
                }
            },

            clear: () => set({ data: null, error: null, loading: false }),
        }),
        {
            name: 'dashboard-storage',
            partialize: (state) => ({
                data: state.data,
            }),
            version: 1,
        }
    )
);

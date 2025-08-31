import { create } from 'zustand';
import { API_ENDPOINTS } from '../../../config';
import type { Pump } from '../../../types';
import { fetchWithAuth } from '../../../services/fetchWithAuth';

interface LatestInventoriesState {
  latestInventories: Pump[];
  isLoading: boolean;
  error: string | null;
  limit: number;
  fetchLatestInventories: (limit?: number, userId?: number, token?: string) => Promise<void>;
  updateLimit: (newLimit: number) => void;
}

export const useLatestInventoriesStore = create<LatestInventoriesState>((set) => ({
  latestInventories: [],
  isLoading: false,
  error: null,
  limit: 10,

  fetchLatestInventories: async (requestedLimit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.pumps.getLastInventories(requestedLimit));
      const data = await response.json();
      if (!response.ok || data.success === false) {
        if(data.error === "No se encontraron inventarios para este usuario") {
          set({ latestInventories: [] });
        }
        else {
          throw new Error(data.message || data.error || 'Error al cargar últimos inventarios');
        }
      }
      set({ latestInventories: data.data || [] });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  updateLimit: (newLimit) => {
    if (newLimit > 0 && newLimit <= 100) {
      set({ limit: newLimit });
    }
  },
}));

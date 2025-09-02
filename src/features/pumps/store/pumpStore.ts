// features/pumps/store/pumpStore.ts
import { create } from "zustand";

import {
  getPumpByQRCode,
  getPumpBySerialNumber,
  createPump,
  updatePump,
  deletePump,
} from "../services/pumpService";
import type { CreatePump, Pump, UpdatePump } from "../../../types";

interface PumpState {
  pumpData: Pump[] | null;
  isLoading: boolean;
  error: string | null;

  fetchBySerie: (serie: string) => Promise<void>;
  fetchByQr: (qr: string) => Promise<void>;
  addPump: (data: CreatePump) => Promise<number | undefined>;
  updatePump: (id: number, data: UpdatePump) => Promise<boolean>;
  removePump: (id: number) => Promise<boolean>;
  clearPumpData: () => void;
  clearError: () => void;
}

export const usePumpStore = create<PumpState>((set) => ({
  pumpData: null,
  isLoading: false,
  error: null,

  fetchBySerie: async (serie) => {
    set({ isLoading: true, error: null });
    try {
      const pump = await getPumpBySerialNumber(serie);
      set({ pumpData: pump });
    } catch (err: any) {
      set({ error: err.message, pumpData: null });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchByQr: async (qr) => {
    set({ isLoading: true, error: null });
    try {
      const pump = await getPumpByQRCode(qr);
      set({ pumpData: pump });
    } catch (err: any) {
      set({ error: err.message, pumpData: null });
    } finally {
      set({ isLoading: false });
    }
  },

  addPump: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newPumpId = await createPump(data);
      return newPumpId.id;

    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updatePump: async (id, data: UpdatePump) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPump = await updatePump(id, data);
      set((state) => ({
        pumpData: state.pumpData
          ? state.pumpData.map((pump) =>
            pump.id === id ? updatedPump.updated : pump
          )
          : [updatedPump.updated],
      }));
      return true;
    } catch (err: any) {
      const errorMessage = err.message || "Error desconocido"
      set({ error: errorMessage });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  removePump: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const successDeletePump = await deletePump(id);

      if (successDeletePump) {
        set((state) => ({
          pumpData: state.pumpData
            ? state.pumpData.filter((pump) => pump.id !== id)
            : null,
        }));
        return true;
      } else {
        set({ error: "No se pudo eliminar la bomba" });
        return false;
      }
    } catch (err: any) {
      set({ error: err.message });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },


  clearPumpData: () => set({ pumpData: null, error: null }),
  clearError: () => set({error:null}),
}));

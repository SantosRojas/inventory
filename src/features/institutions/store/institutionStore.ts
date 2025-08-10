import { create } from "zustand";
import type { 
    CreateInstitution, 
    UpdateInstitution, 
    InstitutionExtended 
} from "../types";
import {
    getAllInstitutions,
    getInstitutionById,
    createInstitution,
    updateInstitution,
    deleteInstitution
} from "../services";

interface InstitutionState {
    institutions: InstitutionExtended[];
    selectedInstitution: InstitutionExtended | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchAllInstitutions: () => Promise<void>;
    fetchInstitutionById: (id: number) => Promise<void>;
    addInstitution: (data: CreateInstitution) => Promise<number | undefined>;
    updateInstitution: (id: number, data: UpdateInstitution) => Promise<void>;
    removeInstitution: (id: number) => Promise<boolean>;
    clearError: () => void;
    clearSelectedInstitution: () => void;
}

export const useInstitutionStore = create<InstitutionState>((set) => ({
    institutions: [],
    selectedInstitution: null,
    isLoading: false,
    error: null,

    fetchAllInstitutions: async () => {
        set({ isLoading: true, error: null });
        try {
            const institutions = await getAllInstitutions();
            set({ institutions, error: null }); // Limpiar explícitamente cualquier error previo
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar instituciones';
            set({ error: errorMessage });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchInstitutionById: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            const institution = await getInstitutionById(id);
            set({ selectedInstitution: institution });
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar la institución';
            set({ error: errorMessage });
        } finally {
            set({ isLoading: false });
        }
    },

    addInstitution: async (data: CreateInstitution) => {
        set({ isLoading: true, error: null });
        try {
            const newInstitution = await createInstitution(data);
            
            // Verificar que la respuesta sea válida
            if (!newInstitution?.createdId) {
                throw new Error('Error: Respuesta inválida del servidor');
            }
            
            // Recargar toda la lista para asegurar consistencia con la base de datos
            const institutions = await getAllInstitutions();
            set({ institutions, error: null });
            
            return newInstitution.createdId;
        } catch (err: unknown) {
            // NO establecer error en el estado global para errores de creación
            // El error se propagará al hook que lo maneja apropiadamente
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al crear la institución';
            throw new Error(errorMessage);
        } finally {
            set({ isLoading: false });
        }
    },

    updateInstitution: async (id: number, data: UpdateInstitution) => {
        set({ isLoading: true, error: null });
        try {
            const updatedData = await updateInstitution(id, data);
            const updatedInstitution = updatedData.updatedInstitution;
            // Actualizar en el estado local
            set((state) => ({
                institutions: state.institutions.map((institution) =>
                    institution.id === id ? updatedInstitution : institution
                ),
                selectedInstitution: state.selectedInstitution?.id === id 
                    ? updatedInstitution 
                    : state.selectedInstitution,
                error: null
            }));
        } catch (err: unknown) {
            // Propagar el error al hook, no al estado global
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al actualizar la institución';
            throw new Error(errorMessage);
        } finally {
            set({ isLoading: false });
        }
    },

    removeInstitution: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            await deleteInstitution(id);
            
            // Optimistic update: remover del estado local inmediatamente
            set((state) => ({
                institutions: state.institutions.filter((institution) => institution.id !== id),
                selectedInstitution: state.selectedInstitution?.id === id 
                    ? null 
                    : state.selectedInstitution,
                error: null
            }));
            
            return true;
        } catch (err: unknown) {
            // Propagar el error al hook, no al estado global
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al eliminar la institución';
            throw new Error(errorMessage);
        } finally {
            set({ isLoading: false });
        }
    },

    clearError: () => set({ error: null }),
    
    clearSelectedInstitution: () => set({ selectedInstitution: null })
}));

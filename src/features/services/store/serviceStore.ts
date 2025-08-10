import { create } from "zustand";
import type { 
    CreateService, 
    UpdateService, 
    ServiceExtended 
} from "../types";
import {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService
} from "../services";

interface ServiceState {
    services: ServiceExtended[];
    selectedService: ServiceExtended | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchAllServices: () => Promise<void>;
    fetchServiceById: (id: number) => Promise<void>;
    addService: (data: CreateService) => Promise<number | undefined>;
    updateService: (id: number, data: UpdateService) => Promise<void>;
    removeService: (id: number) => Promise<boolean>;
    clearError: () => void;
    clearSelectedService: () => void;
}

export const useServiceStore = create<ServiceState>((set) => ({
    services: [],
    selectedService: null,
    isLoading: false,
    error: null,

    fetchAllServices: async () => {
        set({ isLoading: true, error: null });
        try {
            const services = await getAllServices();
            set({ services, error: null }); // Limpiar explícitamente cualquier error previo
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar servicios';
            set({ error: errorMessage });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchServiceById: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            const service = await getServiceById(id);
            set({ selectedService: service });
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar el servicio';
            set({ error: errorMessage });
        } finally {
            set({ isLoading: false });
        }
    },

    addService: async (data: CreateService) => {
        set({ isLoading: true, error: null });
        try {
            const newService = await createService(data);
            
            // Verificar que la respuesta sea válida
            if (!newService?.createdId) {
                throw new Error('Error: Respuesta inválida del servidor');
            }
            
            // Recargar toda la lista para asegurar consistencia con la base de datos
            const services = await getAllServices();
            set({ services, error: null });
            
            return newService.createdId;
        } catch (err: unknown) {
            // NO establecer error en el estado global para errores de creación
            // El error se propagará al hook que lo maneja apropiadamente
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al crear el servicio';
            throw new Error(errorMessage);
        } finally {
            set({ isLoading: false });
        }
    },

    updateService: async (id: number, data: UpdateService) => {
        set({ isLoading: true, error: null });
        try {
            const updatedData = await updateService(id, data);
            const updatedService = updatedData.updatedService;
            // Actualizar en el estado local
            set((state) => ({
                services: state.services.map((service) =>
                    service.id === id ? updatedService : service
                ),
                selectedService: state.selectedService?.id === id 
                    ? updatedService 
                    : state.selectedService,
                error: null
            }));
        } catch (err: unknown) {
            // Propagar el error al hook, no al estado global
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al actualizar el servicio';
            throw new Error(errorMessage);
        } finally {
            set({ isLoading: false });
        }
    },

    removeService: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            await deleteService(id);
            
            // Optimistic update: remover del estado local inmediatamente
            set((state) => ({
                services: state.services.filter((service) => service.id !== id),
                selectedService: state.selectedService?.id === id 
                    ? null 
                    : state.selectedService,
                error: null
            }));
            
            return true;
        } catch (err: unknown) {
            // Propagar el error al hook, no al estado global
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al eliminar el servicio';
            throw new Error(errorMessage);
        } finally {
            set({ isLoading: false });
        }
    },

    clearError: () => set({ error: null }),
    
    clearSelectedService: () => set({ selectedService: null })
}));

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { modelsService } from '../services';
import type { Model, ModelsState } from '../types';

interface ModelsActions {
    fetchModels: () => Promise<void>;
    createModel: (modelData: { code: string; name: string }) => Promise<void>;
    updateModel: (id: number, modelData: { code: string; name: string }) => Promise<void>;
    deleteModel: (id: number) => Promise<void>;
    setSearchTerm: (term: string) => void;
    setSelectedModel: (model: Model | null) => void;
    clearError: () => void;
    resetStore: () => void;
}

type ModelsStore = ModelsState & ModelsActions;

const initialState: ModelsState = {
    models: [],
    loading: false,
    error: null,
    searchTerm: '',
    selectedModel: null,
};

export const useModelsStore = create<ModelsStore>()(
    devtools(
        (set, get) => ({
            ...initialState,

            // Obtener todos los modelos
            fetchModels: async () => {
                set({ loading: true, error: null });
                try {
                    const models = await modelsService.getModels();
                    set(
                        { models, loading: false }
                    );
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Error al cargar los modelos';
                    set(
                        { error: errorMessage, loading: false }
                    );
                }
            },

            // Crear un nuevo modelo
            createModel: async (modelData) => {
                set({ loading: true, error: null });
                try {
                    const newModel = await modelsService.createModel(modelData);
                    console.log('Nuevo modelo creado:', newModel);

                    if (!newModel?.insertId) {
                        throw new Error('Error: Respuesta inválida del servidor');
                    }

                    // Recargar toda la lista para asegurar consistencia con la base de datos
                    const models = await modelsService.getModels();
                    set(
                        {
                            models: models,
                            loading: false,
                            error:null
                        },
                    );
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Error al crear el modelo';
                    set(
                        { error: errorMessage, loading: false },
                    );
                    throw error; // Re-lanzar para que el componente pueda manejarlo
                }
            },

            // Actualizar un modelo existente
            updateModel: async (id, modelData) => {
                set({ loading: true, error: null });
                try {
                    const updatedModel = await modelsService.updateModel(id, modelData);
                    const currentModels = get().models;
                    const updatedModels = currentModels.map(model =>
                        model.id === id ? updatedModel.modelUpdated : model
                    );
                    set(
                        {
                            models: updatedModels,
                            loading: false,
                            selectedModel: get().selectedModel?.id === id ? updatedModel.modelUpdated : get().selectedModel
                        }
                    );
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el modelo';
                    set(
                        { error: errorMessage, loading: false },
                        false,
                        'updateModel/error'
                    );
                    throw error; // Re-lanzar para que el componente pueda manejarlo
                }
            },

            // Eliminar un modelo
            deleteModel: async (id) => {
                set({ loading: true, error: null });
                try {
                    await modelsService.deleteModel(id);
                    const currentModels = get().models;
                    const filteredModels = currentModels.filter(model => model.id !== id);
                    set(
                        {
                            models: filteredModels,
                            loading: false,
                            selectedModel: get().selectedModel?.id === id ? null : get().selectedModel
                        }
                    );
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el modelo';
                    set(
                        { error: errorMessage, loading: false }
                    );
                    throw error; // Re-lanzar para que el componente pueda manejarlo
                }
            },

            // Actualizar término de búsqueda
            setSearchTerm: (term) => {
                set({ searchTerm: term }, false, 'setSearchTerm');
            },

            // Seleccionar modelo
            setSelectedModel: (model) => {
                set({ selectedModel: model }, false, 'setSelectedModel');
            },

            // Limpiar error
            clearError: () => {
                set({ error: null }, false, 'clearError');
            },

            // Resetear store
            resetStore: () => {
                set(initialState, false, 'resetStore');
            },
        }),
        { name: 'models-store' }
    )
);

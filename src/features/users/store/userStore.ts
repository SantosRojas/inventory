import { create } from "zustand";
import type { 
    CreateUser, 
    UpdateUser, 
    UpdateUserPassword,
    UserExtended 
} from "../types";
import {
    getAllUsers,
    getUserById,
    getUserProfile,
    createUser,
    updateUser,
    updateUserPassword,
    deleteUser
} from "../services";

interface UserState {
    users: UserExtended[];
    selectedUser: UserExtended | null;
    currentUserProfile: UserExtended | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchAllUsers: () => Promise<void>;
    fetchUserById: (id: number) => Promise<void>;
    fetchUserProfile: () => Promise<void>;
    addUser: (data: CreateUser) => Promise<number | undefined>;
    updateUser: (id: number, data: UpdateUser) => Promise<void>;
    updateUserPassword: (id: number, data: UpdateUserPassword) => Promise<void>;
    removeUser: (id: number) => Promise<boolean>;
    clearError: () => void;
    clearSelectedUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    users: [],
    selectedUser: null,
    currentUserProfile: null,
    isLoading: false,
    error: null,

    fetchAllUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            const users = await getAllUsers();
            set({ users, error: null }); // Limpiar explícitamente cualquier error previo
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar usuarios';
            set({ error: errorMessage });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchUserById: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            const user = await getUserById(id);
            set({ selectedUser: user });
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar el usuario';
            set({ error: errorMessage });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchUserProfile: async () => {
        set({ isLoading: true, error: null });
        try {
            const profile = await getUserProfile();
            set({ currentUserProfile: profile });
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar el perfil';
            set({ error: errorMessage });
        } finally {
            set({ isLoading: false });
        }
    },

    addUser: async (data: CreateUser) => {
        set({ isLoading: true, error: null });
        try {
            const newUser = await createUser(data);
            
            // Verificar que la respuesta sea válida
            if (!newUser?.createdId) {
                throw new Error('Error: Respuesta inválida del servidor');
            }
            
            // Recargar toda la lista para asegurar consistencia con la base de datos
            const users = await getAllUsers();
            set({ users, error: null });
            
            return newUser.createdId;
        } catch (err: unknown) {
            // NO establecer error en el estado global para errores de creación
            // El error se propagará al hook que lo maneja apropiadamente
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al crear el usuario';
            throw new Error(errorMessage);
        } finally {
            set({ isLoading: false });
        }
    },

    updateUser: async (id: number, data: UpdateUser) => {
        set({ isLoading: true, error: null });
        try {
            const updatedData = await updateUser(id, data);
            const updatedUser = updatedData.updatedUser;
            
            // Actualizar en el estado local
            set((state) => ({
                users: state.users.map((user) =>
                    user.id === id ? updatedUser : user
                ),
                selectedUser: state.selectedUser?.id === id 
                    ? updatedUser 
                    : state.selectedUser,
                // También actualizar el perfil si es el usuario actual
                currentUserProfile: state.currentUserProfile?.id === id 
                    ? updatedUser 
                    : state.currentUserProfile,
                error: null
            }));
        } catch (err: unknown) {
            // Propagar el error al hook, no al estado global
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al actualizar el usuario';
            throw new Error(errorMessage);
        } finally {
            set({ isLoading: false });
        }
    },

    updateUserPassword: async (id: number, data: UpdateUserPassword) => {
        set({ isLoading: true, error: null });
        try {
            await updateUserPassword(id, data);
            // No necesitamos actualizar el estado local para cambios de contraseña
            set({ error: null });
        } catch (err: unknown) {
            // Propagar el error al hook, no al estado global
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al actualizar la contraseña';
            throw new Error(errorMessage);
        } finally {
            set({ isLoading: false });
        }
    },

    removeUser: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            await deleteUser(id);
            
            // Optimistic update: remover del estado local inmediatamente
            set((state) => ({
                users: state.users.filter((user) => user.id !== id),
                selectedUser: state.selectedUser?.id === id 
                    ? null 
                    : state.selectedUser,
                error: null
            }));
            
            return true;
        } catch (err: unknown) {
            // Propagar el error al hook, no al estado global
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al eliminar el usuario';
            throw new Error(errorMessage);
        } finally {
            set({ isLoading: false });
        }
    },

    clearError: () => set({ error: null }),
    
    clearSelectedUser: () => set({ selectedUser: null })
}));

// features/auth/store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {User} from "../types/types.ts";
import { checkTokenValidity } from '../services/api.ts'

interface AuthState {
    user: User | null
    token: string | null
    isLoading: boolean
    login: (user: User, token: string) => void
    logout: () => void
    validateToken: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isLoading: true,

            login: (user, token) => set({ user, token }),
            logout: () => set({ user: null, token: null }),

            validateToken: async () => {
                const token = get().token
                if (!token) {
                    set({ isLoading: false })
                    return
                }

                try {
                    const user = await checkTokenValidity(token)
                    set({ user, isLoading: false })
                } catch (err) {
                    // Token inválido o expirado
                    set({ user: null, token: null, isLoading: false })
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ token: state.token, user: state.user }),
        }
    )
)

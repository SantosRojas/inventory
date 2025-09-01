// features/auth/store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserToRegister } from "../types/types.ts"
import { checkTokenValidity, loginUser, registerUser } from '../services/api.ts'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
  validateToken: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      // 🔐 LOGIN con manejo de loading
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const { user, token } = await loginUser({ email, password })
          set({ user, token })
        } catch (err: any) {
          set({ error: err.message, user: null, token: null })

        } finally {
          set({ isLoading: false })
        }
      },

      // 📝 REGISTER con manejo de loading
      register: async (data: UserToRegister) => {
        set({ isLoading: true, error: null })
        try {
          const { user, token } = await registerUser(data)
          set({ user, token })
        } catch (err: any) {
          set({ user: null, token: null, error: err.message })
        } finally {
          set({ isLoading: false })
        }
      },

      logout: () => {
        set({ user: null, token: null })
      },

      validateToken: async () => {
        set({ isLoading: true, error: null })
        const token = get().token
        if (!token) {
          set({ isLoading: false })
          return
        }

        try {
          const user = await checkTokenValidity()
          set({ user })
        } catch (err: any) {
          set({ user: null, token: null, error: err.message })
        } finally {
          set({ isLoading: false })
        }
      },
      clearError: () => {
        set({
          error: null
        })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
)

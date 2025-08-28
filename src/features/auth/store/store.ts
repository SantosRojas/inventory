// features/auth/store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserToRegister } from "../types/types.ts"
import { checkTokenValidity, loginUser, registerUser } from '../services/api.ts'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
  validateToken: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      // 🔐 LOGIN con manejo de loading
      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const { user, token } = await loginUser({ email, password })
          set({ user, token })
        } catch (err) {
          set({ user: null, token: null })
          throw err
        } finally {
          set({ isLoading: false })
        }
      },

      // 📝 REGISTER con manejo de loading
      register: async (data: UserToRegister) => {
        set({ isLoading: true })
        try {
          const { user, token } = await registerUser(data)
          set({ user, token })
        } catch (err) {
          set({ user: null, token: null })
          throw err
        } finally {
          set({ isLoading: false })
        }
      },

      logout: () => {
        set({ user: null, token: null })
      },

      validateToken: async () => {
        set({ isLoading: true })
        const token = get().token
        if (!token) {
          set({ isLoading: false })
          return
        }

        try {
          const user = await checkTokenValidity(token)
          set({ user })
        } catch {
          set({ user: null, token: null })
        } finally {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
)

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type AuthState, type User } from "../../types"

export const useAuthStore = create<AuthState>()(
    persist((set: (partial: Partial<AuthState>) => void) => ({
        user: null,
        isAuthenticated: false,
        userLoading: false,
        token: "",
        setToken: (value: string) => set({ token: value }),
        setUser: (user: User) => set({ user }),
        setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
        setUserLoading: (value: boolean) => set({ userLoading: value }),
        logout: () => set({ user: null, isAuthenticated: false }),
    }),
        {
            name: "auth-store",
        }
    )

)
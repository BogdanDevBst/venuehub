import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from './types';

interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isHydrated?: boolean;
    setAuth: (user: User, token: string, refreshToken: string) => void;
    clearAuth: () => void;
    updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isHydrated: false,
            setAuth: (user, token, refreshToken) => {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('token', token);
                    localStorage.setItem('refreshToken', refreshToken);
                }
                set({ user, token, refreshToken, isAuthenticated: true });
            },
            clearAuth: () => {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                }
                set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
            },
            updateUser: (userData) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...userData } : null,
                })),
        }),
        {
            name: 'auth-storage',
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.isHydrated = true;
                }
            },
        }
    )
);

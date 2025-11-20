import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import type { User, LoginCredentials, RegisterCredentials } from '@/types';
import { authApi, tokenStorage } from '@/lib/api-client';

interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  exp: number;
  iat: number;
}

interface AuthStore {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,

      // Initialize auth state from stored tokens
      initialize: async () => {
        const token = tokenStorage.getAccessToken();

        if (!token) {
          set({ isInitialized: true, isAuthenticated: false, user: null });
          return;
        }

        try {
          // Check if token is expired
          const decoded = jwtDecode<JwtPayload>(token);
          const isExpired = decoded.exp * 1000 < Date.now();

          if (isExpired) {
            // Try to refresh
            const refreshToken = tokenStorage.getRefreshToken();
            if (refreshToken) {
              try {
                await authApi.refreshToken(refreshToken);
              } catch {
                tokenStorage.clearTokens();
                set({ isInitialized: true, isAuthenticated: false, user: null });
                return;
              }
            } else {
              tokenStorage.clearTokens();
              set({ isInitialized: true, isAuthenticated: false, user: null });
              return;
            }
          }

          // Fetch current user
          const response = await authApi.getCurrentUser();
          if (response.success) {
            set({
              user: response.data,
              isAuthenticated: true,
              isInitialized: true,
            });
          } else {
            tokenStorage.clearTokens();
            set({ isInitialized: true, isAuthenticated: false, user: null });
          }
        } catch {
          tokenStorage.clearTokens();
          set({ isInitialized: true, isAuthenticated: false, user: null });
        }
      },

      // Login
      login: async (credentials) => {
        set({ isLoading: true });

        try {
          const response = await authApi.login(credentials);

          if (response.success) {
            // Fetch user data
            const userResponse = await authApi.getCurrentUser();
            if (userResponse.success) {
              set({
                user: userResponse.data,
                isAuthenticated: true,
                isLoading: false,
              });
            }
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Register
      register: async (credentials) => {
        set({ isLoading: true });

        try {
          const response = await authApi.register(credentials);

          if (response.success) {
            // Fetch user data
            const userResponse = await authApi.getCurrentUser();
            if (userResponse.success) {
              set({
                user: userResponse.data,
                isAuthenticated: true,
                isLoading: false,
              });
            }
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Logout
      logout: async () => {
        try {
          await authApi.logout();
        } finally {
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },

      // Refresh user data
      refreshUser: async () => {
        if (!get().isAuthenticated) return;

        try {
          const response = await authApi.getCurrentUser();
          if (response.success) {
            set({ user: response.data });
          }
        } catch {
          // If refresh fails, logout
          await get().logout();
        }
      },
    }),
    {
      name: 'marketviz-auth',
      partialize: (state) => ({
        // Only persist these fields
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

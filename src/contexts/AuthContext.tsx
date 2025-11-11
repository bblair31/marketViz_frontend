/**
 * Authentication Context
 *
 * Provides authentication state and methods throughout the app.
 * Uses Context API for global state management (React's recommended approach).
 */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { jwtDecode } from 'jwt-decode'
import { authApi } from '@/api'
import type { User, LoginRequest, RegisterRequest } from '@/api/types'

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (userData: RegisterRequest) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

interface JwtPayload {
  userId: number
  email: string
  exp: number
  iat: number
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ============================================
// Token Management Utilities
// ============================================

/**
 * Check if JWT token is expired
 */
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token)
    const currentTime = Date.now() / 1000
    return decoded.exp < currentTime
  } catch {
    return true
  }
}

/**
 * Safely get token from localStorage
 */
const getStoredToken = (): string | null => {
  const token = localStorage.getItem('jwt')
  if (token && !isTokenExpired(token)) {
    return token
  }
  // Token is expired or invalid, clean up
  localStorage.removeItem('jwt')
  localStorage.removeItem('user')
  return null
}

/**
 * Safely get user from localStorage
 */
const getStoredUser = (): User | null => {
  try {
    const userJson = localStorage.getItem('user')
    return userJson ? JSON.parse(userJson) : null
  } catch {
    localStorage.removeItem('user')
    return null
  }
}

// ============================================
// Auth Provider Component
// ============================================

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = getStoredToken()
      const storedUser = getStoredUser()

      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(storedUser)
      }

      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  /**
   * Login user
   */
  const login = async (credentials: LoginRequest) => {
    const response = await authApi.login(credentials)
    const { user, token } = response

    // Store in state
    setUser(user)
    setToken(token)

    // Persist to localStorage
    localStorage.setItem('jwt', token)
    localStorage.setItem('user', JSON.stringify(user))
  }

  /**
   * Register new user
   */
  const register = async (userData: RegisterRequest) => {
    const response = await authApi.register(userData)
    const { user, token } = response

    // Store in state
    setUser(user)
    setToken(token)

    // Persist to localStorage
    localStorage.setItem('jwt', token)
    localStorage.setItem('user', JSON.stringify(user))
  }

  /**
   * Logout user
   */
  const logout = () => {
    setUser(null)
    setToken(null)
    authApi.logout()
  }

  /**
   * Refresh user data from server
   */
  const refreshUser = async () => {
    if (!token) return

    try {
      const updatedUser = await authApi.getCurrentUser()
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    } catch (error) {
      console.error('Failed to refresh user:', error)
      logout()
    }
  }

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ============================================
// useAuth Hook
// ============================================

/**
 * Custom hook to access auth context
 *
 * Usage:
 * const { user, login, logout, isAuthenticated } = useAuth()
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext

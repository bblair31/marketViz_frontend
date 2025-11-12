/**
 * AuthContext Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'
import * as authApiModule from '@/api/endpoints'

// Mock the authApi
vi.mock('@/api/endpoints', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
  },
}))

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should initialize with no user', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('should login user successfully', async () => {
    const mockAuthResponse = {
      user: { id: 1, email: 'test@example.com', name: 'Test User', createdAt: '2025-11-11' },
      token: 'mock-jwt-token',
    }

    vi.mocked(authApiModule.authApi.login).mockResolvedValue(mockAuthResponse)

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    await act(async () => {
      await result.current.login({ email: 'test@example.com', password: 'password123' })
    })

    await waitFor(() => {
      expect(result.current.user).toEqual(mockAuthResponse.user)
      expect(result.current.token).toBe(mockAuthResponse.token)
      expect(result.current.isAuthenticated).toBe(true)
    })

    // Check localStorage
    expect(localStorage.getItem('jwt')).toBe(mockAuthResponse.token)
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockAuthResponse.user))
  })

  it('should logout user and clear storage', async () => {
    // Setup: login first
    const mockAuthResponse = {
      user: { id: 1, email: 'test@example.com', name: 'Test User', createdAt: '2025-11-11' },
      token: 'mock-jwt-token',
    }
    vi.mocked(authApiModule.authApi.login).mockResolvedValue(mockAuthResponse)

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    await act(async () => {
      await result.current.login({ email: 'test@example.com', password: 'password123' })
    })

    // Now logout
    act(() => {
      result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(localStorage.getItem('jwt')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
  })

  it('should throw error when useAuth is used outside AuthProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      renderHook(() => useAuth())
    }).toThrow('useAuth must be used within an AuthProvider')

    consoleSpy.mockRestore()
  })
})

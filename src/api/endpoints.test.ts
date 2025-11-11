/**
 * API Endpoints Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authApi, marketApi, watchlistApi } from './endpoints'
import apiClient from './client'

// Mock the apiClient
vi.mock('./client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call login endpoint with correct credentials', async () => {
    const mockResponse = {
      data: {
        user: { id: 1, email: 'test@example.com' },
        token: 'mock-jwt-token',
      },
    }
    vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

    const credentials = { email: 'test@example.com', password: 'password123' }
    const result = await authApi.login(credentials)

    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', credentials)
    expect(result).toEqual(mockResponse.data)
  })

  it('should clear localStorage on logout', () => {
    const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem')

    authApi.logout()

    expect(removeItemSpy).toHaveBeenCalledWith('jwt')
    expect(removeItemSpy).toHaveBeenCalledWith('user')
  })
})

describe('marketApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch stock quote for a given symbol', async () => {
    const mockQuote = {
      data: {
        symbol: 'AAPL',
        price: 150.25,
        change: 2.5,
        changePercent: 1.69,
      },
    }
    vi.mocked(apiClient.get).mockResolvedValue(mockQuote)

    const result = await marketApi.getQuote('AAPL')

    expect(apiClient.get).toHaveBeenCalledWith('/market/quote/AAPL')
    expect(result).toEqual(mockQuote.data)
  })

  it('should search stocks with query parameter', async () => {
    const mockResults = {
      data: [
        { symbol: 'AAPL', name: 'Apple Inc.', type: 'Equity' },
      ],
    }
    vi.mocked(apiClient.get).mockResolvedValue(mockResults)

    const result = await marketApi.search('Apple')

    expect(apiClient.get).toHaveBeenCalledWith('/market/search', {
      params: { q: 'Apple' },
    })
    expect(result).toEqual(mockResults.data)
  })
})

describe('watchlistApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should add stock to watchlist', async () => {
    const mockItem = {
      data: {
        id: 1,
        symbol: 'AAPL',
        companyName: 'Apple Inc.',
        addedAt: '2025-11-11T12:00:00Z',
      },
    }
    vi.mocked(apiClient.post).mockResolvedValue(mockItem)

    const result = await watchlistApi.addToWatchlist({
      symbol: 'AAPL',
      companyName: 'Apple Inc.',
    })

    expect(apiClient.post).toHaveBeenCalledWith('/watchlist', {
      symbol: 'AAPL',
      companyName: 'Apple Inc.',
    })
    expect(result).toEqual(mockItem.data)
  })

  it('should remove stock from watchlist', async () => {
    vi.mocked(apiClient.delete).mockResolvedValue({ data: null })

    await watchlistApi.removeFromWatchlist('AAPL')

    expect(apiClient.delete).toHaveBeenCalledWith('/watchlist/AAPL')
  })
})

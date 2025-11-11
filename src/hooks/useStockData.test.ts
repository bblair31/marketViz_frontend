/**
 * Stock Data Hooks Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useStockQuote, useTopMovers } from './useStockData'
import * as marketApiModule from '@/api/endpoints'

// Mock the marketApi
vi.mock('@/api/endpoints', () => ({
  marketApi: {
    getQuote: vi.fn(),
    getTopMovers: vi.fn(),
    getDailyData: vi.fn(),
    getOverview: vi.fn(),
    search: vi.fn(),
    getNews: vi.fn(),
  },
}))

// Create a wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useStockQuote', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch stock quote successfully', async () => {
    const mockQuote = {
      symbol: 'AAPL',
      price: 150.25,
      change: 2.5,
      changePercent: 1.69,
      high: 152.0,
      low: 148.0,
      open: 149.0,
      previousClose: 147.75,
      volume: 50000000,
      latestTradingDay: '2025-11-11',
    }

    vi.mocked(marketApiModule.marketApi.getQuote).mockResolvedValue(mockQuote)

    const { result } = renderHook(() => useStockQuote('AAPL'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockQuote)
    expect(marketApiModule.marketApi.getQuote).toHaveBeenCalledWith('AAPL')
  })

  it('should not fetch when symbol is empty', () => {
    renderHook(() => useStockQuote(''), {
      wrapper: createWrapper(),
    })

    expect(marketApiModule.marketApi.getQuote).not.toHaveBeenCalled()
  })
})

describe('useTopMovers', () => {
  it('should fetch top movers successfully', async () => {
    const mockMovers = {
      gainers: [{ symbol: 'TSLA', price: 200, change: 10, changePercent: 5 }],
      losers: [{ symbol: 'NFLX', price: 300, change: -15, changePercent: -4.8 }],
      mostActive: [{ symbol: 'AAPL', price: 150, change: 2, changePercent: 1.3 }],
    }

    vi.mocked(marketApiModule.marketApi.getTopMovers).mockResolvedValue(mockMovers)

    const { result } = renderHook(() => useTopMovers(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockMovers)
  })
})

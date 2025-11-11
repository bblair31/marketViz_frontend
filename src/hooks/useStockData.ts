/**
 * Stock Data Hooks using TanStack Query
 *
 * These hooks provide automatic caching, loading states, and smart refetching
 * for all stock market data. No more manual setInterval polling!
 */
import { useQuery } from '@tanstack/react-query'
import { marketApi } from '@/api'

/**
 * Get real-time stock quote
 *
 * Automatically refetches every 60 seconds during market hours
 */
export function useStockQuote(symbol: string, enabled = true) {
  return useQuery({
    queryKey: ['stock', 'quote', symbol],
    queryFn: () => marketApi.getQuote(symbol),
    enabled: enabled && !!symbol,
    staleTime: 30 * 1000, // Consider data stale after 30 seconds
    refetchInterval: 60 * 1000, // Auto-refetch every 60 seconds
  })
}

/**
 * Get historical daily data for a stock
 *
 * Cached for 5 minutes since historical data doesn't change frequently
 */
export function useDailyData(
  symbol: string,
  outputSize: 'compact' | 'full' = 'compact',
  enabled = true
) {
  return useQuery({
    queryKey: ['stock', 'daily', symbol, outputSize],
    queryFn: () => marketApi.getDailyData(symbol, outputSize),
    enabled: enabled && !!symbol,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Get company overview/details
 *
 * Cached for 1 hour since company info rarely changes
 */
export function useCompanyOverview(symbol: string, enabled = true) {
  return useQuery({
    queryKey: ['stock', 'overview', symbol],
    queryFn: () => marketApi.getOverview(symbol),
    enabled: enabled && !!symbol,
    staleTime: 60 * 60 * 1000, // 1 hour
  })
}

/**
 * Search for stocks by keyword
 *
 * Only fetches when query is at least 1 character
 */
export function useStockSearch(query: string, enabled = true) {
  return useQuery({
    queryKey: ['stock', 'search', query],
    queryFn: () => marketApi.search(query),
    enabled: enabled && query.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Get top movers (gainers, losers, most active)
 *
 * Refetches every 5 minutes
 */
export function useTopMovers(enabled = true) {
  return useQuery({
    queryKey: ['market', 'top-movers'],
    queryFn: () => marketApi.getTopMovers(),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}

/**
 * Get market news
 *
 * Optionally filter by symbol
 */
export function useMarketNews(symbol?: string, enabled = true) {
  return useQuery({
    queryKey: symbol ? ['news', symbol] : ['news', 'market'],
    queryFn: () => marketApi.getNews(symbol),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Get quotes for multiple symbols at once
 *
 * Useful for watchlists - fetches all quotes in parallel
 */
export function useMultipleQuotes(symbols: string[], enabled = true) {
  return useQuery({
    queryKey: ['stock', 'quotes', ...symbols.sort()],
    queryFn: async () => {
      const quotes = await Promise.allSettled(
        symbols.map(symbol => marketApi.getQuote(symbol))
      )
      return quotes
        .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
        .map(result => result.value)
    },
    enabled: enabled && symbols.length > 0,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}

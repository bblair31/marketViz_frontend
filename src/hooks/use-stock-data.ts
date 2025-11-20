import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marketApi, watchlistApi } from '@/lib/api-client';
import { isMarketOpen } from '@/lib/utils';

// Query keys for cache management
export const queryKeys = {
  quote: (symbol: string) => ['quote', symbol] as const,
  quotes: (symbols: string[]) => ['quotes', symbols] as const,
  overview: (symbol: string) => ['overview', symbol] as const,
  historical: (symbol: string, size: string) => ['historical', symbol, size] as const,
  movers: () => ['movers'] as const,
  news: (symbol?: string) => ['news', symbol] as const,
  search: (query: string) => ['search', query] as const,
  watchlist: () => ['watchlist'] as const,
};

// ============================================================================
// Stock Quotes
// ============================================================================

export function useStockQuote(symbol: string) {
  return useQuery({
    queryKey: queryKeys.quote(symbol),
    queryFn: async () => {
      const response = await marketApi.getQuote(symbol);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    enabled: !!symbol,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: isMarketOpen() ? 60 * 1000 : false, // Refetch every minute during market hours
  });
}

export function useMultipleQuotes(symbols: string[]) {
  return useQuery({
    queryKey: queryKeys.quotes(symbols),
    queryFn: async () => {
      const response = await marketApi.getMultipleQuotes(symbols);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    enabled: symbols.length > 0,
    staleTime: 30 * 1000,
    refetchInterval: isMarketOpen() ? 60 * 1000 : false,
  });
}

// ============================================================================
// Company Overview
// ============================================================================

export function useCompanyOverview(symbol: string) {
  return useQuery({
    queryKey: queryKeys.overview(symbol),
    queryFn: async () => {
      const response = await marketApi.getOverview(symbol);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    enabled: !!symbol,
    staleTime: 60 * 60 * 1000, // 1 hour - company info rarely changes
  });
}

// ============================================================================
// Historical Data
// ============================================================================

export function useHistoricalData(symbol: string, outputSize: 'compact' | 'full' = 'compact') {
  return useQuery({
    queryKey: queryKeys.historical(symbol, outputSize),
    queryFn: async () => {
      const response = await marketApi.getHistoricalData(symbol, outputSize);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    enabled: !!symbol,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ============================================================================
// Market Movers
// ============================================================================

export function useTopMovers() {
  return useQuery({
    queryKey: queryKeys.movers(),
    queryFn: async () => {
      const response = await marketApi.getTopMovers();
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: isMarketOpen() ? 5 * 60 * 1000 : false, // Refetch every 5 minutes during market hours
  });
}

// ============================================================================
// Market News
// ============================================================================

export function useMarketNews(symbol?: string) {
  return useQuery({
    queryKey: queryKeys.news(symbol),
    queryFn: async () => {
      const response = await marketApi.getNews(symbol);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ============================================================================
// Stock Search
// ============================================================================

export function useStockSearch(query: string) {
  return useQuery({
    queryKey: queryKeys.search(query),
    queryFn: async () => {
      const response = await marketApi.search(query);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    enabled: query.length >= 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ============================================================================
// Watchlist
// ============================================================================

export function useWatchlist() {
  return useQuery({
    queryKey: queryKeys.watchlist(),
    queryFn: async () => {
      const response = await watchlistApi.getWatchlist();
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useAddToWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ symbol, name }: { symbol: string; name: string }) => {
      const response = await watchlistApi.addToWatchlist(symbol, name);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate watchlist cache to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.watchlist() });
    },
  });
}

export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (symbol: string) => {
      const response = await watchlistApi.removeFromWatchlist(symbol);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate watchlist cache to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.watchlist() });
    },
  });
}

export function useIsInWatchlist(symbol: string) {
  const { data: watchlist } = useWatchlist();
  return watchlist?.some((item) => item.symbol === symbol) ?? false;
}

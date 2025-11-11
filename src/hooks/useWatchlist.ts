/**
 * Watchlist Hooks using TanStack Query
 *
 * Provides CRUD operations for watchlist with optimistic updates
 * and automatic cache invalidation
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { watchlistApi } from '@/api'
import type { WatchlistItem, AddWatchlistRequest } from '@/api/types'

/**
 * Get user's watchlist
 *
 * Automatically refetches when user logs in
 */
export function useWatchlist(enabled = true) {
  return useQuery({
    queryKey: ['watchlist'],
    queryFn: watchlistApi.getWatchlist,
    enabled,
    staleTime: 60 * 1000, // 1 minute
  })
}

/**
 * Add stock to watchlist
 *
 * Uses optimistic updates for instant UI feedback
 */
export function useAddToWatchlist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AddWatchlistRequest) => watchlistApi.addToWatchlist(data),
    // Optimistic update - update UI immediately before server responds
    onMutate: async (newItem) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['watchlist'] })

      // Snapshot previous value
      const previousWatchlist = queryClient.getQueryData<WatchlistItem[]>(['watchlist'])

      // Optimistically update the cache
      if (previousWatchlist) {
        queryClient.setQueryData<WatchlistItem[]>(['watchlist'], (old = []) => [
          ...old,
          {
            id: Date.now(), // Temporary ID
            symbol: newItem.symbol,
            companyName: newItem.companyName || newItem.symbol,
            addedAt: new Date().toISOString(),
          },
        ])
      }

      // Return context for rollback on error
      return { previousWatchlist }
    },
    // Rollback on error
    onError: (_err, _newItem, context) => {
      if (context?.previousWatchlist) {
        queryClient.setQueryData(['watchlist'], context.previousWatchlist)
      }
    },
    // Always refetch after success or error
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] })
    },
  })
}

/**
 * Remove stock from watchlist
 *
 * Uses optimistic updates for instant UI feedback
 */
export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (symbol: string) => watchlistApi.removeFromWatchlist(symbol),
    // Optimistic update
    onMutate: async (symbol) => {
      await queryClient.cancelQueries({ queryKey: ['watchlist'] })

      const previousWatchlist = queryClient.getQueryData<WatchlistItem[]>(['watchlist'])

      if (previousWatchlist) {
        queryClient.setQueryData<WatchlistItem[]>(['watchlist'], (old = []) =>
          old.filter(item => item.symbol !== symbol)
        )
      }

      return { previousWatchlist }
    },
    // Rollback on error
    onError: (_err, _symbol, context) => {
      if (context?.previousWatchlist) {
        queryClient.setQueryData(['watchlist'], context.previousWatchlist)
      }
    },
    // Always refetch after success or error
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] })
    },
  })
}

/**
 * Check if a symbol is in the watchlist
 *
 * Useful for rendering star/bookmark icons
 */
export function useIsInWatchlist(symbol: string) {
  const { data: watchlist = [] } = useWatchlist()
  return watchlist.some(item => item.symbol === symbol)
}

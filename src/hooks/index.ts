/**
 * Hooks Module Entry Point
 *
 * Centralized exports for all custom hooks
 */

// Auth hooks
export { useAuth } from './useAuth'

// Stock data hooks
export {
  useStockQuote,
  useDailyData,
  useCompanyOverview,
  useStockSearch,
  useTopMovers,
  useMarketNews,
  useMultipleQuotes,
} from './useStockData'

// Watchlist hooks
export {
  useWatchlist,
  useAddToWatchlist,
  useRemoveFromWatchlist,
  useIsInWatchlist,
} from './useWatchlist'

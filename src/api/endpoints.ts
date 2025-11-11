/**
 * API Endpoints - Modern functional approach (no classes!)
 * All functions return promises and work seamlessly with TanStack Query
 */
import apiClient from './client'
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  WatchlistItem,
  AddWatchlistRequest,
  StockQuote,
  CompanyOverview,
  DailyDataPoint,
  TopMoversResponse,
  NewsArticle,
  SearchResult,
} from './types'

// ============================================
// Authentication
// ============================================

export const authApi = {
  /**
   * Register a new user
   */
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData)
    return response.data
  },

  /**
   * Login with email and password
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
    return response.data
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/profile')
    return response.data
  },

  /**
   * Logout (clear local storage)
   */
  logout: () => {
    localStorage.removeItem('jwt')
    localStorage.removeItem('user')
  },
}

// ============================================
// Watchlist
// ============================================

export const watchlistApi = {
  /**
   * Get user's watchlist
   */
  getWatchlist: async (): Promise<WatchlistItem[]> => {
    const response = await apiClient.get<WatchlistItem[]>('/watchlist')
    return response.data
  },

  /**
   * Add stock to watchlist
   */
  addToWatchlist: async (data: AddWatchlistRequest): Promise<WatchlistItem> => {
    const response = await apiClient.post<WatchlistItem>('/watchlist', data)
    return response.data
  },

  /**
   * Remove stock from watchlist
   */
  removeFromWatchlist: async (symbol: string): Promise<void> => {
    await apiClient.delete(`/watchlist/${symbol}`)
  },
}

// ============================================
// Market Data
// ============================================

export const marketApi = {
  /**
   * Get real-time stock quote
   */
  getQuote: async (symbol: string): Promise<StockQuote> => {
    const response = await apiClient.get<StockQuote>(`/market/quote/${symbol}`)
    return response.data
  },

  /**
   * Get historical daily data
   */
  getDailyData: async (symbol: string, outputSize: 'compact' | 'full' = 'compact'): Promise<DailyDataPoint[]> => {
    const response = await apiClient.get<DailyDataPoint[]>(`/market/daily/${symbol}`, {
      params: { outputsize: outputSize },
    })
    return response.data
  },

  /**
   * Search for stocks by keyword
   */
  search: async (query: string): Promise<SearchResult[]> => {
    const response = await apiClient.get<SearchResult[]>('/market/search', {
      params: { q: query },
    })
    return response.data
  },

  /**
   * Get company overview/details
   */
  getOverview: async (symbol: string): Promise<CompanyOverview> => {
    const response = await apiClient.get<CompanyOverview>(`/market/overview/${symbol}`)
    return response.data
  },

  /**
   * Get top movers (gainers, losers, most active)
   */
  getTopMovers: async (): Promise<TopMoversResponse> => {
    const response = await apiClient.get<TopMoversResponse>('/market/top-movers')
    return response.data
  },

  /**
   * Get market news
   */
  getNews: async (symbol?: string): Promise<NewsArticle[]> => {
    const endpoint = symbol ? `/market/news?symbol=${symbol}` : '/market/news'
    const response = await apiClient.get<NewsArticle[]>(endpoint)
    return response.data
  },
}

// ============================================
// Export all APIs as a single object (alternative usage)
// ============================================

export const api = {
  auth: authApi,
  watchlist: watchlistApi,
  market: marketApi,
}

export default api

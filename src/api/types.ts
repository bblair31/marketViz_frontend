/**
 * TypeScript type definitions for API requests and responses
 */

// Authentication
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name?: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface User {
  id: number
  email: string
  name?: string
  createdAt: string
}

// Watchlist
export interface WatchlistItem {
  id: number
  symbol: string
  companyName: string
  addedAt: string
}

export interface AddWatchlistRequest {
  symbol: string
  companyName?: string
}

// Market Data (Alpha Vantage format with numbered keys)
export interface StockQuote {
  symbol: string
  price: number
  change: number
  changePercent: number
  high: number
  low: number
  open: number
  previousClose: number
  volume: number
  latestTradingDay: string
}

export interface CompanyOverview {
  symbol: string
  name: string
  description: string
  sector: string
  industry: string
  marketCap: number
  peRatio: number
  dividendYield: number
  '52WeekHigh': number
  '52WeekLow': number
  employees?: number
  exchange: string
}

export interface DailyDataPoint {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface TopMoversResponse {
  gainers: StockQuote[]
  losers: StockQuote[]
  mostActive: StockQuote[]
}

export interface NewsArticle {
  title: string
  url: string
  summary: string
  source: string
  publishedAt: string
  sentiment?: 'positive' | 'negative' | 'neutral'
  image?: string
}

export interface SearchResult {
  symbol: string
  name: string
  type: string
  region: string
  currency: string
  matchScore: number
}

// API Error
export interface ApiError {
  status: string
  message: string
  errors?: Record<string, string[]>
}

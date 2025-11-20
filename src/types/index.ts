// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// Authentication Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ============================================================================
// Stock/Market Types
// ============================================================================

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  previousClose: number;
  open: number;
  high: number;
  low: number;
  marketCap?: number;
  peRatio?: number;
  week52High?: number;
  week52Low?: number;
  timestamp: string;
}

export interface StockOverview {
  symbol: string;
  name: string;
  description: string;
  exchange: string;
  currency: string;
  sector: string;
  industry: string;
  marketCap: number;
  peRatio: number;
  pegRatio: number;
  bookValue: number;
  dividendYield: number;
  eps: number;
  week52High: number;
  week52Low: number;
  movingAverage50: number;
  movingAverage200: number;
  sharesOutstanding: number;
  analystTargetPrice: number;
}

export interface HistoricalDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjustedClose?: number;
}

export interface TopMover {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

export interface MarketMovers {
  gainers: TopMover[];
  losers: TopMover[];
  mostActive: TopMover[];
}

export interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  region: string;
  currency: string;
  matchScore: number;
}

// ============================================================================
// Watchlist Types
// ============================================================================

export interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  addedAt: string;
  notes?: string;
}

// ============================================================================
// News Types
// ============================================================================

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  sentiment?: 'bullish' | 'bearish' | 'neutral';
  symbols?: string[];
}

// ============================================================================
// Reminder Types
// ============================================================================

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  symbol?: string;
  triggerAt: string;
  triggerType: 'price' | 'time' | 'event';
  triggerValue?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReminderInput {
  title: string;
  description?: string;
  symbol?: string;
  triggerAt: string;
  triggerType: 'price' | 'time' | 'event';
  triggerValue?: number;
}

// ============================================================================
// Message Types
// ============================================================================

export interface Message {
  id: string;
  subject: string;
  body: string;
  recipient?: string;
  scheduledAt?: string;
  sentAt?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// WebSocket Types (for future real-time features)
// ============================================================================

export type WebSocketMessageType =
  | 'quote_update'
  | 'price_alert'
  | 'news_update'
  | 'connection_status';

export interface WebSocketMessage<T = unknown> {
  type: WebSocketMessageType;
  payload: T;
  timestamp: string;
}

export interface QuoteUpdatePayload {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

export interface PriceAlertPayload {
  symbol: string;
  price: number;
  alertType: 'above' | 'below';
  targetPrice: number;
}

// ============================================================================
// Chart Types
// ============================================================================

export interface CandlestickData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface VolumeData {
  time: string;
  value: number;
  color: string;
}

export type TimeRange = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y' | 'ALL';

// ============================================================================
// UI State Types
// ============================================================================

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

export type Theme = 'light' | 'dark' | 'system';

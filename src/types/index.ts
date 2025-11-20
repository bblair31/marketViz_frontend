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

// ============================================================================
// Portfolio Types
// ============================================================================

export interface PortfolioHolding {
  symbol: string;
  companyName: string;
  priceBought: number;
  currentPrice: number;
  change: number;
  changePercent: number;
  gain: number;
  gainPercent: number;
}

export interface PortfolioSummary {
  holdings: PortfolioHolding[];
  totalValue: number;
  totalCost: number;
  totalGain: number;
  totalGainPercent: number;
  dayChange: number;
  dayChangePercent: number;
}

export interface PortfolioMetrics {
  sharpeRatio: number;
  standardDeviation: number;
  beta: number;
  diversificationScore: number;
}

export interface CorrelationMatrix {
  symbols: string[];
  matrix: number[][];
}

export interface PerformanceDataPoint {
  date: string;
  value: number;
}

export type PerformancePeriod = '1W' | '1M' | '3M' | '6M' | '1Y';

// ============================================================================
// Stock Screener Types
// ============================================================================

export interface ScreenerFilters {
  peRatio?: { min?: number; max?: number };
  pbRatio?: { min?: number; max?: number };
  pegRatio?: { min?: number; max?: number };
  marketCap?: { min?: number; max?: number };
  dividendYield?: { min?: number; max?: number };
  profitMargin?: { min?: number; max?: number };
  revenueGrowth?: { min?: number; max?: number };
  beta?: { min?: number; max?: number };
  sector?: string;
}

export interface ScreenerRequest {
  filters: ScreenerFilters;
  symbols?: string[];
  limit?: number;
}

export interface ScreenerResult {
  symbol: string;
  name: string;
  sector: string;
  peRatio: number | null;
  pbRatio: number | null;
  marketCap: number | null;
  dividendYield: number | null;
  profitMargin: number | null;
  beta: number | null;
}

export type ScreenerPreset =
  | 'value_stocks'
  | 'growth_stocks'
  | 'dividend_aristocrats'
  | 'large_cap_tech'
  | 'low_volatility'
  | 'high_momentum';

// ============================================================================
// Price Alert Types
// ============================================================================

export type AlertCondition = 'ABOVE' | 'BELOW' | 'CROSSES_ABOVE' | 'CROSSES_BELOW';
export type AlertStatus = 'ACTIVE' | 'TRIGGERED' | 'CANCELLED';

export interface PriceAlert {
  id: string;
  symbol: string;
  condition: AlertCondition;
  targetPrice: number;
  currentPrice?: number;
  note?: string;
  status: AlertStatus;
  triggeredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAlertInput {
  symbol: string;
  condition: AlertCondition;
  targetPrice: number;
  note?: string;
}

export interface AlertStats {
  active: number;
  triggered: number;
  cancelled: number;
  total: number;
}

// ============================================================================
// Technical Indicator Types
// ============================================================================

export type IndicatorType = 'rsi' | 'macd' | 'bbands' | 'sma' | 'ema' | 'adx' | 'stoch' | 'atr' | 'obv';
export type IndicatorInterval = 'daily' | 'weekly' | 'monthly';

export interface RSIData {
  date: string;
  rsi: number;
}

export interface MACDData {
  date: string;
  macd: number;
  signal: number;
  histogram: number;
}

export interface BollingerBandsData {
  date: string;
  upper: number;
  middle: number;
  lower: number;
}

export interface SMAData {
  date: string;
  sma: number;
}

export interface EMAData {
  date: string;
  ema: number;
}

export interface ADXData {
  date: string;
  adx: number;
}

export interface StochasticData {
  date: string;
  slowK: number;
  slowD: number;
}

export interface ATRData {
  date: string;
  atr: number;
}

export interface OBVData {
  date: string;
  obv: number;
}

// ============================================================================
// Fundamental Data Types
// ============================================================================

export interface IncomeStatement {
  fiscalDateEnding: string;
  totalRevenue: number;
  grossProfit: number;
  operatingIncome: number;
  netIncome: number;
  eps: number;
}

export interface BalanceSheet {
  fiscalDateEnding: string;
  totalAssets: number;
  totalLiabilities: number;
  totalShareholderEquity: number;
  cash: number;
  debt: number;
}

export interface CashFlow {
  fiscalDateEnding: string;
  operatingCashflow: number;
  investingCashflow: number;
  financingCashflow: number;
  freeCashflow: number;
}

export interface EarningsData {
  fiscalDateEnding: string;
  reportedEPS: number;
  estimatedEPS: number;
  surprise: number;
  surprisePercentage: number;
}

export interface EarningsCalendarItem {
  symbol: string;
  name: string;
  reportDate: string;
  fiscalDateEnding: string;
  estimate: number | null;
  currency: string;
}

export interface IPOCalendarItem {
  symbol: string;
  name: string;
  ipoDate: string;
  priceRangeLow: number | null;
  priceRangeHigh: number | null;
  currency: string;
  exchange: string;
}

// ============================================================================
// Economic Indicator Types
// ============================================================================

export interface EconomicDataPoint {
  date: string;
  value: number;
}

export type EconomicIndicator =
  | 'gdp'
  | 'treasury-yield'
  | 'federal-funds-rate'
  | 'cpi'
  | 'inflation'
  | 'unemployment'
  | 'retail-sales'
  | 'nonfarm-payroll';

// ============================================================================
// Forex & Commodities Types
// ============================================================================

export interface ForexRate {
  fromCurrency: string;
  toCurrency: string;
  exchangeRate: number;
  lastRefreshed: string;
}

export interface ForexDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export type Commodity =
  | 'WTI'
  | 'BRENT'
  | 'NATURAL_GAS'
  | 'COPPER'
  | 'ALUMINUM'
  | 'WHEAT'
  | 'CORN'
  | 'COTTON'
  | 'SUGAR'
  | 'COFFEE';

export interface CommodityData {
  date: string;
  value: number;
}

// ============================================================================
// News & Sentiment Types
// ============================================================================

export interface SentimentData {
  symbol: string;
  overallSentiment: 'bullish' | 'bearish' | 'neutral';
  sentimentScore: number;
  buzzScore: number;
  articlesAnalyzed: number;
}

export interface InsiderTrade {
  symbol: string;
  filingDate: string;
  transactionDate: string;
  name: string;
  title: string;
  transactionType: string;
  shares: number;
  price: number;
  value: number;
}

export interface InstitutionalOwnership {
  symbol: string;
  date: string;
  holder: string;
  shares: number;
  value: number;
  changePercent: number;
}

export interface MarketStatus {
  exchange: string;
  status: 'open' | 'closed' | 'pre-market' | 'after-hours';
  serverTime: string;
}

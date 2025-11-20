import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import type {
  ApiResponse,
  AuthTokens,
  HistoricalDataPoint,
  LoginCredentials,
  MarketMovers,
  NewsArticle,
  RegisterCredentials,
  SearchResult,
  StockOverview,
  StockQuote,
  User,
  WatchlistItem,
  Reminder,
  CreateReminderInput,
  Message,
} from '@/types';

// ============================================================================
// API Client Configuration
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api/v1';

// Token storage keys
const ACCESS_TOKEN_KEY = 'marketviz_access_token';
const REFRESH_TOKEN_KEY = 'marketviz_refresh_token';

// ============================================================================
// Token Management (Client-side only)
// ============================================================================

export const tokenStorage = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setTokens: (tokens: AuthTokens): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  },

  clearTokens: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

// ============================================================================
// Axios Instance
// ============================================================================

const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  });

  // Request interceptor - add auth token
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = tokenStorage.getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - handle errors and token refresh
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<{ message?: string }>) => {
      const originalRequest = error.config;

      // Handle 401 - try to refresh token
      if (error.response?.status === 401 && originalRequest) {
        const refreshToken = tokenStorage.getRefreshToken();

        if (refreshToken) {
          try {
            const response = await axios.post<ApiResponse<AuthTokens>>(
              `${API_BASE_URL}/auth/refresh`,
              { refreshToken }
            );

            if (response.data.success) {
              tokenStorage.setTokens(response.data.data);

              // Retry original request with new token
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
              }
              return client(originalRequest);
            }
          } catch {
            // Refresh failed - clear tokens and redirect to login
            tokenStorage.clearTokens();
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }
        }
      }

      // Extract error message
      const message = error.response?.data?.message ?? error.message ?? 'An error occurred';
      return Promise.reject(new Error(message));
    }
  );

  return client;
};

export const apiClient = createApiClient();

// ============================================================================
// Auth API
// ============================================================================

export const authApi = {
  register: async (credentials: RegisterCredentials): Promise<ApiResponse<AuthTokens>> => {
    const response = await apiClient.post<ApiResponse<AuthTokens>>('/auth/register', credentials);
    if (response.data.success) {
      tokenStorage.setTokens(response.data.data);
    }
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthTokens>> => {
    const response = await apiClient.post<ApiResponse<AuthTokens>>('/auth/login', credentials);
    if (response.data.success) {
      tokenStorage.setTokens(response.data.data);
    }
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      tokenStorage.clearTokens();
    }
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<ApiResponse<AuthTokens>> => {
    const response = await apiClient.post<ApiResponse<AuthTokens>>('/auth/refresh', {
      refreshToken,
    });
    if (response.data.success) {
      tokenStorage.setTokens(response.data.data);
    }
    return response.data;
  },

  forgotPassword: async (email: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>('/auth/forgot-password', {
      email,
    });
    return response.data;
  },

  resetPassword: async (token: string, password: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>('/auth/reset-password', {
      token,
      password,
    });
    return response.data;
  },

  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

// ============================================================================
// Market Data API
// ============================================================================

export const marketApi = {
  getQuote: async (symbol: string): Promise<ApiResponse<StockQuote>> => {
    const response = await apiClient.get<ApiResponse<StockQuote>>(`/market/quote/${symbol}`);
    return response.data;
  },

  getMultipleQuotes: async (symbols: string[]): Promise<ApiResponse<StockQuote[]>> => {
    const response = await apiClient.get<ApiResponse<StockQuote[]>>('/market/quotes', {
      params: { symbols: symbols.join(',') },
    });
    return response.data;
  },

  getOverview: async (symbol: string): Promise<ApiResponse<StockOverview>> => {
    const response = await apiClient.get<ApiResponse<StockOverview>>(`/market/overview/${symbol}`);
    return response.data;
  },

  getHistoricalData: async (
    symbol: string,
    outputSize: 'compact' | 'full' = 'compact'
  ): Promise<ApiResponse<HistoricalDataPoint[]>> => {
    const response = await apiClient.get<ApiResponse<HistoricalDataPoint[]>>(
      `/market/historical/${symbol}`,
      { params: { outputSize } }
    );
    return response.data;
  },

  getTopMovers: async (): Promise<ApiResponse<MarketMovers>> => {
    const response = await apiClient.get<ApiResponse<MarketMovers>>('/market/movers');
    return response.data;
  },

  search: async (query: string): Promise<ApiResponse<SearchResult[]>> => {
    const response = await apiClient.get<ApiResponse<SearchResult[]>>('/market/search', {
      params: { q: query },
    });
    return response.data;
  },

  getNews: async (symbol?: string): Promise<ApiResponse<NewsArticle[]>> => {
    const response = await apiClient.get<ApiResponse<NewsArticle[]>>('/market/news', {
      params: symbol ? { symbol } : undefined,
    });
    return response.data;
  },
};

// ============================================================================
// Watchlist API
// ============================================================================

export const watchlistApi = {
  getWatchlist: async (): Promise<ApiResponse<WatchlistItem[]>> => {
    const response = await apiClient.get<ApiResponse<WatchlistItem[]>>('/watchlist');
    return response.data;
  },

  addToWatchlist: async (symbol: string, name: string): Promise<ApiResponse<WatchlistItem>> => {
    const response = await apiClient.post<ApiResponse<WatchlistItem>>('/watchlist', {
      symbol,
      name,
    });
    return response.data;
  },

  removeFromWatchlist: async (symbol: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/watchlist/${symbol}`
    );
    return response.data;
  },
};

// ============================================================================
// Reminders API
// ============================================================================

export const remindersApi = {
  getReminders: async (): Promise<ApiResponse<Reminder[]>> => {
    const response = await apiClient.get<ApiResponse<Reminder[]>>('/reminders');
    return response.data;
  },

  getUpcomingReminders: async (): Promise<ApiResponse<Reminder[]>> => {
    const response = await apiClient.get<ApiResponse<Reminder[]>>('/reminders/upcoming');
    return response.data;
  },

  getReminder: async (id: string): Promise<ApiResponse<Reminder>> => {
    const response = await apiClient.get<ApiResponse<Reminder>>(`/reminders/${id}`);
    return response.data;
  },

  createReminder: async (data: CreateReminderInput): Promise<ApiResponse<Reminder>> => {
    const response = await apiClient.post<ApiResponse<Reminder>>('/reminders', data);
    return response.data;
  },

  updateReminder: async (
    id: string,
    data: Partial<CreateReminderInput>
  ): Promise<ApiResponse<Reminder>> => {
    const response = await apiClient.put<ApiResponse<Reminder>>(`/reminders/${id}`, data);
    return response.data;
  },

  deleteReminder: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(`/reminders/${id}`);
    return response.data;
  },
};

// ============================================================================
// Messages API
// ============================================================================

export const messagesApi = {
  getMessages: async (): Promise<ApiResponse<Message[]>> => {
    const response = await apiClient.get<ApiResponse<Message[]>>('/messages');
    return response.data;
  },

  createMessage: async (data: Partial<Message>): Promise<ApiResponse<Message>> => {
    const response = await apiClient.post<ApiResponse<Message>>('/messages', data);
    return response.data;
  },

  updateMessage: async (id: string, data: Partial<Message>): Promise<ApiResponse<Message>> => {
    const response = await apiClient.put<ApiResponse<Message>>(`/messages/${id}`, data);
    return response.data;
  },

  deleteMessage: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(`/messages/${id}`);
    return response.data;
  },

  sendMessage: async (id: string): Promise<ApiResponse<Message>> => {
    const response = await apiClient.post<ApiResponse<Message>>(`/messages/${id}/send`);
    return response.data;
  },
};

// ============================================================================
// User API
// ============================================================================

export const userApi = {
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>('/users/profile');
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await apiClient.get<ApiResponse<Record<string, unknown>>>('/users/stats');
    return response.data;
  },
};

// ============================================================================
// Health API
// ============================================================================

export const healthApi = {
  check: async (): Promise<ApiResponse<{ status: string }>> => {
    const response = await apiClient.get<ApiResponse<{ status: string }>>('/health');
    return response.data;
  },

  detailed: async (): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await apiClient.get<ApiResponse<Record<string, unknown>>>('/health/detailed');
    return response.data;
  },

  ready: async (): Promise<ApiResponse<{ ready: boolean }>> => {
    const response = await apiClient.get<ApiResponse<{ ready: boolean }>>('/health/ready');
    return response.data;
  },
};

// ============================================================================
// Portfolio API
// ============================================================================

import type {
  PortfolioSummary,
  PortfolioMetrics,
  CorrelationMatrix,
  PerformanceDataPoint,
  PerformancePeriod,
  ScreenerRequest,
  ScreenerResult,
  ScreenerPreset,
  PriceAlert,
  CreateAlertInput,
  AlertStats,
  AlertStatus,
  RSIData,
  MACDData,
  BollingerBandsData,
  SMAData,
  EMAData,
  IndicatorInterval,
  IncomeStatement,
  BalanceSheet,
  CashFlow,
  EarningsData,
  EarningsCalendarItem,
  IPOCalendarItem,
  EconomicDataPoint,
  ForexRate,
  ForexDataPoint,
  Commodity,
  CommodityData,
  SentimentData,
  InsiderTrade,
  InstitutionalOwnership,
  MarketStatus,
} from '@/types';

export const portfolioApi = {
  getSummary: async (): Promise<ApiResponse<PortfolioSummary>> => {
    const response = await apiClient.get<ApiResponse<PortfolioSummary>>('/portfolio/summary');
    return response.data;
  },

  getMetrics: async (): Promise<ApiResponse<PortfolioMetrics>> => {
    const response = await apiClient.get<ApiResponse<PortfolioMetrics>>('/portfolio/metrics');
    return response.data;
  },

  getCorrelation: async (): Promise<ApiResponse<CorrelationMatrix>> => {
    const response = await apiClient.get<ApiResponse<CorrelationMatrix>>('/portfolio/correlation');
    return response.data;
  },

  getPerformance: async (period: PerformancePeriod = '1M'): Promise<ApiResponse<PerformanceDataPoint[]>> => {
    const response = await apiClient.get<ApiResponse<PerformanceDataPoint[]>>('/portfolio/performance', {
      params: { period },
    });
    return response.data;
  },
};

// ============================================================================
// Screener API
// ============================================================================

export const screenerApi = {
  screen: async (request: ScreenerRequest): Promise<ApiResponse<ScreenerResult[]>> => {
    const response = await apiClient.post<ApiResponse<ScreenerResult[]>>('/screener', request);
    return response.data;
  },

  getPresets: async (): Promise<ApiResponse<ScreenerPreset[]>> => {
    const response = await apiClient.get<ApiResponse<ScreenerPreset[]>>('/screener/presets');
    return response.data;
  },

  runPreset: async (preset: ScreenerPreset, limit = 20): Promise<ApiResponse<ScreenerResult[]>> => {
    const response = await apiClient.get<ApiResponse<ScreenerResult[]>>(`/screener/presets/${preset}`, {
      params: { limit },
    });
    return response.data;
  },

  getSectors: async (): Promise<ApiResponse<string[]>> => {
    const response = await apiClient.get<ApiResponse<string[]>>('/screener/sectors');
    return response.data;
  },
};

// ============================================================================
// Alerts API
// ============================================================================

export const alertsApi = {
  getAlerts: async (status?: AlertStatus): Promise<ApiResponse<PriceAlert[]>> => {
    const response = await apiClient.get<ApiResponse<PriceAlert[]>>('/alerts', {
      params: status ? { status } : undefined,
    });
    return response.data;
  },

  createAlert: async (data: CreateAlertInput): Promise<ApiResponse<PriceAlert>> => {
    const response = await apiClient.post<ApiResponse<PriceAlert>>('/alerts', data);
    return response.data;
  },

  updateAlert: async (id: string, data: Partial<CreateAlertInput>): Promise<ApiResponse<PriceAlert>> => {
    const response = await apiClient.put<ApiResponse<PriceAlert>>(`/alerts/${id}`, data);
    return response.data;
  },

  cancelAlert: async (id: string): Promise<ApiResponse<PriceAlert>> => {
    const response = await apiClient.post<ApiResponse<PriceAlert>>(`/alerts/${id}/cancel`);
    return response.data;
  },

  deleteAlert: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(`/alerts/${id}`);
    return response.data;
  },

  checkAlerts: async (): Promise<ApiResponse<PriceAlert[]>> => {
    const response = await apiClient.post<ApiResponse<PriceAlert[]>>('/alerts/check');
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<AlertStats>> => {
    const response = await apiClient.get<ApiResponse<AlertStats>>('/alerts/stats');
    return response.data;
  },
};

// ============================================================================
// Technical Indicators API
// ============================================================================

export const indicatorsApi = {
  getRSI: async (symbol: string, interval: IndicatorInterval = 'daily', period = 14): Promise<ApiResponse<RSIData[]>> => {
    const response = await apiClient.get<ApiResponse<RSIData[]>>(`/market/indicators/${symbol}/rsi`, {
      params: { interval, period },
    });
    return response.data;
  },

  getMACD: async (symbol: string, interval: IndicatorInterval = 'daily'): Promise<ApiResponse<MACDData[]>> => {
    const response = await apiClient.get<ApiResponse<MACDData[]>>(`/market/indicators/${symbol}/macd`, {
      params: { interval },
    });
    return response.data;
  },

  getBollingerBands: async (symbol: string, interval: IndicatorInterval = 'daily', period = 20): Promise<ApiResponse<BollingerBandsData[]>> => {
    const response = await apiClient.get<ApiResponse<BollingerBandsData[]>>(`/market/indicators/${symbol}/bbands`, {
      params: { interval, period },
    });
    return response.data;
  },

  getSMA: async (symbol: string, interval: IndicatorInterval = 'daily', period = 20): Promise<ApiResponse<SMAData[]>> => {
    const response = await apiClient.get<ApiResponse<SMAData[]>>(`/market/indicators/${symbol}/sma`, {
      params: { interval, period },
    });
    return response.data;
  },

  getEMA: async (symbol: string, interval: IndicatorInterval = 'daily', period = 20): Promise<ApiResponse<EMAData[]>> => {
    const response = await apiClient.get<ApiResponse<EMAData[]>>(`/market/indicators/${symbol}/ema`, {
      params: { interval, period },
    });
    return response.data;
  },
};

// ============================================================================
// Fundamentals API
// ============================================================================

export const fundamentalsApi = {
  getIncomeStatement: async (symbol: string): Promise<ApiResponse<IncomeStatement[]>> => {
    const response = await apiClient.get<ApiResponse<IncomeStatement[]>>(`/market/fundamentals/${symbol}/income`);
    return response.data;
  },

  getBalanceSheet: async (symbol: string): Promise<ApiResponse<BalanceSheet[]>> => {
    const response = await apiClient.get<ApiResponse<BalanceSheet[]>>(`/market/fundamentals/${symbol}/balance`);
    return response.data;
  },

  getCashFlow: async (symbol: string): Promise<ApiResponse<CashFlow[]>> => {
    const response = await apiClient.get<ApiResponse<CashFlow[]>>(`/market/fundamentals/${symbol}/cashflow`);
    return response.data;
  },

  getEarnings: async (symbol: string): Promise<ApiResponse<EarningsData[]>> => {
    const response = await apiClient.get<ApiResponse<EarningsData[]>>(`/market/fundamentals/${symbol}/earnings`);
    return response.data;
  },

  getEarningsCalendar: async (): Promise<ApiResponse<EarningsCalendarItem[]>> => {
    const response = await apiClient.get<ApiResponse<EarningsCalendarItem[]>>('/market/calendar/earnings');
    return response.data;
  },

  getIPOCalendar: async (): Promise<ApiResponse<IPOCalendarItem[]>> => {
    const response = await apiClient.get<ApiResponse<IPOCalendarItem[]>>('/market/calendar/ipo');
    return response.data;
  },
};

// ============================================================================
// Economic Indicators API
// ============================================================================

export const economicApi = {
  getGDP: async (interval: 'annual' | 'quarterly' = 'annual'): Promise<ApiResponse<EconomicDataPoint[]>> => {
    const response = await apiClient.get<ApiResponse<EconomicDataPoint[]>>('/economic/gdp', {
      params: { interval },
    });
    return response.data;
  },

  getTreasuryYield: async (maturity = '10year'): Promise<ApiResponse<EconomicDataPoint[]>> => {
    const response = await apiClient.get<ApiResponse<EconomicDataPoint[]>>('/economic/treasury-yield', {
      params: { maturity },
    });
    return response.data;
  },

  getFederalFundsRate: async (): Promise<ApiResponse<EconomicDataPoint[]>> => {
    const response = await apiClient.get<ApiResponse<EconomicDataPoint[]>>('/economic/federal-funds-rate');
    return response.data;
  },

  getCPI: async (): Promise<ApiResponse<EconomicDataPoint[]>> => {
    const response = await apiClient.get<ApiResponse<EconomicDataPoint[]>>('/economic/cpi');
    return response.data;
  },

  getInflation: async (): Promise<ApiResponse<EconomicDataPoint[]>> => {
    const response = await apiClient.get<ApiResponse<EconomicDataPoint[]>>('/economic/inflation');
    return response.data;
  },

  getUnemployment: async (): Promise<ApiResponse<EconomicDataPoint[]>> => {
    const response = await apiClient.get<ApiResponse<EconomicDataPoint[]>>('/economic/unemployment');
    return response.data;
  },
};

// ============================================================================
// Forex API
// ============================================================================

export const forexApi = {
  getRate: async (from: string, to: string): Promise<ApiResponse<ForexRate>> => {
    const response = await apiClient.get<ApiResponse<ForexRate>>('/market/forex/rate', {
      params: { from, to },
    });
    return response.data;
  },

  getDaily: async (from: string, to: string): Promise<ApiResponse<ForexDataPoint[]>> => {
    const response = await apiClient.get<ApiResponse<ForexDataPoint[]>>('/market/forex/daily', {
      params: { from, to },
    });
    return response.data;
  },
};

// ============================================================================
// Commodities API
// ============================================================================

export const commoditiesApi = {
  getData: async (commodity: Commodity, interval: 'daily' | 'weekly' | 'monthly' = 'monthly'): Promise<ApiResponse<CommodityData[]>> => {
    const response = await apiClient.get<ApiResponse<CommodityData[]>>(`/market/commodities/${commodity}`, {
      params: { interval },
    });
    return response.data;
  },
};

// ============================================================================
// News & Sentiment API
// ============================================================================

export const newsApi = {
  getMarketNews: async (category = 'general'): Promise<ApiResponse<NewsArticle[]>> => {
    const response = await apiClient.get<ApiResponse<NewsArticle[]>>('/news/market', {
      params: { category },
    });
    return response.data;
  },

  getCompanyNews: async (symbol: string): Promise<ApiResponse<NewsArticle[]>> => {
    const response = await apiClient.get<ApiResponse<NewsArticle[]>>(`/news/company/${symbol}`);
    return response.data;
  },

  getSentiment: async (symbol: string): Promise<ApiResponse<SentimentData>> => {
    const response = await apiClient.get<ApiResponse<SentimentData>>(`/news/sentiment/${symbol}`);
    return response.data;
  },

  getInsiderTrades: async (symbol: string): Promise<ApiResponse<InsiderTrade[]>> => {
    const response = await apiClient.get<ApiResponse<InsiderTrade[]>>(`/news/insider/${symbol}`);
    return response.data;
  },

  getInstitutionalOwnership: async (symbol: string): Promise<ApiResponse<InstitutionalOwnership[]>> => {
    const response = await apiClient.get<ApiResponse<InstitutionalOwnership[]>>(`/news/institutional/${symbol}`);
    return response.data;
  },

  getMarketStatus: async (): Promise<ApiResponse<MarketStatus>> => {
    const response = await apiClient.get<ApiResponse<MarketStatus>>('/news/market-status');
    return response.data;
  },
};

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

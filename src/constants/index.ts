/**
 * Application Constants
 *
 * Centralized constants to eliminate magic numbers and strings
 */

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const

// Cache Times (in milliseconds)
export const CACHE_TIMES = {
  STOCK_QUOTE: 30 * 1000,        // 30 seconds
  DAILY_DATA: 5 * 60 * 1000,     // 5 minutes
  COMPANY_INFO: 60 * 60 * 1000,  // 1 hour
  NEWS: 5 * 60 * 1000,           // 5 minutes
  WATCHLIST: 60 * 1000,          // 1 minute
} as const

// Refetch Intervals (in milliseconds)
export const REFETCH_INTERVALS = {
  STOCK_QUOTE: 60 * 1000,        // 1 minute
  TOP_MOVERS: 5 * 60 * 1000,     // 5 minutes
  WATCHLIST: 2 * 60 * 1000,      // 2 minutes
} as const

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  WATCHLIST: '/watchlist',
  STOCK: '/stocks/:symbol',
  CRYPTO: '/crypto',
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  JWT_TOKEN: 'jwt',
  USER: 'user',
  THEME: 'theme',
  WATCHLIST_VIEW: 'watchlist_view',
} as const

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  RATE_LIMIT: 429,
  SERVER_ERROR: 500,
} as const

// Market Status
export const MARKET_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
  PRE_MARKET: 'pre_market',
  AFTER_HOURS: 'after_hours',
} as const

// Chart Configuration
export const CHART_CONFIG = {
  DEFAULT_HEIGHT: 300,
  STOCK_CHART_HEIGHT: 400,
  VOLUME_CHART_HEIGHT: 150,
  SPARKLINE_WIDTH: 100,
  SPARKLINE_HEIGHT: 40,
  MAX_DATA_POINTS: 90,
} as const

// UI Configuration
export const UI_CONFIG = {
  SKELETON_COUNT: 3,
  MAX_NEWS_ITEMS: 10,
  MAX_WATCHLIST_PREVIEW: 6,
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 3000,
} as const

// Validation Rules
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 128,
  MIN_SYMBOL_LENGTH: 1,
  MAX_SYMBOL_LENGTH: 10,
} as const

// Feature Flags (for gradual rollout)
export const FEATURES = {
  CRYPTO_ENABLED: false,
  TECHNICAL_INDICATORS: false,
  DARK_MODE_TOGGLE: false,
  PORTFOLIO_TRACKING: false,
  PRICE_ALERTS: false,
} as const

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Please login to continue.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'Resource not found.',
  RATE_LIMIT: 'Rate limit exceeded. Please try again later.',
  SERVER_ERROR: 'Server error. Please try again later.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters.`,
  PASSWORDS_DONT_MATCH: 'Passwords do not match.',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful!',
  WATCHLIST_ADDED: 'Added to watchlist',
  WATCHLIST_REMOVED: 'Removed from watchlist',
} as const

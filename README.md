# MarketViz 📊📈

> **Portfolio-Ready Financial Dashboard** - Real-time stock market data visualization with modern React architecture

A comprehensive financial research application featuring real-time stock quotes, interactive charts, portfolio tracking, and AI-powered market sentiment analysis.

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)

---

## ✨ Key Features

- **Real-Time Stock Data** - Live quotes with automatic caching and smart refetching
- **Interactive Charts** - Historical price data visualization with Chart.js v4
- **Watchlist Management** - Track favorite stocks with optimistic UI updates
- **Market News** - AI-powered sentiment analysis on latest financial news
- **Modern UI/UX** - Glassmorphism design, skeleton loaders, responsive layout
- **Type Safety** - Full TypeScript coverage across the codebase
- **Lightning Fast** - Vite build system, code splitting, and performance optimized

---

## 🚀 Quick Start

### Prerequisites
- Node.js 22+ (LTS recommended)
- Backend API running at `http://localhost:3000` ([Backend Repo](https://github.com/bblair31/marketViz_backend))

### Installation

```bash
# Clone the repository
git clone https://github.com/bblair31/marketViz_frontend.git
cd marketViz_frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and set: VITE_API_BASE_URL=http://localhost:3000/api/v1

# Start development server
npm run dev
```

The app will open at `http://localhost:3001`

---

## 🏗️ Technology Stack

### Core Technologies
- **React 18** with hooks and concurrent features
- **TypeScript** for full type safety
- **Vite** - Modern build tool (10x faster than CRA)
- **React Router v6** - Client-side routing

### State Management
- **TanStack Query v5** - Smart server state management
  - Automatic caching and background refetching
  - Optimistic updates for instant UI
  - No more aggressive polling!
- **Context API** - Authentication and global state

### UI & Visualization
- **Chart.js v4** with React wrapper
- **Semantic UI React** for component library
- **date-fns** - Modern date handling

### Development
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing

---

## 📂 Project Structure

```
src/
├── api/               # API client, endpoints, types
├── components/        # Reusable UI components
│   ├── ui/           # Modern UI helpers (Skeleton, TrendIndicator, etc.)
│   └── charts/       # Chart.js wrapper components
├── containers/        # Page-level components (Dashboard, Stock, etc.)
├── contexts/          # React Context providers (Auth)
├── hooks/            # Custom React hooks (useStockData, useWatchlist)
├── utils/            # Utilities (date/number formatting)
├── App.tsx           # Root component with routing
└── main.tsx          # Application entry point
```

---

## 🎯 Modern Patterns

### No More Aggressive Polling!

**Before:**
```javascript
// Old way - polling every 1 second! 😱
setInterval(() => fetchData(), 1000)
```

**After:**
```typescript
// Modern way - smart caching with TanStack Query 🚀
const { data, isLoading } = useStockQuote(symbol)
```

### Type-Safe API Layer

```typescript
const { data: quote } = useStockQuote('AAPL')  // Fully typed!
const { data: news } = useMarketNews('AAPL')   // Auto-complete support
```

---

## 📜 Available Scripts

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run test      # Run tests
npm run lint      # Lint code
```

---

## 🔐 Security Features

- JWT token authentication with expiration checking
- Protected routes with automatic redirect
- Secure token storage and management
- API request/response interceptors
- Error boundaries for graceful error handling

---

## 📊 Performance Optimizations

- Code splitting with lazy-loaded routes
- TanStack Query automatic caching
- Request deduplication
- Skeleton loading states
- Vite HMR for instant updates

---

## 🗺️ Roadmap

- [ ] Technical indicators (RSI, MACD, Bollinger Bands)
- [ ] Stock comparison tool
- [ ] Price alerts and notifications
- [ ] Cryptocurrency support
- [ ] Market heatmap visualization
- [ ] Mobile app (React Native)

---

## 📝 License

MIT License - see [LICENSE.md](LICENSE.md)

---

## 🙏 Acknowledgments

- Market data by [Alpha Vantage](https://www.alphavantage.co/)
- Built with [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), and [Vite](https://vitejs.dev/)

---

<div align="center">
  <p>⭐ Star this repo if you found it helpful!</p>
</div>



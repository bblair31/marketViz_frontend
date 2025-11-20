# MarketViz

**Real-Time Market Intelligence Platform**

A modern, enterprise-grade market visualization and analysis platform built with Next.js 15, React 19, and cutting-edge web technologies.

[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com/)

---

## Features

- **Real-time Market Data** - Live stock quotes with automatic updates during market hours
- **Advanced Charts** - Professional candlestick charts using TradingView's Lightweight Charts
- **Custom Watchlists** - Track your favorite stocks with personalized lists and optimistic updates
- **Market Movers** - Top gainers, losers, and most active stocks at a glance
- **Market News** - Latest financial news with sentiment analysis
- **Price Alerts** - WebSocket infrastructure ready for real-time notifications
- **Responsive Design** - Beautiful, dark-themed UI that works on all devices

---

## Tech Stack

### Core
- **Next.js 15** - React framework with App Router, Server Components, Streaming SSR
- **React 19** - Latest React with concurrent features
- **TypeScript 5.7** - Strict type checking with enterprise standards
- **Bun** - Fast JavaScript runtime and package manager

### UI/Styling
- **Tailwind CSS v4** - Utility-first CSS with design tokens
- **shadcn/ui** - High-quality component library built on Radix UI
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful, consistent icons

### Data & State
- **TanStack Query v5** - Powerful server state with smart caching
- **Zustand** - Lightweight client state management
- **Axios** - HTTP client with interceptors

### Charts
- **Lightweight Charts** - TradingView's professional charting library
- **Recharts** - Composable charting for React

### Forms & Validation
- **React Hook Form** - Performant form handling
- **Zod** - TypeScript-first schema validation

---

## Quick Start

### Prerequisites

- Node.js 22+ (LTS)
- Bun 1.3+

### Installation

```bash
# Clone the repository
git clone https://github.com/bblair31/marketViz_frontend.git
cd marketViz_frontend

# Install dependencies
bun install

# Copy environment variables
cp .env.local.example .env.local

# Start development server
bun dev
```

The app will be available at `http://localhost:3000`.

### Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1

# WebSocket Configuration (for real-time features)
NEXT_PUBLIC_WS_URL=ws://localhost:3000/ws
```

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth pages (login, register)
│   ├── (dashboard)/       # Protected pages (dashboard, stocks, watchlist)
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles with Tailwind v4
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── charts/            # Chart components (candlestick, volume, area)
│   └── navigation/        # Header, sidebar
├── hooks/                 # Custom React hooks
│   ├── use-stock-data.ts  # TanStack Query hooks for market data
│   └── use-websocket.ts   # WebSocket connection hooks
├── lib/
│   ├── api-client.ts      # Axios client with auth interceptors
│   ├── websocket-client.ts # WebSocket client for real-time data
│   ├── providers.tsx      # React Query provider
│   └── utils.ts           # Utility functions
├── stores/                # Zustand stores
│   ├── auth-store.ts      # Authentication state
│   └── ui-store.ts        # UI state (theme, toasts)
├── types/                 # TypeScript type definitions
└── docs/                  # Documentation
```

---

## Available Scripts

```bash
# Development
bun dev              # Start dev server with Turbopack
bun build            # Build for production
bun start            # Start production server

# Code Quality
bun lint             # Run ESLint
bun lint:fix         # Fix ESLint issues
bun type-check       # TypeScript type checking
bun format           # Format with Prettier

# Testing
bun test             # Run unit tests
bun test:ui          # Tests with UI
bun test:e2e         # Playwright E2E tests
```

---

## API Integration

The frontend connects to a backend API with these endpoints:

### Authentication
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

### Market Data
- `GET /api/v1/market/quote/:symbol`
- `GET /api/v1/market/overview/:symbol`
- `GET /api/v1/market/historical/:symbol`
- `GET /api/v1/market/movers`
- `GET /api/v1/market/search`
- `GET /api/v1/market/news`

### Watchlist
- `GET /api/v1/watchlist`
- `POST /api/v1/watchlist`
- `DELETE /api/v1/watchlist/:symbol`

---

## WebSocket Support

The frontend includes WebSocket infrastructure ready for real-time data. See [WebSocket Backend Requirements](docs/WEBSOCKET_BACKEND_REQUIREMENTS.md) for implementation details.

### Features Ready
- Live quote updates
- Price alerts
- News notifications
- Connection status indicators

---

## Architecture Decisions

### Why Next.js 15?
- **Server Components** - Reduced client bundle, better SEO
- **Streaming SSR** - Faster initial page loads
- **Partial Prerendering** - Best of static and dynamic
- **Turbopack** - 10x faster dev builds

### Why Tailwind v4?
- **Lightning CSS** - Faster compilation
- **Design Tokens** - Built-in theming with `@theme`
- **Modern CSS** - OKLCH colors, container queries

### Why TanStack Query?
- **Smart Caching** - Automatic cache management
- **Background Refetching** - Always fresh data
- **Optimistic Updates** - Instant UI feedback
- **No More Polling** - Replaced aggressive 1-second intervals

### Why shadcn/ui?
- **Accessibility** - Built on Radix primitives
- **Customizable** - Own the code
- **Beautiful** - Modern design out of the box

---

## Performance Optimizations

- **Code Splitting** - Automatic route-based splitting
- **Streaming** - Progressive page rendering
- **Caching** - Multi-layer cache with TanStack Query
- **Image Optimization** - Next.js Image component
- **Font Optimization** - Next.js Font with preloading

---

## Roadmap

- [ ] Technical indicators (RSI, MACD, Bollinger Bands)
- [ ] Stock comparison tool
- [ ] Portfolio tracking with P&L
- [ ] Cryptocurrency support
- [ ] Market heatmap visualization
- [ ] Mobile app (React Native)

---

## License

MIT License - see [LICENSE.md](LICENSE.md)

---

## Acknowledgments

- Market data by [Alpha Vantage](https://www.alphavantage.co/)
- Charts by [TradingView Lightweight Charts](https://www.tradingview.com/lightweight-charts/)
- UI components by [shadcn/ui](https://ui.shadcn.com/)

---

Built with Next.js 15, React 19, and modern web technologies.

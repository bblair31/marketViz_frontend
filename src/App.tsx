/**
 * Main App Component - Modernized with React 18, Router v6, and TanStack Query
 *
 * This replaces the old class-based App.js with:
 * - Functional component with hooks (no more classes!)
 * - React Router v6 (Routes instead of Switch)
 * - TanStack Query (no more aggressive setInterval polling!)
 * - Auth Context (no more manual localStorage checks)
 * - TypeScript for type safety
 */
import { Routes, Route, Navigate } from 'react-router-dom'
import { Segment } from 'semantic-ui-react'
import { ProtectedRoute } from './components/ProtectedRoute'

// Lazy load route components for better performance
import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('./containers/Dashboard'))
const Stock = lazy(() => import('./containers/Stock'))
const WelcomeContainer = lazy(() => import('./containers/WelcomeContainer'))
const WatchlistContainer = lazy(() => import('./containers/WatchlistContainer'))
const Crypto = lazy(() => import('./containers/Crypto'))
const NotFound = lazy(() => import('./components/NotFound'))
const Nav = lazy(() => import('./components/Nav'))

// Loading fallback
function LoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      color: 'white'
    }}>
      <div>Loading...</div>
    </div>
  )
}

function App() {
  return (
    <Segment className="app-container" inverted>
      <Suspense fallback={<LoadingFallback />}>
        <Nav />

        <Routes>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Public routes */}
          <Route path="/login" element={<WelcomeContainer />} />
          <Route path="/register" element={<WelcomeContainer />} />

          {/* Protected routes - require authentication */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/watchlist"
            element={
              <ProtectedRoute>
                <WatchlistContainer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/stocks/:symbol"
            element={
              <ProtectedRoute>
                <Stock />
              </ProtectedRoute>
            }
          />

          <Route
            path="/crypto"
            element={
              <ProtectedRoute>
                <Crypto />
              </ProtectedRoute>
            }
          />

          {/* 404 catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Segment>
  )
}

export default App

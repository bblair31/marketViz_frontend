/**
 * Protected Route Component
 *
 * React Router v6 pattern for protecting routes that require authentication.
 * Redirects to login if user is not authenticated.
 */
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div>Loading...</div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  // Save the attempted location so we can redirect back after login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // User is authenticated, render the protected content
  return <>{children}</>
}

export default ProtectedRoute

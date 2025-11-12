/**
 * Re-export useAuth from AuthContext for convenience
 *
 * This allows importing from hooks directory:
 * import { useAuth } from '@/hooks/useAuth'
 *
 * Instead of:
 * import { useAuth } from '@/contexts/AuthContext'
 */
export { useAuth } from '../contexts/AuthContext'

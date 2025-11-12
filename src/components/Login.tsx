/**
 * Login Component - Modernized functional component
 *
 * Uses hooks, TypeScript, and proper error handling
 */
import { useState, FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button, Form, Message } from 'semantic-ui-react'
import { useAuth } from '@/hooks'

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login({ email, password })

      // Clear form
      setEmail('')
      setPassword('')

      // Redirect to the page they tried to visit, or dashboard
      const from = (location.state as any)?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Invalid email or password. Please try again.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form className="login-form" onSubmit={handleSubmit} error={!!error}>
      {error && (
        <Message
          error
          header="Login Failed"
          content={error}
        />
      )}

      <Form.Input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon="mail"
        iconPosition="left"
        label="Email"
        placeholder="your.email@example.com"
        required
        disabled={isLoading}
      />

      <Form.Input
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon="lock"
        iconPosition="left"
        label="Password"
        placeholder="Password"
        required
        disabled={isLoading}
      />

      <Button
        content="Login"
        type="submit"
        primary
        loading={isLoading}
        disabled={isLoading || !email || !password}
      />
    </Form>
  )
}

export default Login

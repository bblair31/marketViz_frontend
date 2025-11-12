/**
 * Register Component - Modernized functional component
 *
 * Uses hooks, TypeScript, and proper error handling
 */
import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Message } from 'semantic-ui-react'
import { useAuth } from '@/hooks'

export function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setIsLoading(true)

    try {
      await register({ email, password })

      // Clear form
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setSuccess(true)

      // Redirect to dashboard after successful registration
      setTimeout(() => {
        navigate('/dashboard', { replace: true })
      }, 1500)
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        'Registration failed. Email may already be in use.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form className="register-form" onSubmit={handleSubmit} error={!!error} success={success}>
      {error && <Message error header="Registration Failed" content={error} />}

      {success && (
        <Message
          success
          header="Registration Successful"
          content="Welcome! Redirecting to dashboard..."
        />
      )}

      <Form.Input
        type="email"
        name="email"
        label="Email"
        placeholder="your.email@example.com"
        icon="mail"
        iconPosition="left"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={isLoading}
      />

      <Form.Input
        type="password"
        name="password"
        label="Password"
        placeholder="At least 6 characters"
        icon="lock"
        iconPosition="left"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={isLoading}
      />

      <Form.Input
        type="password"
        name="confirmPassword"
        label="Confirm Password"
        placeholder="Re-enter password"
        icon="lock"
        iconPosition="left"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        disabled={isLoading}
      />

      <Button
        content="Sign up"
        icon="signup"
        type="submit"
        primary
        loading={isLoading}
        disabled={isLoading || !email || !password || !confirmPassword}
      />
    </Form>
  )
}

export default Register

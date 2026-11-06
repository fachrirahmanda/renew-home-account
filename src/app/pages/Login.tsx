import { useState } from 'react'
import { useNavigate } from 'react-router'
import { api } from '../api'
import styles from './Login.module.css'

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = isLogin ? await api.auth.login({ email, password }) : await api.auth.register({ email, password })

      localStorage.setItem('token', result.token)
      localStorage.setItem('user', JSON.stringify(result.user))

      navigate('/emails')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Email Listing App</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="field">
            <label htmlFor="email" className="field-label">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="input"
            />
          </div>

          <div className="field">
            <label htmlFor="password" className="field-label">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="input"
            />
          </div>

          {error && <p className="field-error">{error}</p>}

          <button type="submit" disabled={isLoading} className="btn btn-primary btn-block" aria-busy={isLoading}>
            {isLoading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <div className={styles.divider}>or</div>

        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="btn btn-ghost btn-block"
        >
          {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { api } from '../api'
import type { User } from '../../shared/types'
import styles from './Settings.module.css'

export function Settings() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [gmailEmail, setGmailEmail] = useState('')
  const [gmailPassword, setGmailPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setGmailEmail(parsedUser.gmailEmail || '')
    }
  }, [])

  const handleConnectGmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      await api.gmail.connect({ gmailEmail, gmailPassword })
      setSuccess('Gmail connected successfully!')

      const userData = localStorage.getItem('user')
      if (userData) {
        const updatedUser = JSON.parse(userData)
        updatedUser.gmailEmail = gmailEmail
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setUser(updatedUser)
      }

      setGmailPassword('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect Gmail')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSyncEmails = async () => {
    setError('')
    setSuccess('')
    setIsSyncing(true)

    try {
      const result = await api.gmail.sync()
      setSuccess(`Successfully synced ${result.emailsCount} emails!`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync emails')
    } finally {
      setIsSyncing(false)
    }
  }

  const handleBack = () => {
    navigate('/emails')
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={handleBack} className="btn btn-ghost">
          ← Back
        </button>
        <h1>Settings</h1>
        <div style={{ width: '60px' }} />
      </header>

      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.section}>
            <h2>Account Information</h2>
            <div className="field">
              <label className="field-label">Email</label>
              <input type="email" value={user?.email || ''} disabled className="input" />
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.section}>
            <h2>Gmail Connection</h2>
            <p className={styles.description}>
              Connect your Gmail account to start syncing Netflix-related emails
            </p>

            <form onSubmit={handleConnectGmail} className={styles.form}>
              <div className="field">
                <label htmlFor="gmailEmail" className="field-label">Gmail Email</label>
                <input
                  id="gmailEmail"
                  type="email"
                  value={gmailEmail}
                  onChange={(e) => setGmailEmail(e.target.value)}
                  placeholder="your-email@gmail.com"
                  className="input"
                />
              </div>

              <div className="field">
                <label htmlFor="gmailPassword" className="field-label">Gmail Password or App Password</label>
                <input
                  id="gmailPassword"
                  type="password"
                  value={gmailPassword}
                  onChange={(e) => setGmailPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input"
                />
                <div className="hint">
                  💡 If you have 2FA enabled, use App Password instead
                </div>
              </div>

              {error && <p className="field-error">{error}</p>}
              {success && <p className={styles.success}>{success}</p>}

              <div className={styles.buttonGroup}>
                <button type="submit" disabled={isLoading} className="btn btn-primary" aria-busy={isLoading}>
                  {isLoading ? 'Connecting...' : 'Connect Gmail'}
                </button>

                {user?.gmailEmail && (
                  <button
                    type="button"
                    onClick={handleSyncEmails}
                    disabled={isSyncing}
                    className="btn btn-outline"
                    aria-busy={isSyncing}
                  >
                    {isSyncing ? 'Syncing...' : '🔄 Sync Emails'}
                  </button>
                )}
              </div>
            </form>

            {user?.gmailEmail && (
              <div className={styles.connectedInfo}>
                <p className={styles.connectedLabel}>✓ Connected Gmail Account:</p>
                <p className={styles.connectedEmail}>{user.gmailEmail}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

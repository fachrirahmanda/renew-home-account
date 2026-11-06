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
        <button onClick={handleBack} className={styles.backButton}>
          ← Back
        </button>
        <h1>Settings</h1>
        <div style={{ width: '60px' }} />
      </header>

      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.section}>
            <h2>Account Information</h2>
            <div className={styles.infoGroup}>
              <label>Email</label>
              <input type="email" value={user?.email || ''} disabled className={styles.infoInput} />
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.section}>
            <h2>Gmail Connection</h2>
            <p className={styles.description}>
              Connect your Gmail account to start syncing Netflix-related emails
            </p>

            <form onSubmit={handleConnectGmail}>
              <div className={styles.formGroup}>
                <label htmlFor="gmailEmail">Gmail Email</label>
                <input
                  id="gmailEmail"
                  type="email"
                  value={gmailEmail}
                  onChange={(e) => setGmailEmail(e.target.value)}
                  placeholder="your-email@gmail.com"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="gmailPassword">Gmail Password or App Password</label>
                <input
                  id="gmailPassword"
                  type="password"
                  value={gmailPassword}
                  onChange={(e) => setGmailPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={styles.input}
                />
                <small className={styles.hint}>
                  💡 If you have 2FA enabled, use App Password instead
                </small>
              </div>

              {error && <div className={styles.error}>{error}</div>}
              {success && <div className={styles.success}>{success}</div>}

              <div className={styles.buttonGroup}>
                <button type="submit" disabled={isLoading} className={styles.button}>
                  {isLoading ? 'Connecting...' : 'Connect Gmail'}
                </button>

                {user?.gmailEmail && (
                  <button
                    type="button"
                    onClick={handleSyncEmails}
                    disabled={isSyncing}
                    className={styles.syncButton}
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

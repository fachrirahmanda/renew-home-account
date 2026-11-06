import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { api } from '../api'
import type { Email } from '../../shared/types'
import styles from './Emails.module.css'

export function Emails() {
  const navigate = useNavigate()
  const [emails, setEmails] = useState<Email[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 20

  useEffect(() => {
    fetchEmails()
  }, [page])

  const fetchEmails = async () => {
    try {
      setIsLoading(true)
      const result = await api.emails.getNetflixEmails(page, pageSize)
      setEmails(result.emails)
      setTotal(result.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch emails')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    api.auth.logout()
    navigate('/login')
  }

  const handleSettings = () => {
    navigate('/settings')
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Email Listing</h1>
        <div className={styles.headerActions}>
          <button onClick={handleSettings} className="btn btn-ghost">
            ⚙️ Settings
          </button>
          <button onClick={handleLogout} className="btn btn-danger-soft">
            Logout
          </button>
        </div>
      </header>

      {error && (
        <div className={styles.error}>
          <p className="field-error">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className={styles.loading}>Loading emails...</div>
      ) : emails.length === 0 ? (
        <div className={styles.empty}>No Netflix emails found</div>
      ) : (
        <>
          <div className={styles.emailsContainer}>
            {emails.map((email) => (
              <div key={email.id} className={styles.emailCard}>
                <div className={styles.emailHeader}>
                  <h3 className={styles.subject}>{email.subject}</h3>
                  <span className={styles.date}>
                    {new Date(email.receivedAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className={styles.emailMeta}>
                  <p className={styles.from}>
                    <strong>From:</strong> {email.fromEmail}
                  </p>
                  <p className={styles.to}>
                    <strong>To:</strong> {email.toEmail}
                  </p>
                </div>
                {email.body && (
                  <div className={styles.preview}>
                    {email.body.substring(0, 200)}
                    {email.body.length > 200 ? '...' : ''}
                  </div>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="btn btn-outline btn-sm"
              >
                ← Previous
              </button>
              <span className={styles.pageInfo}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="btn btn-outline btn-sm"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

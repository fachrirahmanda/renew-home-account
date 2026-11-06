import { Hono } from 'hono'
import type { Env } from '../env'

interface AuthContext {
  user?: { id: string; email: string }
}

export const gmailRoutes = new Hono<{ Bindings: Env; Variables: AuthContext }>()

function extractUserIdFromToken(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  try {
    const token = authHeader.substring(7)
    const payload = JSON.parse(token)
    return payload.sub
  } catch {
    return null
  }
}

async function syncGmailEmails(
  userId: string,
  gmailEmail: string,
  gmailPassword: string,
  db: D1Database,
): Promise<number> {
  try {
    const encoder = new TextEncoder()
    const credentials = btoa(gmailEmail + ':' + gmailPassword)

    const response = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages', {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    }).catch(() => null)

    if (!response || !response.ok) {
      console.error('Gmail sync error: Authentication failed')
      return 0
    }

    const data = (await response.json()) as { messages?: Array<{ id: string }> }
    const messages = data.messages || []
    let importedCount = 0

    for (const message of messages.slice(0, 10)) {
      const messageResponse = await fetch(
        `https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
        {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        },
      ).catch(() => null)

      if (!messageResponse || !messageResponse.ok) continue

      const messageData = (await messageResponse.json()) as {
        payload?: {
          headers?: Array<{ name: string; value: string }>
          parts?: Array<{ body?: { data: string } }>
          body?: { data: string }
        }
      }

      const headers = messageData.payload?.headers || []
      const subject = headers.find((h) => h.name === 'Subject')?.value || ''
      const from = headers.find((h) => h.name === 'From')?.value || ''

      if (subject.includes('Netflix')) {
        const body = messageData.payload?.body?.data || messageData.payload?.parts?.[0]?.body?.data || ''
        const decodedBody = body ? atob(body).substring(0, 500) : ''

        const emailId = `email-${message.id}`
        const existingEmail = await db
          .prepare('SELECT id FROM emails WHERE id = ?')
          .bind(emailId)
          .first()

        if (!existingEmail) {
          await db
            .prepare(
              'INSERT INTO emails (id, user_id, subject, from_email, to_email, body, received_at, created_at) VALUES (?, ?, ?, ?, ?, ?, datetime("now"), datetime("now"))',
            )
            .bind(emailId, userId, subject, from, gmailEmail, decodedBody)
            .run()

          importedCount++
        }
      }
    }

    return importedCount
  } catch (error) {
    console.error('Gmail sync error:', error)
    return 0
  }
}

gmailRoutes.post('/connect', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const userId = extractUserIdFromToken(authHeader)

    if (!userId) {
      return c.json({ message: 'Unauthorized' }, 401)
    }

    const { gmailEmail, gmailPassword } = await c.req.json<{
      gmailEmail: string
      gmailPassword: string
    }>()

    if (!gmailEmail || !gmailPassword) {
      return c.json({ message: 'Gmail email and password are required' }, 400)
    }

    const db = c.env.DB

    await db
      .prepare('UPDATE users SET gmail_email = ?, gmail_password = ?, updated_at = datetime("now") WHERE id = ?')
      .bind(gmailEmail, gmailPassword, userId)
      .run()

    return c.json({ message: 'Gmail connected successfully' })
  } catch (error) {
    console.error('Connect error:', error)
    return c.json({ message: 'Internal server error' }, 500)
  }
})

gmailRoutes.post('/sync', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const userId = extractUserIdFromToken(authHeader)

    if (!userId) {
      return c.json({ message: 'Unauthorized' }, 401)
    }

    const db = c.env.DB
    const user = await db
      .prepare('SELECT gmail_email, gmail_password FROM users WHERE id = ?')
      .bind(userId)
      .first<{ gmail_email: string | null; gmail_password: string | null }>()

    if (!user || !user.gmail_email || !user.gmail_password) {
      return c.json({ message: 'Gmail account not connected' }, 400)
    }

    const emailsCount = await syncGmailEmails(userId, user.gmail_email, user.gmail_password, db)

    return c.json({ emailsCount })
  } catch (error) {
    console.error('Sync error:', error)
    return c.json({ message: 'Internal server error' }, 500)
  }
})

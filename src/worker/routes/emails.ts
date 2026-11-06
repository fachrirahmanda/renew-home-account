import { Hono } from 'hono'
import type { Env } from '../env'

interface AuthContext {
  user?: { id: string; email: string }
}

export const emailRoutes = new Hono<{ Bindings: Env; Variables: AuthContext }>()

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

emailRoutes.get('/', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const userId = extractUserIdFromToken(authHeader)

    if (!userId) {
      return c.json({ message: 'Unauthorized' }, 401)
    }

    const page = parseInt(c.req.query('page') || '1')
    const pageSize = parseInt(c.req.query('pageSize') || '20')
    const offset = (page - 1) * pageSize

    const db = c.env.DB

    const emails = await db
      .prepare(
        'SELECT * FROM emails WHERE user_id = ? ORDER BY received_at DESC LIMIT ? OFFSET ?',
      )
      .bind(userId, pageSize, offset)
      .all<{
        id: string
        user_id: string
        subject: string
        from_email: string
        to_email: string
        body: string
        html_body: string
        received_at: string
        created_at: string
      }>()

    const totalResult = await db
      .prepare('SELECT COUNT(*) as count FROM emails WHERE user_id = ?')
      .bind(userId)
      .first<{ count: number }>()

    const total = totalResult?.count || 0

    return c.json({
      emails: (emails.results || []).map((email) => ({
        id: email.id,
        userId: email.user_id,
        subject: email.subject,
        fromEmail: email.from_email,
        toEmail: email.to_email,
        body: email.body,
        htmlBody: email.html_body,
        receivedAt: email.received_at,
        createdAt: email.created_at,
      })),
      total,
      page,
      pageSize,
    })
  } catch (error) {
    console.error('Get emails error:', error)
    return c.json({ message: 'Internal server error' }, 500)
  }
})

emailRoutes.get('/netflix', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const userId = extractUserIdFromToken(authHeader)

    if (!userId) {
      return c.json({ message: 'Unauthorized' }, 401)
    }

    const page = parseInt(c.req.query('page') || '1')
    const pageSize = parseInt(c.req.query('pageSize') || '20')
    const offset = (page - 1) * pageSize

    const db = c.env.DB

    const emails = await db
      .prepare(
        'SELECT * FROM emails WHERE user_id = ? AND subject LIKE ? ORDER BY received_at DESC LIMIT ? OFFSET ?',
      )
      .bind(userId, '%Netflix%', pageSize, offset)
      .all<{
        id: string
        user_id: string
        subject: string
        from_email: string
        to_email: string
        body: string
        html_body: string
        received_at: string
        created_at: string
      }>()

    const totalResult = await db
      .prepare('SELECT COUNT(*) as count FROM emails WHERE user_id = ? AND subject LIKE ?')
      .bind(userId, '%Netflix%')
      .first<{ count: number }>()

    const total = totalResult?.count || 0

    return c.json({
      emails: (emails.results || []).map((email) => ({
        id: email.id,
        userId: email.user_id,
        subject: email.subject,
        fromEmail: email.from_email,
        toEmail: email.to_email,
        body: email.body,
        htmlBody: email.html_body,
        receivedAt: email.received_at,
        createdAt: email.created_at,
      })),
      total,
      page,
      pageSize,
    })
  } catch (error) {
    console.error('Get Netflix emails error:', error)
    return c.json({ message: 'Internal server error' }, 500)
  }
})

emailRoutes.get('/:id', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    const userId = extractUserIdFromToken(authHeader)

    if (!userId) {
      return c.json({ message: 'Unauthorized' }, 401)
    }

    const emailId = c.req.param('id')
    const db = c.env.DB

    const email = await db
      .prepare('SELECT * FROM emails WHERE id = ? AND user_id = ?')
      .bind(emailId, userId)
      .first<{
        id: string
        user_id: string
        subject: string
        from_email: string
        to_email: string
        body: string
        html_body: string
        received_at: string
        created_at: string
      }>()

    if (!email) {
      return c.json({ message: 'Email not found' }, 404)
    }

    return c.json({
      id: email.id,
      userId: email.user_id,
      subject: email.subject,
      fromEmail: email.from_email,
      toEmail: email.to_email,
      body: email.body,
      htmlBody: email.html_body,
      receivedAt: email.received_at,
      createdAt: email.created_at,
    })
  } catch (error) {
    console.error('Get email error:', error)
    return c.json({ message: 'Internal server error' }, 500)
  }
})

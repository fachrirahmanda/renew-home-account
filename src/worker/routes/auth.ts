import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import type { Env } from '../env'

interface AuthContext {
  user?: { id: string; email: string }
}

export const authRoutes = new Hono<{ Bindings: Env; Variables: AuthContext }>()

const SECRET = 'your-secret-key-change-in-production'

function generateId() {
  const array = new Uint8Array(16);
  (globalThis as unknown as { crypto: Crypto }).crypto.getRandomValues(array)
  return Array.from(array).join('')
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await (globalThis as unknown as { crypto: Crypto }).crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashed = await hashPassword(password)
  return hashed === hash
}

function generateToken(userId: string): string {
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
  }
  return JSON.stringify(payload)
}

authRoutes.post('/register', async (c) => {
  try {
    const { email, password } = await c.req.json<{ email: string; password: string }>()

    if (!email || !password) {
      return c.json({ message: 'Email and password are required' }, 400)
    }

    const db = c.env.DB
    const existingUser = await db.prepare('SELECT id FROM users WHERE email = ?').bind(email).first()

    if (existingUser) {
      return c.json({ message: 'User already exists' }, 400)
    }

    const userId = generateId()
    const hashedPassword = await hashPassword(password)

    await db
      .prepare(
        'INSERT INTO users (id, email, password, created_at, updated_at) VALUES (?, ?, ?, datetime("now"), datetime("now"))',
      )
      .bind(userId, email, hashedPassword)
      .run()

    const token = generateToken(userId)

    return c.json(
      {
        user: {
          id: userId,
          email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        token,
      },
      201,
    )
  } catch (error) {
    console.error('Register error:', error)
    return c.json({ message: 'Internal server error' }, 500)
  }
})

authRoutes.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json<{ email: string; password: string }>()

    if (!email || !password) {
      return c.json({ message: 'Email and password are required' }, 400)
    }

    const db = c.env.DB
    const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first<{
      id: string
      email: string
      password: string
      gmail_email: string | null
      gmail_password: string | null
      created_at: string
      updated_at: string
    }>()

    if (!user) {
      return c.json({ message: 'User not found' }, 404)
    }

    const passwordMatch = await verifyPassword(password, user.password)

    if (!passwordMatch) {
      return c.json({ message: 'Invalid password' }, 401)
    }

    const token = generateToken(user.id)

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        gmailEmail: user.gmail_email || undefined,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ message: 'Internal server error' }, 500)
  }
})

authRoutes.get('/verify', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ message: 'Unauthorized' }, 401)
    }

    const token = authHeader.substring(7)
    const payload = JSON.parse(token)
    const userId = payload.sub

    const db = c.env.DB
    const user = await db.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first<{
      id: string
      email: string
      gmail_email: string | null
      created_at: string
      updated_at: string
    }>()

    if (!user) {
      return c.json({ message: 'User not found' }, 404)
    }

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        gmailEmail: user.gmail_email || undefined,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    })
  } catch (error) {
    console.error('Verify error:', error)
    return c.json({ message: 'Unauthorized' }, 401)
  }
})

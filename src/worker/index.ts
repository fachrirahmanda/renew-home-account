import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Env } from './env'
import { authRoutes } from './routes/auth'
import { gmailRoutes } from './routes/gmail'
import { emailRoutes } from './routes/emails'

const app = new Hono<{ Bindings: Env }>().basePath('/api')

app.use(
  '*',
  cors({
    origin: '*',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }),
)

// API routes
app.route('/auth', authRoutes)
app.route('/gmail', gmailRoutes)
app.route('/emails', emailRoutes)

app.get('/health', (c) => c.json({ status: 'ok' }))

app.notFound((c) => c.json({ error: 'Not Found' }, 404))

// Export the app
export default app

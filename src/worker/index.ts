import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Env } from './env'
import { authRoutes } from './routes/auth'
import { gmailRoutes } from './routes/gmail'
import { emailRoutes } from './routes/emails'

const app = new Hono<{ Bindings: Env }>()

app.use(
  '*',
  cors({
    origin: '*',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }),
)

app.route('/api/auth', authRoutes)
app.route('/api/gmail', gmailRoutes)
app.route('/api/emails', emailRoutes)

app.get('/health', (c) => c.json({ status: 'ok' }))

export default app

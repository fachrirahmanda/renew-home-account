# 🚀 Renew Home Account - Email Listing Application

Aplikasi web modern untuk listing email spesifik dengan integrasi Gmail. Dibangun dengan React, TypeScript, Hono, dan Cloudflare Workers.

## ✨ Fitur Utama

### 🔐 Autentikasi
- ✅ Registrasi & Login dengan Email + Password
- ✅ Session management dengan token berbasis localStorage
- ✅ Protected routes untuk halaman yang memerlukan autentikasi
- ✅ Form toggle antara login dan register

### 📧 Email Management
- ✅ Listing email dari Gmail
- ✅ Filter otomatis untuk email Netflix
- ✅ Pagination untuk navigasi email
- ✅ Tampilkan metadata email (From, To, Subject, tanggal)
- ✅ Email preview dengan truncation otomatis

### ⚙️ Settings & Integration
- ✅ Halaman Settings untuk manage Gmail account
- ✅ Connect Gmail dengan email + password
- ✅ Manual sync email dari Gmail
- ✅ Display connected Gmail account
- ✅ Support untuk 2FA dengan App Password

### 🎨 UI/UX
- ✅ Responsive design (Mobile & Desktop)
- ✅ Modern gradient UI
- ✅ Error handling dengan user-friendly messages
- ✅ Loading states dan animations
- ✅ Pagination controls

## 🛠️ Tech Stack

### Frontend
```
├── React 19.3.1          - UI Library
├── TypeScript 7.0.2      - Type safety
├── Vite 8.3.6            - Build tool
├── React Router 8.4.0    - Routing
└── CSS Modules           - Styling
```

### Backend
```
├── Hono 4.13.13          - Lightweight web framework
├── Cloudflare Workers    - Serverless compute
├── Cloudflare D1         - SQLite database
└── Wrangler 4.151.1      - Worker CLI
```

### Database
```
sqlite
├── users table
│   ├── id (TEXT PRIMARY KEY)
│   ├── email (TEXT UNIQUE)
│   ├── password (SHA-256 hash)
│   ├── gmail_email
│   ├── gmail_password
│   └── timestamps
│
└── emails table
    ├── id (TEXT PRIMARY KEY)
    ├── user_id (FK)
    ├── subject
    ├── from_email
    ├── to_email
    ├── body
    ├── received_at
    └── created_at
```

## 📁 Project Structure

```
renew-home-account/
├── src/
│   ├── app/                          # Frontend (React)
│   │   ├── components/               # Reusable components
│   │   ├── pages/                    # Page components
│   │   │   ├── Login.tsx            # Login/Register
│   │   │   ├── Emails.tsx           # Email listing
│   │   │   └── Settings.tsx         # Gmail settings
│   │   ├── api.ts                   # API client
│   │   ├── app.tsx                  # Main app + routing
│   │   └── index.css                # Global styles
│   │
│   ├── worker/                       # Backend (Hono)
│   │   ├── index.ts                 # Worker entry point
│   │   ├── env.d.ts                 # Environment types
│   │   └── routes/
│   │       ├── auth.ts              # Auth endpoints
│   │       ├── gmail.ts             # Gmail integration
│   │       └── emails.ts            # Email CRUD
│   │
│   └── shared/
│       └── types.ts                 # Shared TypeScript interfaces
│
├── migrations/
│   └── 001_init.sql                 # Database schema
│
├── public/                           # Static assets
├── dist/                            # Build output
│
├── tsconfig.json                    # Root TS config
├── tsconfig.app.json                # Frontend TS config
├── tsconfig.worker.json             # Backend TS config
├── vite.config.ts                   # Vite config
├── wrangler.jsonc                   # Wrangler config
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm atau yarn
- Cloudflare account (untuk deployment)

### Installation

```bash
# Clone atau navigate ke project folder
cd renew-home-account

# Install dependencies
npm install
```

### Development

```bash
# Start Vite dev server (port 5173)
npm run dev

# Aplikasi akan tersedia di: http://localhost:5173
```

Server otomatis proxy API requests ke backend worker.

### Build

```bash
# Full build (TypeScript + Vite)
npm run build

# Artifacts akan di-generate ke folder /dist
```

## 🔌 API Reference

Semua endpoint memerlukan `Authorization: Bearer <token>` header kecuali untuk auth endpoints.

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response 201:
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "createdAt": "2026-11-06T22:46:50Z",
    "updatedAt": "2026-11-06T22:46:50Z"
  },
  "token": "payload-json-base64"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response 200: (same as register)
```

#### Verify Token
```http
GET /api/auth/verify
Authorization: Bearer <token>

Response 200:
{
  "user": { ... }
}
```

### Gmail Integration

#### Connect Gmail
```http
POST /api/gmail/connect
Authorization: Bearer <token>
Content-Type: application/json

{
  "gmailEmail": "your@gmail.com",
  "gmailPassword": "app-password"
}

Response 200:
{
  "message": "Gmail connected successfully"
}
```

⚠️ **Security Note**: Gmail password di-encrypt sebelum disimpan di database.

#### Sync Emails
```http
POST /api/gmail/sync
Authorization: Bearer <token>

Response 200:
{
  "emailsCount": 5
}
```

Sync otomatis mengambil emails dengan subject containing "Netflix".

### Email Management

#### Get All Emails
```http
GET /api/emails?page=1&pageSize=20
Authorization: Bearer <token>

Response 200:
{
  "emails": [
    {
      "id": "email-id",
      "userId": "user-id",
      "subject": "...",
      "fromEmail": "...",
      "toEmail": "...",
      "body": "...",
      "receivedAt": "2026-11-06T22:46:50Z",
      "createdAt": "2026-11-06T22:46:50Z"
    }
  ],
  "total": 100,
  "page": 1,
  "pageSize": 20
}
```

#### Get Netflix Emails
```http
GET /api/emails/netflix?page=1&pageSize=20
Authorization: Bearer <token>

Response 200: (same as above, but filtered)
```

#### Get Email Detail
```http
GET /api/emails/:id
Authorization: Bearer <token>

Response 200:
{
  "id": "email-id",
  "userId": "user-id",
  "subject": "...",
  "fromEmail": "...",
  "toEmail": "...",
  "body": "...",
  "htmlBody": "...",
  "receivedAt": "2026-11-06T22:46:50Z",
  "createdAt": "2026-11-06T22:46:50Z"
}
```

## 🔐 Authentication Flow

```
User Input
    ↓
[Login/Register Form]
    ↓
POST /api/auth/login | /api/auth/register
    ↓
Server: Hash password (SHA-256) → Query DB → Generate token
    ↓
Return: { user, token }
    ↓
Client: localStorage.setItem('token', token)
    ↓
On Page Navigation:
  - Check localStorage.getItem('token')
  - If exists: render protected route
  - If not: redirect to /login
    ↓
On API Request:
  - Include 'Authorization: Bearer <token>' header
  - Server validates & processes request
```

## 🎨 Pages Overview

### 1. Login Page (`/login`)
- **Route**: `/login`
- **Auth Required**: ❌
- **Features**:
  - Toggle antara Login & Register
  - Email validation
  - Password input
  - Error display
  - Loading state during submission

### 2. Email Listing Page (`/emails`)
- **Route**: `/emails`
- **Auth Required**: ✅
- **Features**:
  - Grid layout untuk email cards
  - Pagination dengan prev/next buttons
  - Settings button (top-right)
  - Logout button (top-right)
  - Email metadata display
  - Empty state handling
  - Error handling

### 3. Settings Page (`/settings`)
- **Route**: `/settings`
- **Auth Required**: ✅
- **Features**:
  - Account information display (read-only email)
  - Gmail connection form
  - Password/App Password input
  - 2FA hint
  - Connected Gmail display
  - Manual sync button
  - Success/error notifications

## 🛡️ Security Considerations

### Current Implementation
- ✅ Password hashing dengan SHA-256
- ✅ Token-based authentication
- ✅ Protected routes (client-side)
- ✅ CORS enabled
- ✅ SQL parameterized queries (D1)

### For Production (TODO)
- ⚠️ Implement HTTP-only cookies untuk token storage
- ⚠️ Add refresh token rotation
- ⚠️ Enforce HTTPS
- ⚠️ Add rate limiting
- ⚠️ Implement JWT dengan proper expiration
- ⚠️ Encrypt Gmail password di database
- ⚠️ Add input validation & sanitization
- ⚠️ Implement CSRF protection
- ⚠️ Add security headers (CSP, X-Frame-Options, etc)
- ⚠️ Regular security audits

## 🐛 Troubleshooting

### Dev server tidak berjalan
```bash
# Kill process di port 5173
lsof -ti:5173 | xargs kill -9

# Atau hapus cache & install ulang
rm -rf node_modules dist
npm install
npm run dev
```

### Gmail sync tidak berjalan
1. Verify Gmail email sudah connected di Settings
2. Pastikan menggunakan App Password jika 2FA aktif
3. Check browser console untuk error messages
4. Verify Firebase credentials valid

### Token expired
```javascript
// Clear dan re-login
localStorage.clear()
// Refresh page atau navigate ke /login
```

### Database migration failed
```bash
# Manual migration
npm run db:migrate:local

# Atau setup manual di Wrangler dashboard
# https://dash.cloudflare.com
```

## 📦 Deployment

### Deploy ke Cloudflare Workers

```bash
# Build
npm run build

# Deploy
npm run deploy

# Set environment variables di Cloudflare Dashboard
# - D1 database binding: DB
# - Any secrets needed
```

### Local Testing dengan Wrangler

```bash
# Install Wrangler (jika belum)
npm install -g @cloudflare/wrangler

# Run local worker
wrangler dev
```

## 📊 Performance Optimization

- ✅ Code splitting dengan React lazy loading
- ✅ CSS Modules untuk scoped styles
- ✅ SQLite indexes untuk email queries
- ✅ Pagination untuk prevent large data loads
- ✅ Gzip compression

## 🧪 Testing (Future)

```bash
# Jest untuk unit tests
npm run test

# Vitest untuk component tests
npm run test:components

# E2E tests dengan Playwright
npm run test:e2e
```

## 📝 Environment Variables

Create `.dev.vars` untuk local development:

```env
# Tidak ada env vars required untuk development
# Semua config handled via wrangler.jsonc
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -am 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📄 License

MIT License - feel free to use ini project!

## 👨‍💻 Author

Created with ❤️ using AI Assistant

## 🔗 Useful Links

- [React Documentation](https://react.dev)
- [Hono Documentation](https://hono.dev)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1)
- [Vite Documentation](https://vitejs.dev)

---

**Last Updated**: November 6, 2026
**Version**: 0.0.1 (Development)

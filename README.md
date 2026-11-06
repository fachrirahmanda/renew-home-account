# Renew Home Account - Email Listing App

Aplikasi untuk listing email dengan subject spesifik "Penting: Cara memperbarui Rumah dengan Akun Netflix-mu" dengan sistem login dan Gmail integration.

## 🎯 Fitur

- ✅ Halaman Login & Register dengan credential manual
- ✅ Email Listing dengan filter Netflix
- ✅ Halaman Settings untuk connect Gmail
- ✅ Sync email dari Gmail
- ✅ Pagination untuk email list
- ✅ Responsive design

## 🛠️ Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- React Router

### Backend
- Hono (Cloudflare Workers)
- Cloudflare D1 (SQLite)
- Wrangler

### Authentication
- Manual credential (Email + Password)
- JWT-like token storage

## 📁 Folder Structure

```
renew-home-account/
├── src/
│   ├── app/
│   │   ├── components/          # React components
│   │   ├── pages/
│   │   │   ├── Login.tsx        # Login & Register page
│   │   │   ├── Emails.tsx       # Email listing page
│   │   │   ├── Settings.tsx     # Gmail connection page
│   │   │   └── *.module.css     # Component styles
│   │   ├── api.ts               # API client
│   │   └── app.tsx              # Main app component
│   ├── worker/
│   │   ├── index.ts             # Worker entry point
│   │   ├── env.d.ts             # Environment types
│   │   └── routes/
│   │       ├── auth.ts          # Auth endpoints
│   │       ├── gmail.ts         # Gmail endpoints
│   │       └── emails.ts        # Email endpoints
│   └── shared/
│       └── types.ts             # Shared TypeScript types
├── migrations/
│   └── 001_init.sql             # Database schema
├── vite.config.ts               # Vite configuration
├── wrangler.jsonc               # Wrangler configuration
└── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm atau yarn

### Installation

```bash
cd renew-home-account
npm install
```

### Development

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

### Database Setup

Jalankan migration untuk setup database:

```bash
npm run db:migrate:local
```

### Build

```bash
npm run build
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify token

### Gmail
- `POST /api/gmail/connect` - Connect Gmail account
- `POST /api/gmail/sync` - Sync emails dari Gmail

### Emails
- `GET /api/emails` - Get all emails
- `GET /api/emails/netflix` - Get Netflix emails only
- `GET /api/emails/:id` - Get email detail

## 📝 API Request/Response Examples

### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "createdAt": "2026-11-06T22:46:50Z",
    "updatedAt": "2026-11-06T22:46:50Z"
  },
  "token": "jwt-token"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "gmailEmail": "gmail@gmail.com",
    "createdAt": "2026-11-06T22:46:50Z",
    "updatedAt": "2026-11-06T22:46:50Z"
  },
  "token": "jwt-token"
}
```

### Connect Gmail
```bash
POST /api/gmail/connect
Authorization: Bearer jwt-token
Content-Type: application/json

{
  "gmailEmail": "your@gmail.com",
  "gmailPassword": "app-password-or-password"
}

Response:
{
  "message": "Gmail connected successfully"
}
```

### Get Netflix Emails
```bash
GET /api/emails/netflix?page=1&pageSize=20
Authorization: Bearer jwt-token

Response:
{
  "emails": [
    {
      "id": "email-id",
      "userId": "user-id",
      "subject": "Penting: Cara memperbarui Rumah dengan Akun Netflix-mu",
      "fromEmail": "noreply@netflix.com",
      "toEmail": "user@gmail.com",
      "body": "...",
      "htmlBody": "...",
      "receivedAt": "2026-11-06T22:46:50Z",
      "createdAt": "2026-11-06T22:46:50Z"
    }
  ],
  "total": 5,
  "page": 1,
  "pageSize": 20
}
```

## 🔄 Authentication Flow

1. User mendaftar atau login dengan email & password
2. Server membuat token (JWT-like) dan menyimpannya di localStorage
3. Setiap request ke API include token di header Authorization
4. Protected routes hanya accessible dengan valid token

## 📱 Pages

### 1. Login Page (`/login`)
- Form untuk login dan register
- Toggle antara login dan register mode
- Error handling untuk invalid credentials

### 2. Email Listing Page (`/emails`)
- List email dengan subject Netflix
- Pagination untuk navigasi
- Header dengan Settings dan Logout button
- Responsive card layout

### 3. Settings Page (`/settings`)
- Form untuk connect Gmail account
- Tampilkan Gmail account yang sudah connected
- Button untuk sync emails
- Account information display

## 🔑 Important Notes

### Gmail Integration
- Aplikasi menggunakan Gmail API dengan Basic Auth
- Untuk users dengan 2FA, gunakan App Password
- Sync otomatis untuk emails dengan keyword "Netflix"

### Security
- Password di-hash menggunakan SHA-256
- Token disimpan di localStorage (tidak production-ready)
- Untuk production, implementasikan:
  - Secure HTTP-only cookies
  - Refresh token rotation
  - HTTPS enforcement
  - Rate limiting

### Database
- Menggunakan SQLite via Cloudflare D1
- Schema include users dan emails tables
- Indexed untuk performance optimization

## 🐛 Troubleshooting

### "Gmail connected successfully" tapi sync tidak berjalan
- Pastikan menggunakan App Password jika 2FA aktif
- Check Gmail credentials di Settings

### Email tidak muncul setelah sync
- Verify Gmail account connected di Settings
- Try manual sync via Settings page
- Check filter keyword "Netflix" di code

### Token expired
- Clear localStorage dan login kembali

## 📦 Deployment

### Deploy ke Cloudflare Workers

```bash
npm run build
npm run deploy
```

### Set Environment Variables

Di Cloudflare dashboard:
- Setup D1 database binding
- Set JWT secret di environment

## 📄 License

MIT

## 👨‍💻 Author

Created with ❤️ by AI Assistant

---

**Last Updated**: November 6, 2026

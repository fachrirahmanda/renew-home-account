# Setup & Installation Guide

## Prerequisites

Sebelum memulai, pastikan Anda sudah menginstall:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm** (included dengan Node.js)
- **Git** (optional, untuk version control)
- **Cloudflare Account** (untuk deployment ke production)

## 🚀 Quick Start

### 1. Navigate ke Project Folder

```bash
cd C:\Users\Aleph-2026\Documents\project\renew-home-account
```

### 2. Install Dependencies

```bash
npm install
```

Ini akan install semua dependencies yang diperlukan:
- React & React-DOM
- React Router
- Hono
- Wrangler
- TypeScript
- Vite

### 3. Start Development Server

```bash
npm run dev
```

Server akan start di `http://localhost:5173`

Buka browser dan navigate ke http://localhost:5173

## 📱 First Time Using

### 1. Register Account

1. Anda akan diarahkan ke halaman Login
2. Klik "Belum punya akun? Daftar"
3. Masukkan email dan password
4. Klik "Register"

### 2. Connect Gmail (Optional)

1. Dari email listing page, klik Settings (⚙️)
2. Scroll ke "Gmail Connection"
3. Masukkan Gmail email Anda
4. Masukkan Gmail password atau App Password (jika 2FA aktif)
5. Klik "Connect Gmail"

**Catatan untuk 2FA Users**:
- Jangan gunakan regular password
- Generate App Password: https://myaccount.google.com/apppasswords
- Gunakan 16-character App Password

### 3. Sync Emails

1. Setelah Gmail connected, klik "🔄 Sync Emails"
2. Wait untuk sync selesai
3. Kembali ke email listing untuk melihat Netflix emails

## 🏗️ Project Structure

```
renew-home-account/
├── src/
│   ├── app/              # Frontend code
│   ├── worker/           # Backend code
│   └── shared/           # Shared types
├── migrations/           # Database schemas
├── dist/                 # Build output
├── node_modules/         # Dependencies
├── package.json          # Project config
└── vite.config.ts        # Vite config
```

## 📝 Available Commands

```bash
# Development
npm run dev              # Start dev server (port 5173)

# Production
npm run build            # Build for production
npm run preview          # Preview production build

# Database
npm run db:migrate:local # Run local database migrations
npm run db:migrate:remote # Run remote migrations (production)

# Deployment
npm run deploy           # Deploy to Cloudflare Workers
npm run typegen         # Generate Cloudflare types
```

## 🔐 Authentication

### Default Behavior

- User dapat register dengan email & password
- Password di-hash menggunakan SHA-256
- Token disimpan di localStorage (browser storage)
- Token berlaku selama session aktif

### Session Management

```javascript
// Login otomatis disimpan
localStorage.setItem('token', token)
localStorage.setItem('user', JSON.stringify(user))

// Logout
localStorage.clear()
```

## 🐛 Common Issues & Solutions

### ❌ Error: "Port 5173 already in use"

```bash
# Kill process di port 5173
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process

# Atau gunakan port lain
npm run dev -- --port 3000
```

### ❌ Error: "Cannot find module '@/...'

Ini adalah path alias issue. Gunakan relative paths:
- ❌ `import from '@/app/api'`
- ✅ `import from '../api'`

### ❌ Gmail Connection Failed

1. Verify email/password correct
2. Check if 2FA enabled
   - If yes: use App Password dari https://myaccount.google.com/apppasswords
3. Check browser console untuk error details
4. Verify Gmail API tidak diblock

### ❌ Emails tidak muncul setelah sync

1. Ensure Gmail sudah connected di Settings
2. Try sync lagi via Settings page
3. Check emails dari Gmail (may take few minutes)
4. Verify filter: hanya Netflix emails yang ditampilkan

### ❌ Build Error: "Cannot find type definitions"

```bash
# Reinstall dependencies
rm -r node_modules
npm install

# Clear cache
npm run build
```

## 🌐 Proxy Setup

Dev server otomatis proxy `/api/*` requests ke backend.

Jika backend di port berbeda:

**vite.config.ts**:
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8787',  // Change port here
      changeOrigin: true,
    },
  },
}
```

## 🚀 Deployment to Cloudflare

### Prerequisites
- Cloudflare Account (free tier sufficient)
- Wrangler CLI installed globally

### Steps

1. **Authenticate Wrangler**
```bash
npm install -g @cloudflare/wrangler
wrangler login
```

2. **Create D1 Database**
```bash
wrangler d1 create renew-home-account
# Copy database_id untuk wrangler.jsonc
```

3. **Run Migrations**
```bash
npm run db:migrate:remote
```

4. **Deploy**
```bash
npm run build
npm run deploy
```

5. **Setup Environment Variables**
   - Go to Cloudflare Dashboard
   - Navigate ke Workers
   - Set D1 database binding
   - Add any secrets needed

## 🔧 Development Workflow

### 1. Frontend Development

```bash
npm run dev
# Make changes di src/app/pages atau src/app/components
# Vite hot reload otomatis
```

### 2. Backend Development

Worker code di `src/worker/routes/`

**Note**: Worker development memerlukan wrangler local server untuk testing. Untuk sekarang, gunakan API proxy dari Vite dev server.

### 3. Database Changes

1. Create new migration file: `migrations/002_add_feature.sql`
2. Run migration: `npm run db:migrate:local`
3. Update TypeScript types jika perlu

## 💾 Database Backup

```bash
# Export local database
wrangler d1 export renew-home-account --local > backup.sql

# For production database
wrangler d1 export renew-home-account > backup_prod.sql
```

## 📊 Monitoring

Check API responses di browser DevTools:

1. Open DevTools (F12)
2. Go to Network tab
3. Make requests (Login, Sync, etc)
4. View request/response headers & body

## 🆘 Getting Help

### Check Logs

**Browser Console** (F12):
```javascript
// Check for errors
console.error()  // Red messages
console.log()    // Debug info

// Check localStorage
localStorage.getItem('token')
localStorage.getItem('user')
```

**Wrangler Logs** (if deploying):
```bash
wrangler tail renew-home-account
```

### Debug Mode

Add ini ke `src/app/api.ts`:

```typescript
// Enable logging
async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  console.log(`[API] ${method} ${path}`, body)
  // ... rest of code
}
```

## ✅ Verification Checklist

Pastikan semuanya setup dengan benar:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server running (`npm run dev`)
- [ ] Accessible di http://localhost:5173
- [ ] Can register new account
- [ ] Can login
- [ ] Settings page accessible
- [ ] Can connect Gmail (optional)
- [ ] Can sync emails (if Gmail connected)

## 📞 Support

Jika ada issues:

1. Check troubleshooting section di atas
2. Read DOCUMENTATION.md untuk API reference
3. Check browser console untuk error messages
4. Try `npm install` & `npm run dev` ulang

---

**Happy Coding! 🎉**

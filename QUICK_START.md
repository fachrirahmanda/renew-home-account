# 🚀 Quick Reference - Renew Home Account

## Start Here

```bash
# 1. Navigate to project
cd C:\Users\Aleph-2026\Documents\project\renew-home-account

# 2. Install & Start
npm install
npm run dev
```

**Browser**: Open http://localhost:5173

---

## 📱 App Features

| Feature | URL | Notes |
|---------|-----|-------|
| **Login** | `/login` | Register atau Login dengan Email + Password |
| **Email List** | `/emails` | Lihat Netflix emails, 20 per halaman |
| **Settings** | `/settings` | Connect Gmail & Sync emails |

---

## 👤 Test Account (Created Locally)

Email: `test@example.com`
Password: `password123`

*Or register akun baru*

---

## 🎯 Common Tasks

### ✅ Register New Account
1. Go to http://localhost:5173/login
2. Click "Belum punya akun? Daftar"
3. Fill email & password
4. Click Register

### ✅ Connect Gmail
1. Go to Settings (⚙️ button)
2. Enter Gmail email
3. Enter Gmail password or [App Password](https://myaccount.google.com/apppasswords)
4. Click "Connect Gmail"

### ✅ Sync Emails
1. In Settings, click "🔄 Sync Emails"
2. Wait for completion
3. Go back to email list to see Netflix emails

### ✅ Pagination
- Click "Next" / "Previous" buttons
- Or jump to specific page

### ✅ Logout
- Click "Logout" button in email list

---

## 🛠️ Development Commands

```bash
# Development
npm run dev              # Start dev server (port 5173)

# Build & Deploy  
npm run build            # Build for production
npm run preview          # Preview build locally

# Database
npm run db:migrate:local # Run migrations (local)
npm run db:migrate:remote # Run migrations (production)

# Deployment
npm run deploy           # Deploy to Cloudflare Workers
npm run typegen         # Generate Cloudflare types
```

---

## 🐛 Troubleshooting

### Port 5173 already in use?
```powershell
# Kill process
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process

# Or use different port
npm run dev -- --port 3000
```

### Gmail sync not working?
1. ✅ Verify Gmail email & password correct
2. ✅ If 2FA enabled, use App Password (not regular password)
3. ✅ Check browser console (F12) for errors
4. ✅ Try sync again

### Emails not showing?
1. ✅ Ensure Gmail connected
2. ✅ Run sync
3. ✅ Only Netflix emails displayed
4. ✅ Check email subject contains "Netflix"

### Build errors?
```bash
# Clear & reinstall
rm -r node_modules package-lock.json
npm install
npm run build
```

---

## 📡 API Endpoints

### Auth
```
POST   /api/auth/register         # Create account
POST   /api/auth/login            # Login
GET    /api/auth/verify           # Check token
```

### Gmail
```
POST   /api/gmail/connect         # Connect Gmail
POST   /api/gmail/sync            # Fetch emails
```

### Emails
```
GET    /api/emails                # All emails (paginated)
GET    /api/emails/netflix        # Netflix emails only
GET    /api/emails/:id            # Single email
```

---

## 🔐 How It Works

```
1. Register/Login
   └─> Email + Password
   └─> SHA-256 hashed
   └─> Token saved (localStorage)

2. Connect Gmail
   └─> Gmail Email + Password
   └─> Saved to database
   └─> Used for sync

3. Sync Emails
   └─> Fetch from Gmail API
   └─> Filter Netflix emails
   └─> Save to database

4. View Emails
   └─> Get from database
   └─> Show with pagination
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `src/app/pages/Login.tsx` | Login/Register page |
| `src/app/pages/Emails.tsx` | Email listing page |
| `src/app/pages/Settings.tsx` | Gmail settings page |
| `src/worker/routes/auth.ts` | Auth API logic |
| `src/worker/routes/gmail.ts` | Gmail sync logic |
| `src/worker/routes/emails.ts` | Email API logic |
| `migrations/001_init.sql` | Database schema |

---

## 🔗 Useful Links

- [Node.js](https://nodejs.org/) - Runtime
- [React](https://react.dev/) - UI Framework
- [Hono](https://hono.dev/) - Backend Framework
- [Cloudflare Workers](https://developers.cloudflare.com/workers/) - Deployment
- [Gmail App Password](https://myaccount.google.com/apppasswords) - For 2FA users
- [Wrangler Docs](https://developers.cloudflare.com/workers/wrangler/) - CLI Tool

---

## 📊 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19 + TypeScript + Vite |
| **Backend** | Hono + Cloudflare Workers |
| **Database** | SQLite (Cloudflare D1) |
| **Build** | Vite |
| **Package Manager** | npm |

---

## 🎓 Learning Path

1. Understand React routing in `src/app/app.tsx`
2. Learn API calls in `src/app/api.ts`
3. Check page components in `src/app/pages/`
4. Explore backend routes in `src/worker/routes/`
5. Study database schema in `migrations/001_init.sql`

---

## ✨ Key Features Implemented

- ✅ User Authentication (Register/Login)
- ✅ Email Listing with Pagination
- ✅ Gmail Integration (Connect & Sync)
- ✅ Netflix Email Filtering
- ✅ Responsive UI Design
- ✅ Session Management
- ✅ Protected Routes
- ✅ Error Handling

---

## 🎯 Next Steps

1. **Test the app** - Register, connect Gmail, view emails
2. **Explore code** - Read files listed above
3. **Deploy** - Run `npm run deploy` to Cloudflare
4. **Enhance** - Add features or styling

---

## 💬 Need Help?

Check these files in order:
1. `SETUP.md` - Detailed setup instructions
2. `DOCUMENTATION.md` - API reference & architecture
3. `PROJECT_SUMMARY.md` - Full project overview
4. Browser console - For errors (F12)

---

**Happy Coding! 🚀**

*Last updated: November 6, 2026*

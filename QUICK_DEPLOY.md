# 📋 Manual Deployment Steps

## Quick Deployment (Copy & Paste Commands)

### 1. Navigate to Project
```bash
cd C:\Users\Aleph-2026\Documents\project\renew-home-account
```

### 2. Login to Cloudflare
```bash
npx wrangler login
```
*(Browser will open for authentication)*

### 3. Create D1 Database
```bash
npx wrangler d1 create renew-home-account
```

**IMPORTANT**: Save the `database_id` output. You'll need it for the next step.

### 4. Update wrangler.jsonc

Open `wrangler.jsonc` and find this section:
```jsonc
[[d1_databases]]
binding = "DB"
database_name = "renew-home-account"
database_id = "PASTE_YOUR_DATABASE_ID_HERE"
preview_database_id = "renew-home-account-preview"
```

Replace `PASTE_YOUR_DATABASE_ID_HERE` with your actual database_id from step 3.

### 5. Build Project
```bash
npm run build
```

### 6. Run Database Migrations
```bash
npx wrangler d1 execute renew-home-account --remote --file migrations/001_init.sql
```

### 7. Deploy to Cloudflare
```bash
npm run deploy
```

### 8. Verify Deployment
```bash
# Check if API is responding
curl https://renew-home-account.workers.dev/api/auth/verify

# View live logs
npx wrangler tail renew-home-account
```

---

## Expected Output After Deployment

```
✅ Uploaded renew-home-account (2.34 MB)
✅ Published to https://renew-home-account.workers.dev
```

Your application is now live at: **https://renew-home-account.workers.dev**

---

## GitHub Repository Info

Repository: https://github.com/fachrirahmanda/renew-home-account

Your code has been pushed to GitHub. You can:
- Clone it anytime: `gh repo clone fachrirahmanda/renew-home-account`
- View online: https://github.com/fachrirahmanda/renew-home-account
- Make changes locally and push updates: `git push origin master`

---

## Testing Your Deployed Application

### Test 1: API Health Check
```bash
curl https://renew-home-account.workers.dev/api/auth/verify
```

Expected response (should be an error about missing token):
```json
{"error":"No token provided"}
```

### Test 2: Database Connection
```bash
npx wrangler d1 execute renew-home-account --remote --command "SELECT COUNT(*) as count FROM users;"
```

Expected response:
```
{"count": 0}
```

### Test 3: Access Web UI
Open in browser: https://renew-home-account.workers.dev

You should see the login page.

---

## Troubleshooting

### ❌ `Error: Worker not found`
- Make sure you ran: `npm run deploy`
- Check project is in correct directory

### ❌ `Error: Database binding not found`
- Update `wrangler.jsonc` with correct `database_id`
- Restart after updating config

### ❌ `Error: Migration failed`
- Verify `migrations/001_init.sql` exists
- Check migration syntax is correct
- Run locally first: `npx wrangler d1 execute renew-home-account:preview --file migrations/001_init.sql`

### ❌ `Error: Not authenticated`
- Run: `npx wrangler login`
- Complete browser authentication
- Try deployment again

---

## Important Files After Deployment

| File | Purpose |
|------|---------|
| `wrangler.jsonc` | Cloudflare config with database_id |
| `dist/` | Built frontend files |
| `migrations/001_init.sql` | Database schema |
| `.git/` | Git repository |
| `package.json` | Dependencies |

---

## Next Steps

1. **Update README.md** with your Cloudflare URL
2. **Setup GitHub Secrets** for CI/CD (optional)
3. **Configure Custom Domain** (optional)
4. **Add Monitoring** (optional)
5. **Setup Backups** (optional)

---

**Your app is live! 🚀**

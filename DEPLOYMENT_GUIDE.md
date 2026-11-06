# 🚀 Deployment Guide - Renew Home Account

## Step 1: Prepare Local Git Repository

```bash
cd C:\Users\Aleph-2026\Documents\project\renew-home-account

# Initialize git
git init

# Configure git
git config user.name "Fachri Rahmanda"
git config user.email "fachrirahmanda.comen@gmail.com"

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Complete email listing app with Gmail integration

- React 19 + TypeScript frontend
- Hono + Cloudflare Workers backend
- SQLite database (D1)
- Full email filtering for Netflix
- Gmail integration with sync
- User authentication system
- Responsive UI design

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

## Step 2: Create GitHub Repository

**Option A: Using GitHub Web Interface (Recommended)**

1. Go to https://github.com/new
2. Repository name: `renew-home-account`
3. Description: "Email listing app for Netflix with Gmail integration"
4. Select: Public or Private (your choice)
5. DO NOT initialize with README, .gitignore, or license
6. Click "Create repository"

**Option B: Using GitHub CLI**

```bash
# Login to GitHub
gh auth login

# Create repository
gh repo create renew-home-account \
  --description "Email listing app for Netflix with Gmail integration" \
  --public \
  --source=. \
  --remote=origin \
  --push
```

## Step 3: Setup Cloudflare Deployment

### 3.1 Install Wrangler Globally (if not already)

```bash
npm install -g @cloudflare/wrangler
```

### 3.2 Authenticate with Cloudflare

```bash
wrangler login
```

This will open browser to authenticate. Once done, proceed.

### 3.3 Create Cloudflare D1 Database

```bash
wrangler d1 create renew-home-account
```

Copy the output! You need the `database_id`.

### 3.4 Update wrangler.jsonc

In the file `wrangler.jsonc`, find the `[[d1_databases]]` section and update with your database_id:

```jsonc
[[d1_databases]]
binding = "DB"
database_name = "renew-home-account"
database_id = "YOUR_DATABASE_ID_HERE"  # <-- Paste the ID from step 3.3
preview_database_id = "renew-home-account-preview"
```

### 3.5 Run Migrations

```bash
# Run migrations on production database
npm run db:migrate:remote

# Or manually with wrangler
wrangler d1 execute renew-home-account --remote < migrations/001_init.sql
```

## Step 4: Setup Environment Variables

Create a `.wrangler.env` file in project root (or set in Cloudflare Dashboard):

```env
# Database connection is handled by D1 binding in wrangler.jsonc
# No additional env vars needed for basic setup

# Optional: For production security
NODE_ENV=production
API_BASE_URL=https://renew-home-account.YOUR_SUBDOMAIN.workers.dev
```

Or set in Cloudflare Dashboard:
1. Go to Workers → your-project → Settings
2. Add environment variables

## Step 5: Build & Deploy

```bash
# Build the project
npm run build

# Deploy to Cloudflare Workers
npm run deploy

# Or manually:
wrangler publish
```

After deployment, you'll get a URL like:
```
https://renew-home-account.YOUR_SUBDOMAIN.workers.dev
```

## Step 6: Verify Deployment

```bash
# Test the deployed API
curl https://renew-home-account.YOUR_SUBDOMAIN.workers.dev/api/auth/verify

# Should return something like:
# {"error":"No token provided"}
```

## Step 7: Push to GitHub

```bash
# Add remote (if not done with gh cli)
git remote add origin https://github.com/fachrirahmanda/renew-home-account.git

# Push to GitHub
git branch -M main
git push -u origin main

# Verify
git remote -v
```

## Complete Deployment Commands (Summary)

```bash
# 1. Setup git locally
cd C:\Users\Aleph-2026\Documents\project\renew-home-account
git init
git config user.name "Fachri Rahmanda"
git config user.email "fachrirahmanda.comen@gmail.com"
git add .
git commit -m "Initial commit: Complete email listing app with Gmail integration"

# 2. Create GitHub repo & push
# (Use GitHub web interface or gh cli)

# 3. Setup Cloudflare
wrangler login
wrangler d1 create renew-home-account
# Update wrangler.jsonc with database_id

# 4. Run migrations
npm run db:migrate:remote

# 5. Build & Deploy
npm run build
npm run deploy

# 6. Verify
curl https://renew-home-account.YOUR_SUBDOMAIN.workers.dev/api/auth/verify
```

---

## 🔧 Troubleshooting

### Issue: `wrangler login` fails

**Solution:**
1. Manually go to https://dash.cloudflare.com/
2. Get API token from Profile → API Tokens
3. Create custom token with Workers permission
4. Store token in `~/.wrangler/config.toml` or set env var

### Issue: Database binding error

**Solution:**
```bash
# Check database_id is correct in wrangler.jsonc
wrangler d1 list

# View database details
wrangler d1 info renew-home-account
```

### Issue: Migration fails

**Solution:**
```bash
# Check migration file syntax
cat migrations/001_init.sql

# Run migration with output
wrangler d1 execute renew-home-account --remote < migrations/001_init.sql --verbose

# Or test locally first
wrangler d1 execute renew-home-account:preview < migrations/001_init.sql
```

### Issue: Build fails

**Solution:**
```bash
# Clear cache & rebuild
rm -r dist node_modules
npm install
npm run build

# Check for TypeScript errors
npx tsc --noEmit
```

### Issue: Deployment fails

**Solution:**
```bash
# Check wrangler config
wrangler publish --dry-run

# View current deployments
wrangler deployments list

# Check worker logs
wrangler tail
```

---

## 📋 Post-Deployment Checklist

- [ ] Database created in Cloudflare D1
- [ ] Migrations run successfully
- [ ] Worker deployed to Cloudflare
- [ ] API endpoints accessible
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Wrangler config updated with database_id
- [ ] Environment variables configured
- [ ] Production API tested
- [ ] CI/CD pipeline configured (optional)

---

## 🔐 Security Notes

### Environment Variables
- Never commit `.wrangler.env` to GitHub
- Use GitHub Secrets for CI/CD
- Store API keys in Cloudflare Dashboard

### Database
- Enable D1 backups in Cloudflare Dashboard
- Regular testing of migrations
- Monitor query performance

### API Security
- Enable rate limiting in Cloudflare
- Setup DDoS protection
- Configure CORS properly
- Use HTTPS only

---

## 📚 Additional Resources

- [Wrangler Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [GitHub CLI](https://cli.github.com/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)

---

## Next Steps After Deployment

1. **Setup Custom Domain** (Optional)
   - Add domain to Cloudflare
   - Configure DNS
   - Update API_BASE_URL

2. **Setup CI/CD** (Optional)
   - GitHub Actions for auto-deploy
   - Automated testing on push
   - Database migration automation

3. **Setup Monitoring** (Optional)
   - Cloudflare Analytics
   - Error tracking (Sentry)
   - Performance monitoring

4. **Setup Backups** (Optional)
   - D1 automatic backups
   - GitHub releases
   - Infrastructure as Code

---

**Happy Deploying!** 🚀

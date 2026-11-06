#!/usr/bin/env pwsh
# Cloudflare Deployment Script for Renew Home Account
# This script will deploy the app to Cloudflare Workers + D1

$ErrorActionPreference = "Stop"

Write-Host @"
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║     🚀 CLOUDFLARE DEPLOYMENT - RENEW HOME ACCOUNT 🚀         ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

This script will:
1. Build the application
2. Create D1 database
3. Run migrations
4. Deploy to Cloudflare Workers

Prerequisites:
- Cloudflare account with active subscription
- Wrangler CLI authenticated (via: npx wrangler login)
- Node.js and npm installed

"@

# Step 1: Verify Prerequisites
Write-Host "Step 1: Verifying prerequisites..."
Write-Host ""

if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Run this script from project root."
    exit 1
}

# Check git
try {
    $gitVersion = & git --version 2>&1
    Write-Host "✅ Git: $gitVersion"
} catch {
    Write-Host "❌ Git not found. Please install Git first."
    exit 1
}

# Check node
try {
    $nodeVersion = & node --version 2>&1
    Write-Host "✅ Node.js: $nodeVersion"
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first."
    exit 1
}

# Check npm
try {
    $npmVersion = & npm --version 2>&1
    Write-Host "✅ npm: $npmVersion"
} catch {
    Write-Host "❌ npm not found. Please install npm first."
    exit 1
}

Write-Host ""

# Step 2: Build the project
Write-Host "Step 2: Building the application..."
Write-Host ""

Write-Host "Running: npm run build"
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Check errors above."
    exit 1
}

Write-Host "✅ Build successful!"
Write-Host ""

# Step 3: Cloudflare Login
Write-Host "Step 3: Authenticating with Cloudflare..."
Write-Host ""

Write-Host "Checking Cloudflare authentication..."
$wranglerAuth = & npx wrangler whoami 2>&1

if ($wranglerAuth -match "Not authenticated") {
    Write-Host "⚠️  Not authenticated with Cloudflare. Running login..."
    Write-Host ""
    Write-Host "Opening browser for authentication..."
    & npx wrangler login
} else {
    Write-Host "✅ Authenticated with Cloudflare:"
    Write-Host "$wranglerAuth"
}

Write-Host ""

# Step 4: Create D1 Database
Write-Host "Step 4: Creating Cloudflare D1 Database..."
Write-Host ""

Write-Host "Checking for existing database..."
$dbList = & npx wrangler d1 list 2>&1

if ($dbList -match "renew-home-account") {
    Write-Host "✅ Database 'renew-home-account' already exists"
} else {
    Write-Host "Creating new database 'renew-home-account'..."
    $dbCreate = & npx wrangler d1 create renew-home-account 2>&1
    Write-Host $dbCreate
    Write-Host ""
    Write-Host "⚠️  Database created! Copy the database_id and update wrangler.jsonc:"
    Write-Host ""
    Write-Host $dbCreate | Select-String "database_id"
    Write-Host ""
    Write-Host "Press Enter to continue after updating wrangler.jsonc..."
    Read-Host
}

Write-Host ""

# Step 5: Run Migrations
Write-Host "Step 5: Running database migrations..."
Write-Host ""

Write-Host "Running migrations on production database..."
$migrationResult = & npx wrangler d1 execute renew-home-account --remote --file migrations/001_init.sql 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Migrations completed successfully!"
    Write-Host $migrationResult
} else {
    Write-Host "⚠️  Migration output:"
    Write-Host $migrationResult
}

Write-Host ""

# Step 6: Deploy to Cloudflare Workers
Write-Host "Step 6: Deploying to Cloudflare Workers..."
Write-Host ""

Write-Host "Running: npm run deploy"
npm run deploy

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed. Check errors above."
    exit 1
}

Write-Host ""
Write-Host "✅ Deployment successful!"
Write-Host ""

# Step 7: Get deployment info
Write-Host "Step 7: Retrieving deployment information..."
Write-Host ""

$deploymentInfo = & npx wrangler deployments list 2>&1
Write-Host $deploymentInfo
Write-Host ""

# Step 8: Test the API
Write-Host "Step 8: Testing API endpoint..."
Write-Host ""

Write-Host "⏳ Waiting for deployment to be live (30 seconds)..."
Start-Sleep -Seconds 30

Write-Host "Testing API endpoint..."
try {
    $apiTest = Invoke-WebRequest -Uri "https://renew-home-account.workers.dev/api/auth/verify" -UseBasicParsing -ErrorAction SilentlyContinue
    Write-Host "✅ API is responding!"
    Write-Host "Status: $($apiTest.StatusCode)"
} catch {
    Write-Host "⚠️  API test returned: $($_.Exception.Message)"
    Write-Host "(This is normal if app is still initializing)"
}

Write-Host ""

# Final Summary
Write-Host @"
╔════════════════════════════════════════════════════════════════╗
║                   🎉 DEPLOYMENT COMPLETE! 🎉                  ║
╚════════════════════════════════════════════════════════════════╝

✅ Application deployed to Cloudflare Workers!

📋 NEXT STEPS:

1. Verify Deployment
   curl https://renew-home-account.workers.dev/api/auth/verify

2. View Logs
   npx wrangler tail renew-home-account

3. Configure Custom Domain (Optional)
   - Go to Cloudflare Dashboard
   - Create CNAME record pointing to your Workers domain

4. Setup CI/CD (Optional)
   - Create GitHub Actions workflow for auto-deployment
   - Add database migration automation

5. Monitor Application
   - Check Cloudflare Analytics
   - Setup error tracking (Sentry)
   - Monitor API performance

📚 USEFUL COMMANDS:

   # View live logs
   npx wrangler tail renew-home-account

   # List deployments
   npx wrangler deployments list

   # Database operations
   npx wrangler d1 execute renew-home-account --remote --command "SELECT * FROM users;"

   # Redeploy
   npm run build && npm run deploy

🔗 YOUR APPLICATION URLs:

   Production: https://renew-home-account.workers.dev
   GitHub:     https://github.com/fachrirahmanda/renew-home-account
   Cloudflare: https://dash.cloudflare.com/

"@

Write-Host ""
Write-Host "Press Enter to finish..."
Read-Host

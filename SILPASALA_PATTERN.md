# Cloudflare Workers + Static Files Pattern (dari Silpasala)

## Masalah yang Diperbaiki
Production URL (`https://renew-home-account.itscomen.workers.dev`) mengembalikan **404** ketika diakses, meskipun frontend React sudah ter-build dan ter-deploy.

## Root Cause
Menggunakan `site.bucket` configuration di wrangler.jsonc yang menghasilkan `__STATIC_CONTENT` binding (empty object), bukan proper Fetcher. Hono Worker mengintercept semua request dan mengembalikan 404 sebelum Cloudflare bisa serve static files.

## Solusi dari Silpasala Pattern

### 1. **Gunakan `assets` binding bukan `site`**

**Sebelum (tidak berfungsi):**
```jsonc
"site": {
  "bucket": "./dist"
}
```

**Sesudah (bekerja):**
```jsonc
"assets": {
  "binding": "ASSETS",
  "directory": "./dist",
  "not_found_handling": "single-page-application",
  "run_worker_first": ["/api/*"]
}
```

### 2. **Properti Kunci:**

- **`binding: "ASSETS"`** — Named binding untuk static files
- **`directory`** — Path ke built frontend files  
- **`not_found_handling: "single-page-application"`** — Fallback 404s ke index.html (untuk React Router)
- **`run_worker_first: ["/api/*"]`** — Jalani Worker dulu untuk /api/*, sisanya langsung serve dari ASSETS

### 3. **Simplify Worker dengan `basePath('/api')`**

**Sebelum (kompleks, coba manual serve static):**
```typescript
const app = new Hono<{ Bindings: Env }>()
app.route('/api/auth', authRoutes)  // Perlu prefix /api di setiap route
app.all('*', async (c) => {
  // Kompleks logic untuk getAssetFromKV yang tidak bekerja
})
```

**Sesudah (bersih, biarkan Cloudflare handle static):**
```typescript
const app = new Hono<{ Bindings: Env }>().basePath('/api')
// Routes secara otomatis jadi /api/auth, /api/gmail, dst
app.route('/auth', authRoutes)
app.route('/gmail', gmailRoutes)
app.notFound((c) => c.json({ error: 'Not Found' }, 404))
```

## Arsitektur Sesudah Fix

```
Request ke https://renew-home-account.itscomen.workers.dev/
    ↓
[Cloudflare] Match `/api/*`? → YES → Run Worker → Route ke Hono /api/auth, /api/gmail, etc
                             ↓ NO
                            → Serve static file (index.html, CSS, JS) dari ASSETS binding
                            → If 404, fallback ke index.html (SPA routing)
```

## File yang Diubah

### 1. `wrangler.jsonc`
- Ganti `site` → `assets` dengan full config
- Tambah `run_worker_first` untuk /api routes

### 2. `src/worker/index.ts`
- Tambah `.basePath('/api')`
- Hapus `/api` prefix di setiap `.route()`
- Hapus manual static file serving logic (getAssetFromKV)

### 3. `package.json`
- Hapus `@cloudflare/kv-asset-handler` (tidak dibutuhkan lagi)

## Verifikasi

✅ **Frontend loaded:**
```bash
curl https://renew-home-account.itscomen.workers.dev
# Returns: <!doctype html><html>... (index.html content)
```

✅ **API working:**
```bash
curl https://renew-home-account.itscomen.workers.dev/api/health
# Returns: {"status":"ok"}
```

## Pelajaran

Pola dari **silpasala** (project-tracker) menunjukkan:
1. **Tidak perlu custom Worker logic untuk static files** — Cloudflare `assets` binding handle otomatis
2. **`run_worker_first` adalah kunci** — Tanpa ini, static files tidak bisa di-fallback ke Worker
3. **`not_found_handling: "single-page-application"`** — Penting untuk React SPA (404s → index.html)
4. **Separation of concerns** — Worker handle hanya API, ASSETS handle hanya static files

## Referensi
- Silpasala project: `C:\Users\Aleph-2026\Documents\project\project-tracker`
- Wrangler docs: https://developers.cloudflare.com/workers/configuration/sites-assets/

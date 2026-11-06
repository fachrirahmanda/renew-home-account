# 📱 Panduan Penggunaan - Renew Home Account

## 🎯 Ringkasan Aplikasi

Aplikasi web untuk **listing email Netflix** dengan fitur:
- ✅ Login/Register dengan Email + Password
- ✅ Koneksi ke Gmail
- ✅ Sinkronisasi email dari Gmail
- ✅ Filter dan tampilkan email Netflix
- ✅ Tampilan responsif & user-friendly

---

## 🚀 Mulai Sekarang

### 1. Buka Terminal
```bash
cd C:\Users\Aleph-2026\Documents\project\renew-home-account
npm run dev
```

### 2. Buka Browser
Akses: **http://localhost:5173**

Anda akan melihat halaman Login ✅

---

## 📖 Panduan Langkah demi Langkah

### STEP 1️⃣ - Register Akun Baru

**Di halaman Login:**

1. Klik tombol **"Belum punya akun? Daftar"**
2. Masukkan email Anda
3. Masukkan password
4. Klik tombol **"Register"**

✅ Akun berhasil dibuat! Anda otomatis login.

---

### STEP 2️⃣ - (Opsional) Koneksikan Gmail

**Untuk melihat email Netflix dari Gmail:**

1. Dari halaman Email List, klik tombol **⚙️ Settings**
2. Scroll ke bagian **"Gmail Connection"**
3. Masukkan email Gmail Anda
4. Masukkan password Gmail

   ⚠️ **Jika 2FA aktif di Gmail:**
   - Jangan gunakan password biasa
   - Buat App Password di: https://myaccount.google.com/apppasswords
   - Gunakan 16-character password yang dihasilkan

5. Klik **"Connect Gmail"**
6. Tunggu sampai muncul pesan sukses ✅

---

### STEP 3️⃣ - Sinkronisasi Email

**Untuk mengambil email dari Gmail:**

1. Di halaman Settings, klik tombol **"🔄 Sync Emails"**
2. Tunggu proses selesai (beberapa detik)
3. Akan muncul notifikasi berhasil dengan jumlah email

✅ Email dari Gmail sudah tersimpan!

---

### STEP 4️⃣ - Lihat Email Netflix

**Untuk melihat daftar email Netflix:**

1. Kembali ke halaman **"Email List"** (klik logo atau back button)
2. Anda akan melihat daftar email Netflix yang tersinkronisasi
3. Setiap email menampilkan:
   - Pengirim (From)
   - Penerima (To)
   - Subjek (Subject)
   - Tanggal terima
   - Preview isi email

**Navigasi Email:**
- Klik **"Next"** untuk halaman berikutnya (20 email per halaman)
- Klik **"Previous"** untuk halaman sebelumnya
- Klik nomor halaman untuk langsung ke halaman tertentu

---

### STEP 5️⃣ - Logout

**Untuk keluar dari aplikasi:**

1. Di halaman Email List, klik tombol **"Logout"** (kanan atas)
2. Anda akan kembali ke halaman Login

---

## ⚙️ Menu & Fitur

### 🔐 Halaman Login (`/login`)

**Toggle Mode:**
- **Register** - Untuk membuat akun baru
- **Login** - Untuk masuk dengan akun yang sudah ada

**Validasi:**
- Email harus valid
- Password minimal 1 karakter (improve di production!)

---

### 📧 Halaman Email List (`/emails`)

**Header:**
- Nama user yang login
- Tombol Settings ⚙️
- Tombol Logout

**Content:**
- Tabel email dengan info lengkap
- Filter otomatis: hanya email Netflix yang ditampilkan
- Pagination controls

**Fitur:**
- Lihat email metadata
- Baca preview isi email
- Navigasi halaman

---

### ⚙️ Halaman Settings (`/settings`)

**Info Koneksi Gmail:**
- Tampil email Gmail yang sudah terhubung (jika ada)
- Tombol untuk mengubah koneksi

**Form Koneksi:**
- Input: Email Gmail
- Input: Password/App Password
- Tombol: Connect Gmail

**Sinkronisasi:**
- Tombol: Sync Emails (untuk fetch email baru)
- Notifikasi status & jumlah email

**Navigasi:**
- Tombol Back untuk kembali ke email list

---

## 🔑 Akun Test

Anda bisa membuat akun baru atau menggunakan:

| Field | Value |
|-------|-------|
| Email | test@example.com |
| Password | password123 |

*(Jika sudah ada di database lokal)*

---

## ❓ FAQ & Troubleshooting

### Q: Saya lupa password, gimana?
**A:** Aplikasi belum punya fitur "reset password". Buat akun baru dengan email berbeda.

### Q: Email Gmail tidak tersinkronisasi
**Cek:**
1. Pastikan email & password Gmail benar
2. Jika 2FA aktif, pastikan gunakan App Password (bukan regular password)
3. Klik "Sync Emails" lagi
4. Tunggu beberapa detik

### Q: Halaman blank/error
**A:** 
1. Buka DevTools (F12)
2. Check tab "Console" untuk error message
3. Refresh halaman (Ctrl+R)
4. Restart server dengan `npm run dev`

### Q: Email Netflix tidak muncul
**A:** 
1. Pastikan Gmail sudah connected di Settings
2. Pastikan sudah klik "Sync Emails"
3. Email harus memiliki kata "Netflix" di subject
4. Cek email Gmail langsung untuk memastikan emailnya ada

### Q: Aplikasi lambat
**A:** 
- Tunggu loading selesai
- Jika email banyak, pagination akan membantu
- Refresh halaman jika stuck

### Q: Muncul error saat sync
**A:**
1. Cek Gmail credentials lagi
2. Cek 2FA & App Password
3. Cek koneksi internet
4. Try sync lagi

---

## 🎨 Tips & Trik

### Shortcut Keyboard
- **F12** - Buka Developer Tools (untuk debugging)
- **Ctrl+R** - Refresh halaman
- **Ctrl+Shift+Delete** - Clear browsing data (jika ingin reset login)

### Email Preview
- Klik email untuk melihat lebih banyak (future feature)
- Body akan di-truncate jika terlalu panjang
- Tanggal menampilkan waktu terima email

### Performance Tips
- Gunakan pagination untuk email banyak
- Sinkronisasi email secara berkala (jangan terlalu sering)
- Clear browser cache jika ada issues

---

## 🔐 Keamanan

### Password
- Di-hash dengan SHA-256 (tidak disimpan plain text)
- Minimal 1 karakter (improve di production!)
- Tidak ada kompleksitas requirement saat ini

### Gmail Password
- Disimpan di database untuk sync
- Dalam production, harus di-encrypt
- Gunakan App Password jika 2FA aktif

### Token
- Disimpan di localStorage
- Berlaku selama session aktif
- Otomatis dihapus saat logout

### Rekomendasi
✅ Jangan bagikan password dengan siapa pun
✅ Gunakan password yang kuat
✅ Logout setelah selesai (terutama di komputer publik)
✅ Jangan simpan Gmail password di tempat umum

---

## 📊 Data yang Disimpan

### Saat Register/Login
- Email user
- Password (hashed)
- Timestamp

### Saat Connect Gmail
- Email Gmail
- Password Gmail (untuk sync)
- Timestamp

### Saat Sync Email
- Semua email dari Gmail yang memiliki "Netflix" di subject
- From, To, Subject, Body, Date
- Timestamp terima email

---

## 🌐 Informasi Teknis

### Teknologi yang Digunakan
- **Frontend**: React + TypeScript
- **Backend**: Hono + Cloudflare Workers
- **Database**: SQLite (Cloudflare D1)
- **Build**: Vite
- **Browser**: Semua browser modern (Chrome, Firefox, Safari, Edge)

### Browser Requirements
- JavaScript harus enabled
- Cookies/LocalStorage harus enabled
- Koneksi internet stabil

---

## 📞 Bantuan Lebih Lanjut

### Dokumentasi Lengkap
Baca file berikut untuk detail lebih lanjut:

| File | Untuk Apa |
|------|-----------|
| **QUICK_START.md** | Setup cepat (5 menit) |
| **SETUP.md** | Panduan setup detail & troubleshooting |
| **DOCUMENTATION.md** | Dokumentasi teknis lengkap |
| **PROJECT_SUMMARY.md** | Ringkasan proyek & fitur |

### Debugging
1. Buka DevTools (F12)
2. Lihat tab "Console" untuk error
3. Lihat tab "Network" untuk API calls
4. Lihat localStorage untuk token (F12 → Application → LocalStorage)

### Error Common
| Error | Solusi |
|-------|--------|
| `Cannot connect to server` | Pastikan `npm run dev` berjalan |
| `Gmail password incorrect` | Verifikasi email & password |
| `No emails found` | Sinkronisasi Gmail dulu |
| `Token invalid` | Login ulang |

---

## ✅ Checklist Pertama Kali Pakai

- [ ] Install dependencies (`npm install`)
- [ ] Start dev server (`npm run dev`)
- [ ] Buka http://localhost:5173
- [ ] Register akun baru
- [ ] Login dengan akun tersebut
- [ ] Pergi ke Settings
- [ ] Connect Gmail (opsional)
- [ ] Sinkronisasi email
- [ ] Lihat email Netflix di list
- [ ] Coba pagination
- [ ] Logout

---

## 🎉 Selesai!

Sekarang Anda sudah tahu cara menggunakan aplikasi Renew Home Account!

**Nikmati listing email Netflix Anda! 📧✨**

---

## 📝 Catatan

- Aplikasi masih dalam development (version 0.0.1)
- Ada fitur yang mungkin belum sempurna
- Feedback & suggestions sangat diterima
- Check documentation files untuk info lebih detail

---

*Last Updated: November 6, 2026*
*Version: 0.0.1 - Development Ready*

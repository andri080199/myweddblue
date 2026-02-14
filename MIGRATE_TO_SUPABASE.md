# 🚀 Tutorial: Migrasi Database ke Supabase

Tutorial lengkap untuk memindahkan database PostgreSQL lokal (`undangan_db`) ke Supabase PostgreSQL.

---

## 📋 Prerequisites

- [x] PostgreSQL lokal sudah berjalan
- [x] Database `undangan_db` ada dan berisi data
- [x] PostgreSQL tools (`pg_dump`, `psql`) terinstall
- [ ] Akun Supabase (gratis) - https://supabase.com

---

## 🎯 Step-by-Step Guide

### **Step 1: Setup Supabase Project**

#### 1.1 Buat Akun & Project

1. Kunjungi https://supabase.com
2. Sign up dengan GitHub/Google
3. Klik **"New Project"**
4. Isi form:
   ```
   Name: myweddblue
   Database Password: [buat password kuat - SIMPAN INI!]
   Region: Southeast Asia (Singapore)
   ```
5. Klik **"Create new project"** (tunggu ~2 menit)

#### 1.2 Dapatkan Connection String

1. Di Supabase Dashboard, klik **⚙️ Settings** (kiri bawah)
2. Klik **Database** di sidebar
3. Scroll ke section **"Connection string"**
4. Pilih tab **"Connection pooling"**
5. Pilih mode **"Transaction"**
6. Copy connection string, contoh:
   ```
   postgresql://postgres.abcdefgh:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```
7. **Ganti `[PASSWORD]` dengan password yang Anda buat di step 1.1**

---

### **Step 2: Export Database Lokal**

#### 2.1 Menggunakan Script Otomatis (Recommended)

```bash
# Jalankan script yang sudah disediakan
./migrate-to-supabase.sh
```

Script akan:
- ✅ Export database `undangan_db` ke file backup
- ✅ Memberikan instruksi lengkap untuk import ke Supabase

#### 2.2 Manual Export (Alternatif)

```bash
# Export semua (schema + data)
pg_dump -h localhost -p 5432 -U postgres -d undangan_db -F p -f backup.sql

# Masukkan password PostgreSQL lokal jika diminta
```

**Troubleshooting:**
- Jika gagal: pastikan PostgreSQL lokal running
- Jika error "permission denied": tambahkan `sudo` di depan command
- Jika tidak tau password: reset di PostgreSQL config

---

### **Step 3: Import ke Supabase**

#### 3.1 Via Terminal (Recommended)

```bash
# Ganti SUPABASE_URL dengan connection string dari Step 1.2
psql "postgresql://postgres.abcdefgh:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres" -f backup.sql
```

**Expected output:**
```
SET
SET
CREATE TABLE
ALTER TABLE
INSERT 0 5
INSERT 0 12
...
```

#### 3.2 Via Supabase SQL Editor (untuk database kecil)

1. Buka Supabase Dashboard
2. Klik **🔍 SQL Editor** di sidebar
3. Klik **"New query"**
4. Paste isi file `backup.sql` (jika file < 1MB)
5. Klik **"Run"** atau tekan `Ctrl+Enter`

**Warning:** Jika file > 1MB, gunakan cara 3.1 (terminal)

---

### **Step 4: Update Konfigurasi Next.js**

#### 4.1 Backup .env.local Lama

```bash
cp .env.local .env.local.backup
```

#### 4.2 Update DATABASE_URL

Edit file `.env.local`:

```env
# PRODUCTION - Supabase (gunakan ini)
DATABASE_URL=postgresql://postgres.abcdefgh:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres

# BACKUP - Local (comment untuk production)
# DATABASE_URL=postgresql://postgres:password@localhost:5432/undangan_db
```

**Ganti:**
- `abcdefgh` → Project Ref dari Supabase
- `[PASSWORD]` → Password database Supabase

#### 4.3 Test Connection

```bash
# Install dependencies (jika belum)
npm install

# Test development server
npm run dev
```

Buka browser: http://localhost:3000/admin

**Cek:**
- ✅ Login admin berhasil
- ✅ Dashboard menampilkan data clients
- ✅ CRUD operations berfungsi normal

---

### **Step 5: Verifikasi Data di Supabase**

#### 5.1 Via Supabase Dashboard

1. Klik **🗄️ Table Editor** di sidebar
2. Lihat semua tabel yang ter-import:
   - `clients`
   - `client_content`
   - `client_gallery`
   - `client_theme`
   - `unified_themes`
   - `bank_logos`
   - `music_library`
   - `ornament_library`
   - dll.

3. Klik table → cek data ada dan lengkap

#### 5.2 Via SQL Query

```sql
-- Cek jumlah clients
SELECT COUNT(*) FROM clients;

-- Cek data terbaru
SELECT * FROM clients ORDER BY created_at DESC LIMIT 5;

-- Cek semua tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

---

## 🔒 Security Best Practices

### 1. Enable Row Level Security (RLS)

Di Supabase SQL Editor, jalankan:

```sql
-- Enable RLS untuk semua tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_gallery ENABLE ROW LEVEL SECURITY;
-- ... untuk semua tables sensitif
```

### 2. Buat Policies (Opsional)

```sql
-- Example: hanya authenticated users bisa read
CREATE POLICY "Allow authenticated read"
ON clients
FOR SELECT
TO authenticated
USING (true);
```

### 3. Environment Variables

**JANGAN commit `.env.local` ke Git!**

Update `.gitignore`:
```
.env.local
.env.*.local
.env.production
```

---

## 🚢 Deploy ke Production

### Vercel (Recommended)

1. Push code ke GitHub
2. Buka https://vercel.com
3. Import GitHub repository
4. Di **Environment Variables**, tambahkan:
   ```
   DATABASE_URL = postgresql://postgres.abcdefgh:[PASSWORD]@...supabase.com:6543/postgres
   ```
5. Deploy!

### Environment Variables di Vercel

```env
# Required
DATABASE_URL=postgresql://...supabase.com:6543/postgres

# Optional (jika pakai Supabase Auth/Storage)
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

---

## 📊 Monitoring & Maintenance

### Database Usage

Di Supabase Dashboard > **Settings > Usage**:
- Database size (max 500MB di free tier)
- Connection count
- Bandwidth usage

### Backup Strategy

1. **Automatic Backups**: Supabase membuat daily backup otomatis (Pro plan)
2. **Manual Backups**:
   ```bash
   pg_dump "postgresql://...supabase.com:6543/postgres" -f backup_$(date +%Y%m%d).sql
   ```

---

## 🆘 Troubleshooting

### Error: "password authentication failed"

**Solusi:**
1. Pastikan password benar (yang dibuat saat setup project)
2. Reset password di Supabase Dashboard > Settings > Database > Reset password

### Error: "too many connections"

**Solusi:**
1. Gunakan **Connection pooling** (Transaction mode) bukan Direct connection
2. Atau upgrade ke Supabase Pro plan

### Error: "relation does not exist"

**Solusi:**
1. Re-import backup: `psql "..." -f backup.sql`
2. Check case-sensitive table names (PostgreSQL peka huruf besar/kecil)

### Data tidak muncul di aplikasi

**Checklist:**
- ✅ DATABASE_URL di .env.local sudah diganti?
- ✅ Restart development server (`npm run dev`)
- ✅ Clear browser cache
- ✅ Check console untuk error messages

---

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

## ✅ Checklist Migration

- [ ] Setup Supabase project
- [ ] Export database lokal (`./migrate-to-supabase.sh`)
- [ ] Import ke Supabase (`psql ... -f backup.sql`)
- [ ] Update `.env.local` dengan Supabase URL
- [ ] Test aplikasi locally (`npm run dev`)
- [ ] Verifikasi data di Supabase dashboard
- [ ] Enable RLS (optional)
- [ ] Deploy ke Vercel
- [ ] Test production URL

---

**🎉 Selamat! Database Anda sekarang di cloud dengan Supabase!**

Jika ada masalah, cek section Troubleshooting atau tanya di Discord/Forum Supabase.

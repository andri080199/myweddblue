# 📋 Import Schema ke Supabase (Manual via Browser)

Karena connection string bermasalah, cara termudah adalah import manual via Supabase SQL Editor.

---

## 🚀 Langkah-langkah:

### Step 1: Buka Supabase SQL Editor

1. Buka browser, kunjungi:
   ```
   https://supabase.com/dashboard/project/zwiocvemyivfkomdqrwt/sql/new
   ```

2. Atau navigasi manual:
   - https://supabase.com/dashboard
   - Pilih project **zwiocvemyivfkomdqrwt**
   - Klik **SQL Editor** di sidebar kiri
   - Klik **New query**

---

### Step 2: Copy Schema File

Buka file schema di text editor:

**Linux/Mac:**
```bash
cat schema_20260214_224801.sql
```

**Windows:**
```bash
type schema_20260214_224801.sql
```

Atau buka dengan VSCode:
```bash
code schema_20260214_224801.sql
```

---

### Step 3: Paste & Run

1. **Select All** content dari file `schema_20260214_224801.sql`
2. **Copy** (Ctrl+C / Cmd+C)
3. **Paste** di Supabase SQL Editor
4. **Run** (Ctrl+Enter atau klik tombol Run)

**Warning:** File 28KB, jadi paste mungkin agak lama (3-5 detik)

---

### Step 4: Verifikasi Tables Created

Setelah run berhasil:

1. **Cek Table Editor**
   - Klik **Table Editor** di sidebar
   - Lihat list tabel yang ter-create:
     - ✅ bank_logos
     - ✅ catalog_templates
     - ✅ client_content
     - ✅ client_gallery
     - ✅ client_theme
     - ✅ clients
     - ✅ custom_background_themes
     - ✅ custom_color_themes
     - ✅ custom_themes
     - ✅ guestbook_entries
     - ✅ music_library
     - ✅ ornament_library
     - ✅ rsvp_responses
     - ✅ template_ornaments
     - ✅ unified_themes

2. **Klik salah satu tabel** → cek strukturnya (columns, types)

---

## 🔍 Troubleshooting

### Error: "extension dblink does not exist"

**Solusi:** Hapus baris berikut dari file schema (line 25):
```sql
CREATE EXTENSION IF NOT EXISTS dblink WITH SCHEMA public;
```

Lalu paste ulang.

### Error: "permission denied"

**Solusi:** Cek apakah Anda login sebagai owner project di Supabase.

### File terlalu besar untuk paste

**Alternatif:** Split file menjadi beberapa bagian:

```bash
# Split schema file (buat 3 parts)
split -l 500 schema_20260214_224801.sql schema_part_

# Akan membuat:
# - schema_part_aa
# - schema_part_ab
# - schema_part_ac
```

Paste satu-satu ke SQL Editor.

---

## ✅ Setelah Import Berhasil

1. **Update .env.local**
   ```bash
   cp .env.local .env.local.backup
   cp .env.supabase.example .env.local
   ```

2. **Test aplikasi**
   ```bash
   npm run dev
   ```

3. **Check connection**
   - Buka http://localhost:3000/admin
   - Database sekarang connect ke Supabase!
   - Tabel sudah ada, tapi kosong (belum ada data)

---

## 🎯 Next Steps

Setelah struktur database ter-import:

1. **Buat data dummy via aplikasi** (recommended):
   - Login admin
   - Create client baru
   - Test CRUD operations

2. **Atau import data dari lokal** (optional):
   ```bash
   # Export data only (tanpa schema)
   pg_dump -h localhost -U postgres -d undangan_db --data-only -f data.sql

   # Import via SQL Editor atau psql
   ```

---

**🎉 Done! Schema database sudah ada di Supabase cloud!**
